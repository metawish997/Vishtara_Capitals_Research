const mongoose = require('mongoose');
const Media = require('../models/Media');
const KycVerification = require('../models/user/KycVerification');
require('dotenv').config();

async function check() {
  await mongoose.connect(process.env.MONGO_URI);
  const userId = '69fae1cfaca0d4b3e10f9e46';
  
  console.log('--- MEDIA RECORDS ---');
  const media = await Media.find({ uploadedBy: userId });
  media.forEach(m => {
    console.log(`ID: ${m._id} | Category: ${m.fileCategory} | Name: ${m.originalName}`);
  });

  console.log('\n--- KYC RECORD ---');
  const kyc = await KycVerification.findOne({ user: userId }).sort({ createdAt: -1 });
  console.log('Status:', kyc.status);
  console.log('KYC Details:', JSON.stringify(kyc.kyc_details, null, 2));

  process.exit();
}

check();
