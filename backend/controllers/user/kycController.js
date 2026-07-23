const axios = require('axios');
const KycVerification = require('../../models/user/KycVerification');
const User = require('../../models/User');
const Media = require('../../models/Media');
const ErrorResponse = require('../../utils/errorResponse');
const asyncHandler = require('../../middlewares/async');
const fs = require('fs-extra');
const path = require('path');
const DigioCredential = require('../../models/DigioCredential');

/**
 * Helper: Approve KYC Manually
 */
const approveKycManually = async (id) => {
  const credential = await DigioCredential.findOne({ isActive: true });
  if (!credential) {
    console.error('[KYC] Digio configuration missing or inactive');
    return null;
  }
  const clientId = credential.client_id;
  const clientSecret = credential.client_secret;
  const baseUrl = credential.api_base_url?.replace(/\/$/, '');

  console.log(`[KYC] Attempting manual approval for Digio ID: ${id}`);

  const url = `${baseUrl}/client/kyc/v2/request/${id}/manage_approval`;

  try {
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const response = await axios.post(
      url,
      { status: 'approved' },
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log(`[KYC] Manual approval successful for ${id}`);
    return response.data;
  } catch (error) {
    console.error('MANUAL_APPROVAL_ERROR:', error.response?.data || error.message);
    return null;
  }
};

/**
 * Helper: Download file from Digio
 */
const downloadFileFromDigio = async (fileId) => {
  const credential = await DigioCredential.findOne({ isActive: true });
  if (!credential) {
    console.error('[KYC] Digio configuration missing or inactive');
    return null;
  }
  const clientId = credential.client_id;
  const clientSecret = credential.client_secret;
  const baseUrl = credential.api_base_url?.replace(/\/$/, '');
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  try {
    const response = await axios.get(`${baseUrl}/client/kyc/v2/media/${fileId}`, {
      params: { base64: 'true' },
      headers: { Authorization: `Basic ${auth}` },
    });
    if (response.data && response.data.file_in_base64) {
      return Buffer.from(response.data.file_in_base64, 'base64');
    }
    return null;
  } catch (error) {
    console.error(`[KYC] Download error for ${fileId}:`, error.response?.data || error.message);
    return null;
  }
};

/**
 * Helper: Store Media Locally (and in Media Collection)
 */
async function storeMediaLocally(fileId, type, userId, kycModel, providedBuffer = null) {
  try {
    let buffer;
    let fileName;

    if (providedBuffer) {
      buffer = providedBuffer;
      fileName = `${type}_${Date.now()}.jpg`;
    } else {
      if (!fileId) return null;
      buffer = await downloadFileFromDigio(fileId);
      if (!buffer) return null;
      fileName = `${type}_${fileId}.jpg`;
    }

    // Define path
    const uploadDir = path.join(__dirname, '../../uploads/kyc', userId.toString());
    await fs.ensureDir(uploadDir);

    const filePath = path.join(uploadDir, fileName);
    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/kyc/${userId}/${fileName}`;

    // Update kyc record with direct image field
    const updateData = {};
    updateData[`${type}_image`] = publicUrl;
    
    // Also keep in kyc_details for backward compatibility
    const updatedDetails = { ...kycModel.kyc_details };
    updatedDetails[`${type}_local_path`] = publicUrl;
    
    await KycVerification.findByIdAndUpdate(kycModel._id, {
      ...updateData,
      kyc_details: updatedDetails
    });

    console.log(`[KYC] ${type} image stored directly for user ${userId}: ${publicUrl}`);
    return publicUrl;
  } catch (error) {
    console.error(`STORE_IMAGE_ERROR (${type}):`, error.message);
    return null;
  }
}

/**
 * Helper: Fetch and Update KYC Status
 */
const fetchAndUpdateKycStatus = async (id) => {
  const credential = await DigioCredential.findOne({ isActive: true });
  if (!credential) {
    console.error('[KYC] Digio configuration missing or inactive');
    return null;
  }
  const clientId = credential.client_id;
  const clientSecret = credential.client_secret;
  const baseUrl = credential.api_base_url?.replace(/\/$/, '');

  const url = `${baseUrl}/client/kyc/v2/${id}/response`;

  try {
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const response = await axios.post(
      url,
      {},
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = response.data;
    if (!data) {
      console.error('[KYC] No data received from Digio status API');
      return null;
    }

    let status = (data.status || 'pending').toLowerCase();

    // AUTO APPROVAL LOGIC: If status is approval_pending, try to approve it automatically
    if (status === 'approval_pending' || status === 'requested' || status === 'initiated') {
      console.log(`[KYC] Status is ${status}, triggering auto-approval for ${id}`);
      const approvalResult = await approveKycManually(id);
      if (approvalResult && approvalResult.status) {
        status = approvalResult.status.toLowerCase();
      }
    }

    // Build KYC Details
    const kycDetails = {
      aadhaar: null,
      signature_file: null,
      selfie_file: null,
      face_match: null,
      pan: null,
    };

    let aadhaarDetails = null;

    if (data.actions && Array.isArray(data.actions)) {
      for (const action of data.actions) {
        // Aadhaar
        if (action.type === 'digilocker' && action.details?.aadhaar) {
          const aadhar = action.details.aadhaar;
          kycDetails.aadhaar = aadhar.id_number || aadhar.masked_aadhaar_number;
          kycDetails.face_match = action.face_match_result;
          aadhaarDetails = aadhar;
          
          // Ensure name and DOB are also in kycDetails for easier frontend access
          kycDetails.name = aadhar.name;
          kycDetails.dob = aadhar.dob;
          kycDetails.address = aadhar.current_address || aadhar.address;
          
          // Handle Base64 Image from Digilocker
          if (aadhar.image) {
            kycDetails.aadhaar_base64 = aadhar.image;
          }
          
          if (action.file_id) {
            kycDetails.aadhaar_file = action.file_id;
          }
        }

        // PAN
        if (action.type === 'pan' || (action.details && action.details.pan)) {
          const pan = action.details.pan || action.details;
          kycDetails.pan = pan.id_number || pan.pan_number;
          if (action.file_id) {
            kycDetails.pan_file = action.file_id;
          }
        }

        // Signature
        if (
          action.type === 'image' &&
          action.rules_data?.strict_validation_types?.includes('signature')
        ) {
          kycDetails.signature_file = action.file_id;
        }

        // Selfie
        if (action.type === 'selfie') {
          kycDetails.selfie_file = action.file_id;
        }
      }
    }

    // Update KYC Record
    const kyc = await KycVerification.findOneAndUpdate(
      { digio_document_id: id },
      {
        status,
        kyc_details: kycDetails,
        aadhaar_details: aadhaarDetails,
        raw_response: data,
        kyc_completed_at: ['approved', 'completed', 'success'].includes(status) ? new Date() : null,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!kyc) {
      console.error(`[KYC] Record not found in database for document ID: ${id}`);
      return null;
    }

    // Sync status and rich details to User record
    const userUpdate = { kyc_status: status };
    
    // Only perform deep sync if approved and not already synced (or force sync if you prefer)
    if (['approved', 'completed', 'success'].includes(status)) {
      userUpdate.is_kyc_synced = true;
      userUpdate.adhar_card = kycDetails.aadhaar;
      userUpdate.pan_card = kycDetails.pan;
      
      // Map images if available
      if (kyc.aadhaar_image) userUpdate.adhar_card_image = kyc.aadhaar_image;
      if (kyc.pan_image) userUpdate.pan_card_image = kyc.pan_image;
      
      // Map rich Aadhaar details if available
      if (aadhaarDetails) {
        if (aadhaarDetails.name) userUpdate.name = aadhaarDetails.name;
        if (aadhaarDetails.gender) {
          const g = aadhaarDetails.gender.toUpperCase();
          userUpdate.gender = g === 'M' ? 'male' : (g === 'F' ? 'female' : 'other');
        }
        
        // Handle DOB (DD/MM/YYYY -> Date)
        if (aadhaarDetails.dob) {
          const parts = aadhaarDetails.dob.split('/');
          if (parts.length === 3) {
            userUpdate.dob = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
          }
        }
        
        if (aadhaarDetails.father_name) userUpdate.father_name = aadhaarDetails.father_name;
        if (aadhaarDetails.current_address) userUpdate.address = aadhaarDetails.current_address;
        
        // Address components
        const addr = aadhaarDetails.current_address_details;
        if (addr) {
          if (addr.district_or_city) userUpdate.city = addr.district_or_city;
          if (addr.state) userUpdate.state = addr.state;
          if (addr.pincode) userUpdate.pincode = addr.pincode;
        }
      }
    }
    
    await User.findByIdAndUpdate(kyc.user, userUpdate);

    // Attempt to download media
    if (kycDetails.signature_file) {
      await storeMediaLocally(kycDetails.signature_file, 'signature', kyc.user, kyc);
    }
    if (kycDetails.selfie_file) {
      await storeMediaLocally(kycDetails.selfie_file, 'selfie', kyc.user, kyc);
    }
    if (kycDetails.aadhaar_file) {
      await storeMediaLocally(kycDetails.aadhaar_file, 'aadhaar', kyc.user, kyc);
    } else if (kycDetails.aadhaar_base64) {
      const buffer = Buffer.from(kycDetails.aadhaar_base64, 'base64');
      await storeMediaLocally(null, 'aadhaar', kyc.user, kyc, buffer);
    }
    
    if (kycDetails.pan_file) {
      await storeMediaLocally(kycDetails.pan_file, 'pan', kyc.user, kyc);
    }

    // Fetch the absolute latest record with images populated
    return await KycVerification.findById(kyc._id);
  } catch (error) {
    console.error('FETCH_STATUS_ERROR:', error.response?.data || error.message);
    return null;
  }
};

/**
 * @desc    Initiate Digio KYC
 * @route   POST /api/v1/kyc/initiate
 * @access  Private
 */
exports.initiateKyc = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  const mobile = req.body.phone || user.phone;
  const name = req.body.name || user.name;

  // 1. Check for existing active KYC
  const lastKyc = await KycVerification.findOne({ user: user._id }).sort({ createdAt: -1 });

  // 'requested' = Digio session created but user never completed it (abandoned) — allow retry
  // Block only if genuinely in-progress or already approved
  if (lastKyc && ['pending', 'approval_pending', 'approved', 'initiated'].includes(lastKyc.status)) {
    return res.status(400).json({
      success: false,
      message: 'KYC already in progress or completed',
    });
  }

  // 2. Load Digio Config
  const credential = await DigioCredential.findOne({ isActive: true });
  if (!credential) {
    console.error('DIGIO_CONFIG_MISSING_OR_INACTIVE');
    return next(new ErrorResponse('Digio configuration missing or inactive', 500));
  }
  const clientId = credential.client_id;
  const clientSecret = credential.client_secret;
  const baseUrl = credential.api_base_url?.replace(/\/$/, '');
  const workflow = credential.workflow_name;

  // 3. Create Digio KYC Request
  const referenceId = `KYC_${Date.now()}`;
  const transactionId = referenceId;

  const payload = {
    template_name: workflow,
    customer_identifier: mobile,
    customer_name: name,
    reference_id: referenceId,
    transaction_id: transactionId,
    notify_customer: false,
    expire_in_days: 1,
    message: 'KYC Verification',
  };

  try {
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const response = await axios.post(`${baseUrl}/client/kyc/v2/request/with_template`, payload, {
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    });

    const data = response.data;

    if (!data.id) {
      return res.status(400).json({
        success: false,
        message: 'Digio response missing document id',
        error: data,
      });
    }

    const documentId = data.id;

    // 4. Save KYC Entry
    await KycVerification.create({
      user: user._id,
      digio_document_id: documentId,
      customer_name: name,
      customer_mobile: mobile,
      customer_email: user.email,
      reference_id: referenceId,
      transaction_id: transactionId,
      status: 'initiated',
      kyc_details: { type: 're-kyc' },
      raw_response: data,
    });

    // 5. Build Redirect URL
    const redirectBase = baseUrl.includes('ext.digio')
      ? 'https://ext.digio.in/#/gateway/login/'
      : 'https://app.digio.in/#/gateway/login/';

    const redirectUrl = `${redirectBase}${documentId}/${Date.now()}/${mobile}?redirect_url=${encodeURIComponent(
      `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard/settings/kyc?kyc_callback=true&digio_doc_id=${documentId}`
    )}`;

    res.status(200).json({
      success: true,
      document_id: documentId,
      redirect_url: redirectUrl,
    });
  } catch (error) {
    console.error('DIGIO_KYC_ERROR:', error.response?.data || error.message);
    return next(new ErrorResponse(error.response?.data?.message || 'Digio API error', error.response?.status || 500));
  }
});

/**
 * @desc    Digio Callback Handler
 * @route   GET /api/v1/kyc/callback
 * @access  Public
 */
exports.digioCallback = asyncHandler(async (req, res, next) => {
  const { digio_doc_id } = req.query;

  if (!digio_doc_id) {
    return next(new ErrorResponse('Invalid callback: document ID missing', 400));
  }

  // Find KYC record
  const kyc = await KycVerification.findOne({ digio_document_id: digio_doc_id });

  if (!kyc) {
    return next(new ErrorResponse('KYC record not found', 404));
  }

  // If status is eligible for manual approval
  if (['initiated', 'approval_pending', 'requested'].includes(kyc.status)) {
    await approveKycManually(digio_doc_id);
  }

  // Fetch final status and details
  await fetchAndUpdateKycStatus(digio_doc_id);

  // Redirect back to frontend
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  res.redirect(`${frontendUrl}/dashboard/settings/kyc?kyc_status=updated`);
});

/**
 * @desc    Check KYC Status Direct
 * @route   GET /api/v1/kyc/status
 * @access  Private
 */
exports.checkKycStatus = asyncHandler(async (req, res, next) => {
  const credential = await DigioCredential.findOne({ isActive: true });
  const user = await User.findById(req.user.id);
  
  if (!credential) {
    const status = user && user.kyc_status ? user.kyc_status : 'pending';
    return res.status(200).json({
      success: true,
      digio_active: false,
      kyc_status: status,
      kyc_details: status === 'approved' ? { aadhaar: 'Manual Verified', pan: 'Manual Verified' } : null,
      message: 'Digio is inactive, KYC is manually managed.'
    });
  }

  const kyc = await KycVerification.findOne({ user: req.user.id }).sort({ createdAt: -1 });

  if (!kyc) {
    return res.status(200).json({
      success: true,
      digio_active: true,
      kyc_status: user && user.kyc_status ? user.kyc_status : 'none',
      message: 'No KYC record found',
    });
  }

  const updatedKyc = await fetchAndUpdateKycStatus(kyc.digio_document_id);

  res.status(200).json({
    success: true,
    digio_active: true,
    kyc_status: updatedKyc ? updatedKyc.status : (user && user.kyc_status ? user.kyc_status : 'pending'),
    kyc_details: updatedKyc ? updatedKyc.kyc_details : null,
    aadhaar_details: updatedKyc ? updatedKyc.aadhaar_details : null,
    raw_response: updatedKyc ? updatedKyc.raw_response : null,
  });
});

// @desc    Get full KYC and User details for the current user
// @route   GET /api/v1/kyc/full-details
// @access  Private
exports.getKycFullDetails = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  const credential = await DigioCredential.findOne({ isActive: true });
  if (!credential) {
    const status = user.kyc_status || 'pending';
    return res.status(200).json({
      success: true,
      digio_active: false,
      user,
      kyc: { status: status, kyc_details: status === 'approved' ? { aadhaar: 'Manual Verified', pan: 'Manual Verified' } : null },
      kyc_details: status === 'approved' ? { aadhaar: 'Manual Verified', pan: 'Manual Verified' } : null,
      message: 'Digio is inactive, KYC is manually managed.'
    });
  }

  const kyc = await KycVerification.findOne({ user: req.user.id }).sort({ createdAt: -1 });

  if (!kyc) {
    return res.status(200).json({
      success: true,
      digio_active: true,
      user,
      kyc: null,
      message: 'No KYC record found'
    });
  }

  // Always refresh to get latest status and artifacts
  const updatedKyc = await fetchAndUpdateKycStatus(kyc.digio_document_id);

  res.status(200).json({
    success: true,
    digio_active: true,
    user,
    kyc: updatedKyc || kyc,
    kyc_details: updatedKyc ? updatedKyc.kyc_details : kyc.kyc_details,
    aadhaar_details: updatedKyc ? updatedKyc.aadhaar_details : kyc.aadhaar_details,
    raw_response: updatedKyc ? updatedKyc.raw_response : kyc.raw_response,
  });
});

exports.approveKycManually = approveKycManually;
exports.storeMediaLocally = storeMediaLocally;
exports.fetchAndUpdateKycStatus = fetchAndUpdateKycStatus;
