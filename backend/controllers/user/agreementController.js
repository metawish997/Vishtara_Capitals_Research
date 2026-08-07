const ejs = require('ejs');
const html_to_pdf = require('html-pdf-node');
const path = require('path');
const fs = require('fs-extra');
const axios = require('axios');
const DraftAgreement = require('../../models/user/DraftAgreement');
const UserAgreement = require('../../models/user/UserAgreement');
const KycVerification = require('../../models/user/KycVerification');
const Coupon = require('../../models/Coupon');
const User = require('../../models/User');
const UserSubscription = require('../../models/user/UserSubscription');
const Invoice = require('../../models/user/Invoice');
const ManualPayment = require('../../models/user/ManualPayment');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const mongoose = require('mongoose');
const DigioCredential = require('../../models/DigioCredential');
const RazorpayCredential = require('../../models/RazorpayCredential');
const leadConversionService = require('../../services/leadConversionService');

// @desc    Store draft agreement and initiate e-sign
// @route   POST /api/v1/agreement/draft
// @access  Private
exports.storeDraftAgreement = async (req, res) => {
    try {
        console.log("=== storeDraftAgreement Hit ===");
        console.log("Payload:", req.body);

        const { plan_id, duration_id, coupon_code, plan_name, duration, features, current_url } = req.body;

        const user = await User.findById(req.user.id);

        // ============================================================
        // 🛡️ KYC DEBUG LOGS - All KYC records for this user
        // ============================================================
        const allKycRecords = await KycVerification.find({ user: user._id }).sort({ createdAt: -1 });

        console.log("\n========== 🛡️ KYC DEBUG START ==========");
        console.log(`👤 User: ${user.name} (${user.email}) | ID: ${user._id}`);
        console.log(`📋 User.kyc_status (from User model): ${user.kyc_status || 'NOT SET'}`);
        console.log(`📊 Total KYC Records Found: ${allKycRecords.length}`);

        if (allKycRecords.length === 0) {
            console.log("❌ No KYC records found for this user.");
        } else {
            console.log("\n--- All KYC Records ---");
            allKycRecords.forEach((kycRec, index) => {
                const isApproved = ['approved', 'completed', 'success'].includes(kycRec.status);
                console.log(`\n  [${index + 1}] KYC ID: ${kycRec._id}`);
                console.log(`       Status       : ${kycRec.status} ${isApproved ? '✅ APPROVED' : '❌ NOT APPROVED'}`);
                console.log(`       Digio Doc ID : ${kycRec.digio_document_id || 'N/A'}`);
                console.log(`       Reference ID : ${kycRec.reference_id || 'N/A'}`);
                console.log(`       Customer Name: ${kycRec.customer_name || 'N/A'}`);
                console.log(`       Mobile       : ${kycRec.customer_mobile || 'N/A'}`);
                console.log(`       KYC Details  :`, JSON.stringify(kycRec.kyc_details, null, 2));
            });
        }

        // Pick the latest KYC (most recent)
        const latestKyc = allKycRecords[0] || null;
        const approvedKyc = allKycRecords.find(k => ['approved', 'completed', 'success'].includes(k.status));

        console.log("\n--- KYC Selection Summary ---");
        console.log(`  Latest KYC Status  : ${latestKyc ? latestKyc.status : 'None'}`);
        console.log(`  Approved KYC Found : ${approvedKyc ? `✅ YES (ID: ${approvedKyc._id})` : '❌ NO'}`);
        if (approvedKyc) {
            console.log(`  Approved KYC Details:`);
            console.log(`    - Aadhaar : ${approvedKyc.kyc_details?.aadhaar || 'N/A'}`);
            console.log(`    - PAN     : ${approvedKyc.kyc_details?.pan || 'N/A'}`);
            console.log(`    - Name    : ${approvedKyc.kyc_details?.name || approvedKyc.customer_name || 'N/A'}`);
            console.log(`    - Raw Response (actions):`, JSON.stringify(approvedKyc.raw_response?.actions, null, 2));
        }
        console.log("========== 🛡️ KYC DEBUG END ==========\n");
        // ============================================================

        const credential = await DigioCredential.findOne({ isActive: true });

        // If Digio is active, KYC must be approved
        let isKycApproved = false;
        if (credential) {
            isKycApproved = (latestKyc && ['approved', 'completed', 'success'].includes(latestKyc.status)) || user.kyc_status === 'approved';
            if (!isKycApproved) {
                console.log("⚠️ KYC NOT APPROVED — normally this blocks, but bypassing as requested.");
                // Bypassed!
            }
        }

        const kyc = latestKyc || {};

        // Anti-duplication check
        const pendingFlow = await DraftAgreement.findOne({
            user: user._id,
            plan_id,
            duration_id,
            status: 'payment_pending'
        });

        if (pendingFlow) {
            return res.status(403).json({ success: false, message: 'Your payment for this specific plan and duration is under verification.' });
        }

        // Price calculation from DB
        const durationRecord = await mongoose.model('ServicePlanDuration').findById(duration_id);
        if (!durationRecord) {
            return res.status(404).json({ success: false, message: 'Invalid plan duration.' });
        }

        let basePrice = durationRecord.price;
        let finalAmount = basePrice;
        let couponId = null;

        // Apply Coupon if provided
        if (coupon_code) {
            const coupon = await Coupon.findOne({
                code: coupon_code.toUpperCase(),
                active: true,
                $or: [
                    { expires_at: { $exists: false } },
                    { expires_at: { $gte: new Date() } }
                ]
            });

            if (coupon) {
                if (!coupon.min_amount || basePrice >= coupon.min_amount) {
                    couponId = coupon._id;
                    let discount = 0;
                    if (coupon.type === 'percent') {
                        discount = (basePrice * coupon.value) / 100;
                    } else {
                        discount = coupon.value;
                    }
                    finalAmount = Math.max(0, basePrice - discount);
                }
            }
        }

        // Agreement Number Generation
        const year = new Date().getFullYear();
        const agreementCount = await UserAgreement.countDocuments({
            createdAt: { $gte: new Date(year, 0, 1) }
        });
        const agreementNo = `AGR-${year}-${(agreementCount + 1).toString().padStart(4, '0')}`;

        // Extract KYC Data
        const aadhaarNumber = kyc.kyc_details?.aadhaar || 'Manual KYC Verified';
        const panNumber = kyc.kyc_details?.pan || 'Manual KYC Verified';

        // Signature base64
        let signature_base64 = null;
        if (kyc.signature_image) {
            // kyc.signature_image = "/uploads/kyc/userId/signature_xxx.jpg"
            // storeMediaLocally saves to /backend/uploads/kyc/... NOT /backend/public/uploads/kyc/
            // So strip the leading slash and join with process.cwd() (= /backend)
            const signaturePath = path.join(process.cwd(), kyc.signature_image.replace(/^\//, ''));
            if (await fs.pathExists(signaturePath)) {
                const image = await fs.readFile(signaturePath);
                const ext = path.extname(signaturePath).replace('.', '');
                signature_base64 = `data:image/${ext};base64,${image.toString('base64')}`;
            }
        }

        const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0];

        const templatePath = path.join(__dirname, '../../views/pdf/agreement.ejs');
        const html = await ejs.renderFile(templatePath, {
            user,
            kyc,
            agreementNo,
            planName: plan_name,
            planDuration: duration,
            planAmount: finalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 }),
            features,
            aadhaarNumber,
            panNumber,
            signature_base64,
            timestamp
        });

        // ────────────────────────────────────────────────────────────────────────────────
        let pdfBuffer = null;
        let pdfPath = null;
        let docId = null;
        let signUrl = null;

        // Bypass Digio flow completely during purchase only if KYC is incomplete
        const bypassDigioForNow = !isKycApproved;

        if (credential && !bypassDigioForNow) {
            const options = { format: 'A3', printBackground: true };
            const file = { content: html };
            const fileName = `agreements/${agreementNo}.pdf`;


            console.log("\n========== 📄 PDF GENERATION START ==========");
            console.log(`  Agreement No : ${agreementNo}`);
            console.log(`  File Name    : ${fileName}`);

            try {
                pdfBuffer = await html_to_pdf.generatePdf(file, options);
                const uploadsDir = path.join(process.cwd(), 'uploads');
                const uploadPath = path.join(uploadsDir, fileName);
                await fs.ensureDir(path.dirname(uploadPath));
                await fs.writeFile(uploadPath, pdfBuffer);
                pdfPath = `/uploads/${fileName}`;
                console.log(`  ✅ PDF generated & saved locally: ${pdfPath}`);
                console.log(`  📦 PDF Buffer size: ${pdfBuffer.length} bytes`);
            } catch (pdfError) {
                console.error('  ❌ PDF generation failed:', pdfError.message);
                return res.status(500).json({ success: false, message: 'PDF generation failed: ' + pdfError.message });
            }
            console.log("========== 📄 PDF GENERATION END ==========\n");

            // ────────────────────────────────────────────────────────────────────────────────
            // 🛡️ STEP 2: Extract KYC verification data for Digio rules
            // ────────────────────────────────────────────────────────────────────────────────
            const rawAadhaar = kyc.raw_response?.actions?.[0]?.details?.aadhaar?.id_number;
            const last4Aadhaar = rawAadhaar ? rawAadhaar.slice(-4) : '';
            const kycName = kyc.raw_response?.actions?.[0]?.details?.aadhaar?.name || user.name;
            const kycGender = kyc.raw_response?.actions?.[0]?.details?.aadhaar?.gender || null;
            const kycDob = kyc.raw_response?.actions?.[0]?.details?.aadhaar?.dob || null;
            const kycYob = kycDob ? kycDob.slice(-4) : null; // year of birth

            console.log("\n========== 🛡️ DIGIO UPLOAD PREP ==========");
            console.log(`  Signer Phone  : ${user.phone || user.mobile || 'N/A'}`);
            console.log(`  Signer Name   : ${kycName}`);
            console.log(`  Last 4 Aadhaar: ${last4Aadhaar || 'NOT FOUND ⚠️ '}`);
            console.log(`  Gender        : ${kycGender || 'N/A'}`);
            console.log(`  Year of Birth : ${kycYob || 'N/A'}`);



            // ────────────────────────────────────────────────────────────────────────────────
            // 🚀 STEP 3: Upload PDF to Digio & get e-sign URL
            // ────────────────────────────────────────────────────────────────────────────────

            // Build enriched signature_verification rules
            const signerPhone = user.phone || user.mobile;
            const verificationRules = [];

            // Rule 1 (AND): gender + aadhaar last 4
            const andConditions = [];
            if (kycGender) {
                andConditions.push({ field: 'gender', match_type: 'exact', value: kycGender });
            }
            if (last4Aadhaar) {
                andConditions.push({ field: 'aadhaar', match_type: 'exact', value: last4Aadhaar });
            }
            if (andConditions.length) {
                verificationRules.push({ operation: 'AND', conditions: andConditions });
            }

            // Rule 2 (OR): year-of-birth OR name fuzzy match
            const orConditions = [];
            if (kycYob) {
                orConditions.push({ field: 'yob', match_type: 'exact', value: kycYob });
            }
            if (kycName) {
                orConditions.push({ field: 'name', match_type: 'fuzzy', value: kycName, threshold: '80' });
            }
            if (orConditions.length) {
                verificationRules.push({ operation: 'OR', conditions: orConditions });
            }

            const digioPayload = {
                signers: [{
                    identifier: signerPhone,
                    name: kycName,
                    sign_type: 'aadhaar',
                    reason: 'Agreement Signing'
                }],
                expire_in_days: 1,
                display_on_page: 'all',
                generate_access_token: true,
                notify_signers: true,
                file_name: `${agreementNo}.pdf`,
                file_data: pdfBuffer.toString('base64'),
                ...(verificationRules.length && {
                    signature_verification: {
                        [signerPhone]: {
                            abort_on_fail: true,
                            max_attempt: 3,
                            rules: verificationRules
                        }
                    }
                })
            };

            console.log("\n  📂 Uploading PDF to Digio...");
            console.log(`  Digio Endpoint: ${credential.api_base_url?.replace(/\/$/, '')}/v2/client/document/uploadpdf`);
            console.log(`  Verification Rules:`, JSON.stringify(verificationRules, null, 2));

            try {
                const digioResponse = await axios.post(
                    `${credential.api_base_url?.replace(/\/$/, '')}/v2/client/document/uploadpdf`,
                    digioPayload,
                    {
                        auth: {
                            username: credential.client_id,
                            password: credential.client_secret
                        }
                    }
                );

                const digioData = digioResponse.data;
                docId = digioData.id;
                signUrl = digioData.signing_parties?.[0]?.sign_url;

                if (!signUrl && digioData.access_token?.id) {
                    signUrl = `https://app.digio.in/#/gateway/login/${docId}/${digioData.access_token.id}/${signerPhone}?redirect_url=${encodeURIComponent(current_url)}`;
                }

                console.log("  ✅ Digio Upload SUCCESS!");
                console.log(`  📍 Digio Document ID : ${docId}`);
                console.log(`  🔗 E-Sign URL         : ${signUrl || 'N/A'}`);
                console.log(`  📋 Digio Response:`, JSON.stringify({
                    id: digioData.id,
                    file_name: digioData.file_name,
                    agreement_status: digioData.agreement_status,
                    signing_parties: digioData.signing_parties,
                    access_token: digioData.access_token
                }, null, 2));

                if (!docId) {
                    throw new Error(digioData.message || 'Digio API did not return a document ID.');
                }
            } catch (digioErr) {
                console.error("  ❌ Digio Upload FAILED!");
                console.error(`  Error: ${digioErr.message}`);
                if (digioErr.response) {
                    console.error(`  Digio Error Response:`, JSON.stringify(digioErr.response.data, null, 2));
                }
                throw digioErr;
            }
        } else {
            console.log("⏺️   Digio credential NOT active — skipping PDF & esign upload.");
        }
        console.log("========== 🛡️ DIGIO UPLOAD END ==========\n");

        // ────────────────────────────────────────────────────────────────────────────────
        // 💾 STEP 4: Save Draft Agreement in DB (always esign_pending)
        // ────────────────────────────────────────────────────────────────────────────────
        let draft = await DraftAgreement.findOne({
            user: user._id,
            plan_id,
            duration_id,
            status: { $in: ['esign_pending', 'kyc_pending', 'signed'] }
        });

        // 'kyc_pending' = KYC skip karke purchase hua, baad mein profile se e-sign hoga
        // 'esign_pending' = KYC complete tha, Digio par bheja gaya, sign nahi hua abhi
        const targetStatus = (credential && !bypassDigioForNow) ? 'esign_pending' : 'kyc_pending';

        if (draft) {
            draft.try_count += 1;
            draft.digio_document_id = docId || draft.digio_document_id;
            draft.esign_url = signUrl || draft.esign_url;
            draft.pdf_path = pdfPath || draft.pdf_path;
            draft.status = targetStatus;
            await draft.save();
            console.log(`  ✅ Existing Draft Updated | ID: ${draft._id} | Status: ${draft.status} | Try Count: ${draft.try_count}`);
        } else {
            draft = await DraftAgreement.create({
                user: user._id,
                plan_id,
                duration_id,
                agreement_no: agreementNo,
                plan_name,
                amount: finalAmount,
                duration,
                aadhaar_number: aadhaarNumber,
                agreement_details: features,
                pdf_path: pdfPath,
                digio_document_id: docId,
                esign_url: signUrl,
                status: targetStatus,
                try_count: 1,
                coupon: couponId,
                coupon_code: coupon_code,
                expires_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
            });
            console.log(`  ✅ New Draft Created | ID: ${draft._id} | Status: ${draft.status}`);
        }

        res.status(200).json({
            success: true,
            redirect_url: signUrl,
            draft_id: draft._id,
            digio_document_id: draft.digio_document_id,
            status: draft.status
        });

    } catch (error) {
        console.error('\n❌ Draft Agreement Error:', error.message);
        if (error.response) {
            console.error('   Axios Error Response:', JSON.stringify(error.response.data, null, 2));
        }
        res.status(500).json({
            success: false,
            message: error.response?.data?.message || error.message
        });
    }
};

// @desc    Check agreement status by Draft ID (polls Digio, downloads signed PDF)
// @route   GET /api/v1/user/agreements/status/:id
// @access  Private
exports.checkAgreementStatus = async (req, res) => {
    try {
        const agreement = await DraftAgreement.findById(req.params.id);
        if (!agreement) {
            return res.status(404).json({ success: false, message: 'Agreement not found' });
        }

        console.log("\n========== 🛡️ CHECK ESIGN STATUS START ==========");
        console.log(`  Draft ID      : ${agreement._id}`);
        console.log(`  Agreement No  : ${agreement.agreement_no}`);
        console.log(`  Digio Doc ID  : ${agreement.digio_document_id}`);
        console.log(`  Current Status: ${agreement.status}`);
        console.log(`  Try Count     : ${agreement.try_count}`);

        // ── 1. LOCK: payment already submitted ──────────────────────────
        if (agreement.status === 'payment_pending') {
            console.log("  🔒 Status locked (payment_pending)");
            console.log("========== 🛡️ CHECK ESIGN STATUS END ==========\n");
            return res.status(200).json({
                success: true,
                status: 'payment_pending',
                message: 'Your payment is under review. Status is locked.'
            });
        }

        // ── 2. Already signed — return immediately ──────────────────────
        if (agreement.status === 'signed') {
            console.log("  ✅ Already signed — returning immediately.");
            console.log("========== 🛡️ CHECK ESIGN STATUS END ==========\n");
            return res.status(200).json({
                success: true,
                status: 'signed',
                pdf_path: agreement.pdf_path || null,
                message: 'Agreement is already signed.'
            });
        }

        // ── 3. E-Sign pending: Digio check FIRST, try_count after ────────
        if (agreement.status === 'esign_pending') {
            const credential = await DigioCredential.findOne({ isActive: true });
            if (!credential) {
                return res.status(500).json({ success: false, message: 'Digio configuration is missing or inactive.' });
            }

            const digioDocId = agreement.digio_document_id;
            if (!digioDocId) {
                return res.status(400).json({ success: false, message: 'Digio Document ID not found on this agreement.' });
            }

            console.log(`  📡 Calling Digio: ${credential.api_base_url?.replace(/\/$/, '')}/v2/client/document/${digioDocId}`);

            try {
                const digioRes = await axios.get(
                    `${credential.api_base_url?.replace(/\/$/, '')}/v2/client/document/${digioDocId}`,
                    { auth: { username: credential.client_id, password: credential.client_secret } }
                );

                const digioData = digioRes.data;
                console.log(`  Digio agreement_status : ${digioData.agreement_status}`);
                console.log(`  Digio signing_parties  :`, JSON.stringify(
                    digioData.signing_parties?.map(p => ({
                        identifier: p.identifier,
                        status: p.status,
                        signed_at: p.signed_at
                    })), null, 2
                ));

                // ✅ DIGIO COMPLETED → download signed PDF FIRST, then update status
                if (digioData.agreement_status === 'completed') {
                    console.log("  ✅ E-Sign COMPLETED on Digio — downloading signed PDF...");

                    try {
                        const downloadUrl = `${credential.api_base_url?.replace(/\/$/, '')}/v2/client/document/download?document_id=${digioDocId}`;
                        console.log(`  📥 Download URL: ${downloadUrl}`);

                        const pdfRes = await axios.get(downloadUrl, {
                            auth: { username: credential.client_id, password: credential.client_secret },
                            responseType: 'arraybuffer'
                        });

                        const signedFileName = `signed_agreements/${agreement.agreement_no}.pdf`;
                        const signedPath = path.join(process.cwd(), 'uploads', signedFileName);

                        await fs.ensureDir(path.dirname(signedPath));
                        await fs.writeFile(signedPath, pdfRes.data);

                        agreement.pdf_path = `/uploads/${signedFileName}`;
                        console.log(`  ✅ Signed PDF saved to: ${signedPath}`);
                        console.log(`  📦 Size: ${pdfRes.data.byteLength} bytes`);
                    } catch (pdfErr) {
                        console.error('  ❌ Signed PDF download failed:', pdfErr.message);
                        if (pdfErr.response) {
                            console.error('     Digio error:', JSON.stringify(pdfErr.response.data, null, 2));
                        }
                        // Non-fatal — status still transitions to signed
                    }

                    // Update status to signed AFTER download attempt
                    agreement.status = 'signed';
                    agreement.esign_completed_at = new Date();
                    await agreement.save();

                    console.log(`  ✅ Draft saved | Status: signed | pdf_path: ${agreement.pdf_path}`);
                    console.log("========== 🛡️ CHECK ESIGN STATUS END ==========\n");

                    return res.status(200).json({
                        success: true,
                        status: 'signed',
                        pdf_path: agreement.pdf_path || null,
                        message: 'Agreement signed successfully. Please proceed to payment.'
                    });
                }

                // Digio not completed — fall through to try_count check
                console.log(`  ⏳ Digio still pending | status: ${digioData.agreement_status}`);

            } catch (digioApiErr) {
                console.error('  ❌ Digio API call failed:', digioApiErr.message);
                // Don't block — fall through to try_count check
            }

            // ── Try count gate (only if Digio still pending) ──────────────
            console.log(`  Try count gate: ${agreement.try_count}/3`);
            console.log("========== 🛡️ CHECK ESIGN STATUS END ==========\n");

            if (agreement.try_count >= 3) {
                return res.status(200).json({
                    success: false,
                    status: 'esign_pending',
                    try_count: agreement.try_count,
                    message: 'Maximum e-sign attempts exceeded. Please contact admin.',
                    disable_button: true
                });
            }

            return res.status(200).json({
                success: true,
                status: 'esign_pending',
                try_count: agreement.try_count,
                message: `E-sign pending. Attempts: ${agreement.try_count}/3`,
                disable_button: false
            });
        }

        // ── Any other status — return as-is ──────────────────────────────
        console.log("========== 🛡️ CHECK ESIGN STATUS END ==========\n");
        return res.status(200).json({
            success: true,
            status: agreement.status,
            message: `Status: ${agreement.status}`
        });

    } catch (error) {
        console.error('Check Status Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};


// @desc    Find existing draft agreement
// @route   GET /api/v1/user/agreements/draft/:planId/:durationId
// @access  Private
exports.findDraft = async (req, res) => {
    try {
        const { planId, durationId } = req.params;
        const draft = await DraftAgreement.findOne({
            user: req.user.id,
            plan_id: planId,
            duration_id: durationId,
            status: { $in: ['esign_pending', 'kyc_pending', 'signed', 'payment_pending'] },
            expires_at: { $gt: new Date() }
        });

        if (draft) {
            return res.status(200).json({ success: true, draft });
        }

        res.status(200).json({ success: false, message: 'No active draft found' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Submit manual payment
// @route   POST /api/v1/user/agreements/manual-payment
// @access  Private
exports.submitManualPayment = async (req, res) => {
    try {
        const { plan_id, duration_id, amount } = req.body;
        const user = await User.findById(req.user.id);
        const latestKyc = await KycVerification.findOne({ user: user._id }).sort({ createdAt: -1 });

        const draft = await DraftAgreement.findOne({
            user: user._id,
            plan_id,
            duration_id,
            status: { $in: ['signed', 'esign_pending', 'kyc_pending'] }
        }).sort({ createdAt: -1 });

        if (!draft) {
            const pendingDraft = await DraftAgreement.findOne({
                user: user._id,
                plan_id,
                duration_id,
                status: 'payment_pending'
            });
            const msg = pendingDraft
                ? 'A manual payment is already under review for this agreement.'
                : 'Please initiate the plan purchase first.';
            return res.status(422).json({ success: false, message: msg });
        }

        const isFree = Number(draft.amount) === 0;

        if (!isFree && !req.file) {
            return res.status(400).json({ success: false, message: 'Payment screenshot is required' });
        }


        const kyc = latestKyc;

        // 1. Update Draft Status to Lock it
        draft.status = 'payment_pending';
        await draft.save();

        // 2. Subscription Dates Calculation
        let startDate = new Date();

        // Check for existing active/pending subscription for the same plan and duration
        const existingSubscription = await UserSubscription.findOne({
            user: user._id,
            service_plan: plan_id,
            service_plan_duration: duration_id,
            status: { $in: ['active', 'pending'] },
            end_date: { $gt: new Date() }
        }).sort({ end_date: -1 });

        if (existingSubscription) {
            startDate = new Date(existingSubscription.end_date);
            startDate.setDate(startDate.getDate() + 1);
            startDate.setHours(0, 0, 0, 0);
        }

        const ServicePlanDuration = require('../../models/services/ServicePlanDuration');
        const planDuration = await ServicePlanDuration.findById(duration_id);
        const endDate = new Date(startDate);

        if (planDuration) {
            if (planDuration.duration_months) {
                endDate.setMonth(endDate.getMonth() + planDuration.duration_months);
            }
        } else {
            endDate.setMonth(endDate.getMonth() + 1); // fallback
        }

        const subscription = await UserSubscription.create({
            user: user._id,
            service_plan: plan_id,
            service_plan_duration: duration_id,
            start_date: startDate,
            end_date: endDate,
            status: 'pending',
            amount: draft.amount,
            coupon: draft.coupon,
            coupon_code: draft.coupon_code,
            currency: 'INR',
            payment_gateway: 'manual',
            payment_status: 'pending'
        });

        // 4. Create Invoice
        const lastInvoice = await Invoice.findOne().sort({ createdAt: -1 });
        const lastNum = lastInvoice ? parseInt(lastInvoice.invoice_number.replace('INV', '')) : 0;
        const invoiceNo = `INV${(lastNum + 1).toString().padStart(6, '0')}`;

        const invoice = await Invoice.create({
            user: user._id,
            user_subscription: subscription._id,
            invoice_number: invoiceNo,
            amount: draft.amount,
            coupon: draft.coupon,
            coupon_code: draft.coupon_code,
            currency: 'INR',
            payment_gateway: 'manual',
            invoice_date: new Date(),
            service_start_date: startDate,
            service_end_date: endDate
        });

        // 5. Create Final Agreement Record (Only if Digio active)
        const credential = await DigioCredential.findOne({ isActive: true });

        if (credential) {
            const agreement = await UserAgreement.create({
                user: user._id,
                subscription: subscription._id,
                invoice: invoice._id,
                invoice_number: invoiceNo,
                agreement_number: draft.agreement_no,
                coupon: draft.coupon,
                coupon_code: draft.coupon_code,
                signed_at: draft.status === 'signed' ? new Date() : null,
                is_signed: draft.status === 'signed',
                status: 'pending',
                pdf_path: draft.pdf_path,
                user_snapshot: { id: user._id, name: user.name, email: user.email, phone: user.phone },
                kyc_snapshot: kyc ? kyc.kyc_details : {},
                subscription_snapshot: { plan_name: draft.plan_name, duration: draft.duration },
                invoice_snapshot: invoice.toObject()
            });

            // 6. Download Signed PDF from Digio
            if (draft.digio_document_id) {
                try {
                    const digioResponse = await axios.get(
                        `${credential.api_base_url?.replace(/\/$/, '')}/v2/client/document/download?document_id=${draft.digio_document_id}`,
                        {
                            auth: {
                                username: credential.client_id,
                                password: credential.client_secret
                            },
                            responseType: 'arraybuffer'
                        }
                    );
                    const signedFileName = `signed_agreements/${draft.agreement_no}_signed.pdf`;
                    const uploadsDir = path.join(process.cwd(), 'uploads');
                    const signedPath = path.join(uploadsDir, signedFileName);
                    await fs.ensureDir(path.dirname(signedPath));
                    await fs.writeFile(signedPath, digioResponse.data);

                    // Update agreement with PDF path
                    await UserAgreement.findByIdAndUpdate(agreement._id, { pdf_path: `/uploads/${signedFileName}` });
                } catch (err) {
                    console.error('Failed to download signed PDF:', err.message);
                }
            }
        }

        // 7. Payment Proof Upload (Only if file exists)
        let screenshotPath = null;
        if (req.file) {
            const screenshotName = `${Date.now()}_${req.file.originalname}`;
            // Save to /backend/uploads/payment_proofs/ (served by Express /uploads static)
            // multer disk-storage writes a temp file to uploads/temp/ → move it to final location
            const uploadsDir = path.join(process.cwd(), 'uploads', 'payment_proofs');
            await fs.ensureDir(uploadsDir);
            const destPath = path.join(uploadsDir, screenshotName);
            await fs.move(req.file.path, destPath, { overwrite: true });
            screenshotPath = `/uploads/payment_proofs/${screenshotName}`;
        }

        await ManualPayment.create({
            user: user._id,
            plan_id: plan_id,
            duration_id: duration_id,
            plan_name: draft.plan_name,
            duration_name: draft.duration,
            amount: amount,
            screenshot: screenshotPath,
            coupon: draft.coupon,
            coupon_code: draft.coupon_code,
            status: 'pending'
        });

        res.status(200).json({ success: true, message: 'Payment submitted successfully. Verification pending.' });

    } catch (error) {
        console.error('Manual Payment Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Increment Try Count for E-sign
// @route   POST /api/v1/user/agreements/increment-try/:id
// @access  Private
exports.incrementTryCount = async (req, res) => {
    try {
        const agreement = await DraftAgreement.findById(req.params.id);

        if (!agreement) {
            return res.status(404).json({ success: false, message: 'Agreement not found' });
        }

        if (agreement.status !== 'esign_pending') {
            return res.status(200).json({
                success: true,
                status: agreement.status,
                message: 'Agreement is not in e-sign pending status'
            });
        }

        agreement.try_count = (agreement.try_count || 0) + 1;
        await agreement.save();

        if (agreement.try_count > 3) {
            return res.status(200).json({
                success: false,
                status: 'esign_pending',
                try_count: agreement.try_count,
                message: 'Maximum attempts exceeded. Please contact admin.',
                disable_button: true
            });
        }

        res.status(200).json({
            success: true,
            status: 'esign_pending',
            try_count: agreement.try_count,
            message: `E-sign pending. Attempts: ${agreement.try_count}/3`
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create Razorpay Order
// @route   POST /api/v1/user/agreements/create-razorpay-order
// @access  Private
exports.createRazorpayOrder = async (req, res) => {
    try {
        const { plan_id, duration_id } = req.body;
        const user = await User.findById(req.user.id);
        const draft = await DraftAgreement.findOne({
            user: req.user.id,
            plan_id,
            duration_id,
            status: { $in: ['signed', 'esign_pending', 'kyc_pending'] }
        }).sort({ createdAt: -1 });

        if (!draft) {
            return res.status(404).json({ success: false, message: 'Valid agreement draft not found. Please initiate the plan purchase.' });
        }

        const credential = await RazorpayCredential.findOne({ isActive: true });
        if (!credential || !credential.keyId || !credential.keySecret) {
            return res.status(500).json({ success: false, message: 'Razorpay credentials not found in database.' });
        }

        const razorpay = new Razorpay({
            key_id: credential.keyId,
            key_secret: credential.keySecret
        });

        const options = {
            amount: Math.round(draft.amount * 100), // in paisa
            currency: "INR",
            receipt: draft.agreement_no,
        };

        const order = await razorpay.orders.create(options);

        draft.razorpay_order_id = order.id;
        await draft.save();

        res.status(200).json({
            success: true,
            order,
            key: credential.keyId,
            user_details: {
                name: user ? user.name : (req.user.name || ''),
                email: user ? user.email : (req.user.email || ''),
                contact: user ? user.phone : (req.user.phone || '')
            }
        });
    } catch (error) {
        console.error('Razorpay Order Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/v1/user/agreements/verify-razorpay-payment
// @access  Private
exports.verifyRazorpayPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan_id, duration_id } = req.body;

        const credential = await RazorpayCredential.findOne({ isActive: true });
        if (!credential || !credential.keySecret) {
            return res.status(500).json({ success: false, message: 'Razorpay credentials not found in database.' });
        }

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", credential.keySecret)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature !== expectedSign) {
            return res.status(400).json({ success: false, message: "Invalid payment signature" });
        }

        const user = await User.findById(req.user.id);
        const latestKyc = await KycVerification.findOne({ user: user._id }).sort({ createdAt: -1 });
        const draft = await DraftAgreement.findOne({
            user: user._id,
            plan_id,
            duration_id,
            razorpay_order_id
        });

        if (!draft) {
            return res.status(404).json({ success: false, message: 'Agreement draft not found' });
        }

        const kyc = latestKyc;

        // 1. Lock Draft Status
        draft.status = 'expired'; // Or 'completed' if you add that enum
        await draft.save();

        // 2. Subscription Dates Calculation
        let startDate = new Date();
        let subscriptionStatus = 'active';

        // Check for existing active/pending subscription for the same plan and duration
        const existingSubscription = await UserSubscription.findOne({
            user: user._id,
            service_plan: plan_id,
            service_plan_duration: duration_id,
            status: { $in: ['active', 'pending'] },
            end_date: { $gt: new Date() }
        }).sort({ end_date: -1 });

        if (existingSubscription) {
            startDate = new Date(existingSubscription.end_date);
            startDate.setDate(startDate.getDate() + 1);
            startDate.setHours(0, 0, 0, 0);
            subscriptionStatus = 'pending';
        }

        const ServicePlanDuration = require('../../models/services/ServicePlanDuration');
        const planDuration = await ServicePlanDuration.findById(duration_id);
        const endDate = new Date(startDate);

        if (planDuration) {
            if (planDuration.duration_months) {
                endDate.setMonth(endDate.getMonth() + planDuration.duration_months);
            }
        } else {
            endDate.setMonth(endDate.getMonth() + 1); // fallback
        }

        // 3. Create Active Subscription
        const subscription = await UserSubscription.create({
            user: user._id,
            service_plan: plan_id,
            service_plan_duration: duration_id,
            start_date: startDate,
            end_date: endDate,
            status: subscriptionStatus,
            amount: draft.amount,
            coupon: draft.coupon,
            coupon_code: draft.coupon_code,
            currency: 'INR',
            payment_gateway: 'razorpay',
            payment_status: 'completed',
            razorpay_order_id,
            razorpay_payment_id
        });

        // 4. Create Paid Invoice
        const lastInvoice = await Invoice.findOne().sort({ createdAt: -1 });
        const lastNum = lastInvoice ? parseInt(lastInvoice.invoice_number.replace('INV', '')) : 0;
        const invoiceNo = `INV${(lastNum + 1).toString().padStart(6, '0')}`;

        const invoice = await Invoice.create({
            user: user._id,
            user_subscription: subscription._id,
            invoice_number: invoiceNo,
            amount: draft.amount,
            coupon: draft.coupon,
            coupon_code: draft.coupon_code,
            currency: 'INR',
            payment_gateway: 'razorpay',
            payment_reference: razorpay_payment_id,
            invoice_date: new Date(),
            service_start_date: startDate,
            service_end_date: endDate
        });
        // 5. Create Final Agreement (Only if Digio active)
        const digioCredential = await DigioCredential.findOne({ isActive: true });

        if (digioCredential) {
            const agreement = await UserAgreement.create({
                user: user._id,
                subscription: subscription._id,
                invoice: invoice._id,
                invoice_number: invoiceNo,
                agreement_number: draft.agreement_no,
                coupon: draft.coupon,
                coupon_code: draft.coupon_code,
                signed_at: draft.status === 'signed' ? new Date() : null,
                is_signed: draft.status === 'signed',
                status: draft.status === 'signed' ? subscriptionStatus : 'pending',
                pdf_path: draft.pdf_path, // ðŸ”¥ Inherit from Draft
                user_snapshot: { id: user._id, name: user.name, email: user.email, phone: user.phone },
                kyc_snapshot: kyc ? kyc.kyc_details : {},
                subscription_snapshot: { plan_name: draft.plan_name, duration: draft.duration },
                invoice_snapshot: invoice.toObject()
            });

            // 6. Secondary PDF Archival (Safety Check)
            if (!draft.pdf_path && draft.digio_document_id) {
                try {
                    const digioResponse = await axios.get(
                        `${credential.api_base_url?.replace(/\/$/, '')}/v2/client/document/download?document_id=${draft.digio_document_id}`,
                        {
                            auth: {
                                username: credential.client_id,
                                password: credential.client_secret
                            },
                            responseType: 'arraybuffer'
                        }
                    );

                    const signedFileName = `signed_agreements/${draft.agreement_no}.pdf`;
                    const uploadsDir = path.join(__dirname, '../../../uploads');
                    const signedPath = path.join(uploadsDir, signedFileName);

                    const fs = require('fs-extra');
                    await fs.ensureDir(path.dirname(signedPath));
                    await fs.writeFile(signedPath, digioResponse.data);

                    // Update both records
                    draft.pdf_path = `/uploads/${signedFileName}`;
                    await draft.save();

                    agreement.pdf_path = `/uploads/${signedFileName}`;
                    await agreement.save();

                    console.log(`âœ… Signed PDF archived (Secondary): ${draft.agreement_no}`);
                } catch (err) {
                    console.error('Secondary PDF Archival Failed:', err.response?.data || err.message);
                }
            }
        }

        try {
            await leadConversionService.convertLeadAfterSuccessfulPayment(user);
        } catch (error) {
            console.error('Lead Conversion Error:', error);
        }

        res.status(200).json({
            success: true,
            message: 'Payment verified and subscription activated successfully!',
            subscription_id: subscription._id
        });

    } catch (error) {
        console.error('Razorpay Verification Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all active account services (Subscriptions, Invoices, Agreements)
// @route   GET /api/v1/user/agreements/account-services
// @access  Private
exports.getAccountServices = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('kycVerification');

        let subscriptions = await UserSubscription.find({ user: req.user.id })
            .populate('service_plan service_plan_duration')
            .sort({ createdAt: -1 });

        // Handle Legacy Subscriptions (if no records in UserSubscription yet)
        if (subscriptions.length === 0 && user.subscription && user.subscription.plan_name) {
            subscriptions = [{
                _id: 'legacy',
                service_plan: { name: user.subscription.plan_name },
                service_plan_duration: { duration: 'Existing Plan' },
                start_date: user.createdAt,
                end_date: user.subscription.expiry_date,
                status: user.subscription.status?.toLowerCase() || 'active',
                is_legacy: true
            }];
        }

        const invoices = await Invoice.find({ user: req.user.id })
            .sort({ createdAt: -1 });

        // Fetch all UserAgreements with subscription details for plan_id/duration_id
        const finalizedAgreements = await UserAgreement.find({ user: req.user.id })
            .populate({ path: 'subscription', populate: { path: 'service_plan service_plan_duration' } })
            .sort({ createdAt: -1 });

        const finalizedAgrNumbers = finalizedAgreements.map(a => a.agreement_number);
        // new updates........
        // Remaining DraftAgreements not yet finalized into UserAgreement
        const draftAgreements = await DraftAgreement.find({
            user: req.user.id,
            agreement_no: { $nin: finalizedAgrNumbers }
        }).sort({ createdAt: -1 });

        // Auto-heal Digio Statuses on load
        const DigioCredential = require('../../models/DigioCredential');
        const credential = await DigioCredential.findOne({ isActive: true });
        const axios = require('axios');
        
        let finalizedAgreementsData = [];
        for (let a of finalizedAgreements) {
            // If it has a Digio ID but no PDF, verify live from Digio
            if (a.digio_document_id && !a.pdf_path && credential) {
                try {
                    const baseUrl = credential.api_base_url.replace(/\/$/, '');
                    const digioRes = await axios.get(
                        `${baseUrl}/v2/client/document/${a.digio_document_id}`,
                        { auth: { username: credential.client_id, password: credential.client_secret } }
                    );
                    const rawStatus = (digioRes.data.agreement_status || digioRes.data.status || digioRes.data.document_status || '').toLowerCase();
                    const completedStatuses = ['completed', 'signed', 'executed', 'esigned', 'success'];
                    
                    if (completedStatuses.some(s => rawStatus.includes(s))) {
                        // It's signed on Digio
                        if (!a.is_signed) {
                            a.is_signed = true;
                            a.status = 'active';
                            a.needs_esign = false;
                            await UserAgreement.updateOne({ _id: a._id }, { $set: { is_signed: true, status: 'active', needs_esign: false } });
                        }
                    } else {
                        // It's requested or pending on Digio! Force DB to esign_pending.
                        a.is_signed = false;
                        a.status = 'esign_pending';
                        a.needs_esign = true;
                        a.pdf_path = null;
                        await UserAgreement.updateOne({ _id: a._id }, { $set: { status: 'esign_pending', is_signed: false, needs_esign: true, pdf_path: null } });
                    }
                } catch (err) {
                    console.error(`[Auto-Heal] Digio check failed for ${a.agreement_number}:`, err.message);
                }
            }

            const sub = a.subscription;

            // needsEsign: no PDF, not yet signed, AND status is 'pending' OR 'esign_pending'
            // (esign_pending = user started Digio but left without completing)
            const needsEsign = !a.pdf_path && !a.is_signed && (a.status === 'pending' || a.status === 'esign_pending');
            console.log(`[DEBUG] Agr ${a.agreement_number} - status: ${a.status}, needsEsign: ${needsEsign}`);
            
            finalizedAgreementsData.push({
                    _id: a._id,
                    agreement_number: a.agreement_number,
                    createdAt: a.createdAt,
                    pdf_path: a.pdf_path,
                    // If pdf_path exists â†’ 'Finalized'; if pending without PDF â†’ 'esign_required'
                    status: needsEsign ? 'esign_required' : (a.pdf_path ? 'Finalized' : a.status),
                    is_draft: false,
                    is_user_agreement: true,
                    needs_esign: needsEsign,
                    // Subscription data for triggering e-sign
                    plan_id: sub?.service_plan?._id || null,
                    duration_id: sub?.service_plan_duration?._id || null,
                    plan_name: a.subscription_snapshot?.plan_name || sub?.service_plan?.name || null,
                    duration: a.subscription_snapshot?.duration || sub?.service_plan_duration?.duration || null,
                    amount: a.invoice_snapshot?.amount || sub?.amount || null,
                    digio_document_id: a.digio_document_id || null
                });
        }

        const agreements = [
            ...finalizedAgreementsData,
            ...draftAgreements.map(a => ({
                _id: a._id,
                agreement_number: a.agreement_no,
                createdAt: a.createdAt,
                pdf_path: a.pdf_path,
                status: a.status,
                is_draft: true,
                is_user_agreement: false,
                needs_esign: false,
                plan_id: a.plan_id,
                duration_id: a.duration_id,
                plan_name: a.plan_name,
                duration: a.duration,
                features: a.agreement_details,
                amount: a.amount,
                try_count: a.try_count || 0,
                esign_url: a.esign_url || null
            }))
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const pending_payments = await DraftAgreement.find({
            user: req.user.id,
            status: 'payment_pending'
        }).populate('plan_id duration_id').sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            subscriptions,
            invoices,
            agreements,
            pending_payments
        });
    } catch (error) {
        console.error('Account Services Fetch Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// @desc    Complete E-Sign for an existing UserAgreement (post-payment, KYC done)
// @route   POST /api/v1/user/agreements/complete-esign/:agreementId
// @access  Private
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
exports.completeUserAgreementEsign = async (req, res) => {
    try {
        const { agreementId } = req.params;
        const { current_url } = req.body;

        const agreement = await UserAgreement.findOne({
            _id: agreementId,
            user: req.user.id
        }).populate({ path: 'subscription', populate: { path: 'service_plan service_plan_duration' } });

        if (!agreement) {
            return res.status(404).json({ success: false, message: 'Agreement not found.' });
        }

        if (agreement.pdf_path && agreement.is_signed) {
            return res.status(400).json({ success: false, message: 'This agreement is already signed.' });
        }

        // ✅ RETRY SHORTCUT: User left Digio without signing — reuse existing URL, no new PDF needed
        if (agreement.digio_document_id && agreement.esign_url && agreement.status === 'esign_pending') {
            console.log(`[RETRY] Reusing existing Digio session for ${agreement.agreement_number} | doc: ${agreement.digio_document_id}`);
            return res.status(200).json({
                success: true,
                redirect_url: agreement.esign_url,
                agreement_id: agreement._id,
                digio_document_id: agreement.digio_document_id,
                status: 'esign_pending',
                message: 'Resuming existing e-sign session.'
            });
        }

        const user = await User.findById(req.user.id);
        const credential = await DigioCredential.findOne({ isActive: true });

        if (!credential) {
            return res.status(400).json({ success: false, message: 'E-Sign service is not configured.' });
        }

        // Get KYC data
        const allKycRecords = await KycVerification.find({ user: user._id }).sort({ createdAt: -1 });
        const approvedKyc = allKycRecords.find(k => ['approved', 'completed', 'success'].includes(k.status)) || allKycRecords[0];

        if (!approvedKyc || !['approved', 'completed', 'success'].includes(approvedKyc.status)) {
            return res.status(400).json({ success: false, message: 'KYC must be approved before e-signing.' });
        }

        const kyc = approvedKyc;
        const aadhaarNumber = kyc.kyc_details?.aadhaar || 'Verified';
        const panNumber = kyc.kyc_details?.pan || 'Verified';

        // Plan details from agreement's subscription snapshot or populated subscription
        const sub = agreement.subscription;
        const planName = agreement.subscription_snapshot?.plan_name || sub?.service_plan?.name || 'Advisory Plan';
        const planDuration = agreement.subscription_snapshot?.duration || sub?.service_plan_duration?.duration || '';
        const planAmount = agreement.invoice_snapshot?.amount || sub?.amount || 0;

        // Signature base64
        let signature_base64 = null;
        if (kyc.signature_image) {
            const signaturePath = path.join(process.cwd(), kyc.signature_image.replace(/^\//, ''));
            if (await fs.pathExists(signaturePath)) {
                const image = await fs.readFile(signaturePath);
                const ext = path.extname(signaturePath).replace('.', '');
                signature_base64 = `data:image/${ext};base64,${image.toString('base64')}`;
            }
        }

        const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0];
        const templatePath = path.join(__dirname, '../../views/pdf/agreement.ejs');

        const html = await ejs.renderFile(templatePath, {
            user,
            kyc,
            agreementNo: agreement.agreement_number,
            planName,
            planDuration,
            planAmount: Number(planAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 }),
            features: agreement.subscription_snapshot?.features || [],
            aadhaarNumber,
            panNumber,
            signature_base64,
            timestamp
        });

        // Generate PDF
        const options = { format: 'A3', printBackground: true };
        const file = { content: html };
        let pdfBuffer;
        try {
            pdfBuffer = await html_to_pdf.generatePdf(file, options);
        } catch (pdfErr) {
            return res.status(500).json({ success: false, message: 'PDF generation failed: ' + pdfErr.message });
        }

        // Save pre-sign PDF locally
        const fileName = `agreements/${agreement.agreement_number}_presign.pdf`;
        const uploadPath = path.join(process.cwd(), 'uploads', fileName);
        await fs.ensureDir(path.dirname(uploadPath));
        await fs.writeFile(uploadPath, pdfBuffer);

        // Digio Upload
        const rawAadhaar = kyc.raw_response?.actions?.[0]?.details?.aadhaar?.id_number;
        const last4Aadhaar = rawAadhaar ? rawAadhaar.slice(-4) : '';
        const kycName = kyc.raw_response?.actions?.[0]?.details?.aadhaar?.name || user.name;
        const kycGender = kyc.raw_response?.actions?.[0]?.details?.aadhaar?.gender || null;
        const kycDob = kyc.raw_response?.actions?.[0]?.details?.aadhaar?.dob || null;
        const kycYob = kycDob ? kycDob.slice(-4) : null;

        const signerPhone = user.phone || user.mobile;
        const verificationRules = [];
        const andConditions = [];
        if (kycGender) andConditions.push({ field: 'gender', match_type: 'exact', value: kycGender });
        if (last4Aadhaar) andConditions.push({ field: 'aadhaar', match_type: 'exact', value: last4Aadhaar });
        if (andConditions.length) verificationRules.push({ operation: 'AND', conditions: andConditions });

        const orConditions = [];
        if (kycYob) orConditions.push({ field: 'yob', match_type: 'exact', value: kycYob });
        if (kycName) orConditions.push({ field: 'name', match_type: 'fuzzy', value: kycName, threshold: '80' });
        if (orConditions.length) verificationRules.push({ operation: 'OR', conditions: orConditions });

        const digioPayload = {
            signers: [{ identifier: signerPhone, name: kycName, sign_type: 'aadhaar', reason: 'Agreement Signing' }],
            expire_in_days: 1,
            display_on_page: 'all',
            generate_access_token: true,
            notify_signers: true,
            file_name: `${agreement.agreement_number}.pdf`,
            file_data: pdfBuffer.toString('base64'),
            ...(verificationRules.length && {
                signature_verification: {
                    [signerPhone]: { abort_on_fail: true, max_attempt: 3, rules: verificationRules }
                }
            })
        };

        let docId, signUrl;
        try {
            const digioResponse = await axios.post(
                `${credential.api_base_url?.replace(/\/$/, '')}/v2/client/document/uploadpdf`,
                digioPayload,
                { auth: { username: credential.client_id, password: credential.client_secret } }
            );
            const digioData = digioResponse.data;
            docId = digioData.id;
            signUrl = digioData.signing_parties?.[0]?.sign_url;
            if (!signUrl && digioData.access_token?.id) {
                signUrl = `https://app.digio.in/#/gateway/login/${docId}/${digioData.access_token.id}/${signerPhone}?redirect_url=${encodeURIComponent(current_url || '')}`;
            }
            if (!docId) throw new Error(digioData.message || 'Digio did not return a document ID.');
        } catch (digioErr) {
            console.error('Digio Upload Failed:', digioErr.message);
            return res.status(500).json({ success: false, message: 'E-Sign initiation failed: ' + (digioErr.response?.data?.message || digioErr.message) });
        }

        // Update UserAgreement with Digio details (updateOne bypasses required validation on old records)
        await UserAgreement.updateOne(
            { _id: agreement._id },
            {
                $set: {
                    digio_document_id: docId,
                    esign_url: signUrl,
                    status: 'esign_pending',
                    kyc_snapshot: kyc.kyc_details || kyc.toObject?.() || {},
                    user_snapshot: agreement.user_snapshot || {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        phone: user.phone
                    }
                }
            }
        );

        console.log(`[OK] UserAgreement ${agreement.agreement_number} -> Digio done | docId: ${docId}`);

        res.status(200).json({
            success: true,
            redirect_url: signUrl,
            agreement_id: agreement._id,
            digio_document_id: docId,
            status: 'esign_pending'
        });

    } catch (error) {
        console.error('Complete E-Sign Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ---------------------------------------------------------------------------
// @desc    Check Digio e-sign status for a UserAgreement & download signed PDF
// @route   GET /api/v1/user/agreements/user-agreement-status/:agreementId
// @access  Private
// ---------------------------------------------------------------------------
exports.checkUserAgreementEsignStatus = async (req, res) => {
    try {
        const agreement = await UserAgreement.findOne({
            _id: req.params.agreementId,
            user: req.user.id
        });

        if (!agreement) {
            return res.status(404).json({ success: false, message: 'Agreement not found.' });
        }

        if (agreement.pdf_path && agreement.is_signed) {
            return res.status(200).json({ success: true, status: 'signed', pdf_path: agreement.pdf_path });
        }

        if (!agreement.digio_document_id) {
            return res.status(400).json({ success: false, message: 'No Digio document linked. Please initiate e-sign first.' });
        }

        const credential = await DigioCredential.findOne({ isActive: true });
        let digioCompleted = false;
        let newPdfPath = null;

        if (credential) {
            const baseUrl = credential.api_base_url.replace(/\/$/, '');

            // Strategy 1: Try PDF download - if it works, signing is confirmed
            try {
                const pdfRes = await axios.get(
                    `${baseUrl}/v2/client/document/download?document_id=${agreement.digio_document_id}`,
                    {
                        auth: { username: credential.client_id, password: credential.client_secret },
                        responseType: 'arraybuffer'
                    }
                );
                if (pdfRes.data && pdfRes.data.byteLength > 1000) {
                    const signedFileName = `signed_agreements/${agreement.agreement_number}.pdf`;
                    const signedPath = path.join(process.cwd(), 'uploads', signedFileName);
                    await fs.ensureDir(path.dirname(signedPath));
                    await fs.writeFile(signedPath, pdfRes.data);
                    newPdfPath = `/uploads/${signedFileName}`;
                    digioCompleted = true;
                    console.log(`[OK] Signed PDF downloaded for ${agreement.agreement_number}`);
                }
            } catch (dlErr) {
                console.log(`PDF download (${agreement.agreement_number}):`, dlErr.response?.status || dlErr.message);
            }

            // Strategy 2: Check Digio document status API
            if (!digioCompleted) {
                try {
                    const digioRes = await axios.get(
                        `${baseUrl}/v2/client/document/${agreement.digio_document_id}`,
                        { auth: { username: credential.client_id, password: credential.client_secret } }
                    );
                    const d = digioRes.data;
                    console.log('Digio status:', JSON.stringify(d).substring(0, 400));
                    const rawStatus = (d.agreement_status || d.status || d.document_status || '').toLowerCase();
                    const completedStatuses = ['completed', 'signed', 'executed', 'esigned', 'success'];
                    if (completedStatuses.some(s => rawStatus.includes(s))) {
                        digioCompleted = true;
                    }
                } catch (checkErr) {
                    console.error('Digio status API error:', checkErr.message);
                }
            }
        } else {
            digioCompleted = true;
        }

        if (digioCompleted) {
            await UserAgreement.updateOne(
                { _id: agreement._id },
                {
                    $set: {
                        is_signed: true,
                        signed_at: new Date(),
                        status: 'active',
                        ...(newPdfPath && { pdf_path: newPdfPath })
                    }
                }
            );
            return res.status(200).json({
                success: true,
                status: 'signed',
                pdf_path: newPdfPath,
                message: 'Agreement signed successfully!'
            });
        }

        return res.status(200).json({
            success: true,
            status: 'esign_pending',
            message: 'Digio signing not yet confirmed.'
        });

    } catch (error) {
        console.error('Check UserAgreement E-Sign Status Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ---------------------------------------------------------------------------
// @desc    STRICTLY verify Digio document from Digio Server (Bypasses DB cache)
// @route   GET /api/v1/user/agreements/verify-strict/:agreementId
// @access  Private
// ---------------------------------------------------------------------------
exports.verifyDigioDocumentStrict = async (req, res) => {
    try {
        const paramId = req.params.agreementId;
        const mongoose = require('mongoose');
        const query = mongoose.Types.ObjectId.isValid(paramId)
            ? { _id: paramId, user: req.user.id }
            : { digio_document_id: paramId, user: req.user.id };

        const UserAgreement = require('../../models/user/UserAgreement');
        const agreement = await UserAgreement.findOne(query);

        if (!agreement) {
            return res.status(404).json({ success: false, message: 'Agreement not found.' });
        }
        if (!agreement.digio_document_id) {
            return res.status(400).json({ success: false, message: 'No Digio document linked.' });
        }

        const DigioCredential = require('../../models/DigioCredential');
        const credential = await DigioCredential.findOne({ isActive: true });
        
        if (!credential) {
            return res.status(500).json({ success: false, message: 'Digio credentials missing.' });
        }

        const baseUrl = credential.api_base_url.replace(/\/$/, '');
        const axios = require('axios');
        const fs = require('fs-extra');
        const path = require('path');
        
        let digioCompleted = false;
        let newPdfPath = null;

        try {
            console.log(`\n[DEBUG] [Strict Verify] --------------------------------------------------`);
            console.log(`[DEBUG] [Strict Verify] Checking Digio live for Document ID: ${agreement.digio_document_id}`);
            console.log(`[DEBUG] [Strict Verify] Agreement #: ${agreement.agreement_number}`);
            
            // Digio STATUS API call (NOT local DB)
            const digioRes = await axios.get(
                `${baseUrl}/v2/client/document/${agreement.digio_document_id}`,
                {
                    auth: { username: credential.client_id, password: credential.client_secret }
                }
            );
            
            const d = digioRes.data;
            const rawStatus = (d.agreement_status || d.status || d.document_status || '').toLowerCase();
            console.log(`[DEBUG] [Strict Verify] Digio LIVE status for ${agreement.digio_document_id}: ${rawStatus}`);
            
            const completedStatuses = ['completed', 'signed', 'executed', 'esigned', 'success'];
            
            if (completedStatuses.some(s => rawStatus.includes(s))) {
                digioCompleted = true;
                console.log(`[DEBUG] [Strict Verify] Document is CONFIRMED signed on Digio.`);
            } else {
                console.log(`[DEBUG] [Strict Verify] Document is NOT signed on Digio. Status is: ${rawStatus}`);
            }
        } catch (dlErr) {
            console.error(`[DEBUG] [Strict Verify] Digio API check failed for ${agreement.agreement_number}!`);
            console.error(`[DEBUG] [Strict Verify] Error Details:`, dlErr.message);
            if (dlErr.response) {
                console.error(`[DEBUG] [Strict Verify] Digio API Error Status: ${dlErr.response.status}`);
            }
        }

        if (digioCompleted) {
            await UserAgreement.updateOne(
                { _id: agreement._id },
                {
                    $set: {
                        is_signed: true,
                        signed_at: new Date(),
                        status: 'active',
                        needs_esign: false
                    }
                }
            );
            return res.status(200).json({
                success: true,
                status: 'signed',
                pdf_path: agreement.pdf_path
            });
        }

        // Force to pending because it wasn't on Digio!
        await UserAgreement.updateOne(
            { _id: agreement._id },
            { $set: { status: 'esign_pending', is_signed: false, pdf_path: null, needs_esign: true } }
        );

        return res.status(200).json({
            success: true,
            status: 'esign_pending',
            message: 'Document not found on Digio or not signed.'
        });
        
    } catch (error) {
        console.error('Strict E-Sign Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};