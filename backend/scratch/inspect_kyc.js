const mongoose = require('mongoose');
const KycVerification = require('../models/user/KycVerification');
require('dotenv').config();

async function checkKyc() {
  await mongoose.connect(process.env.MONGO_URI);
  const kyc = await KycVerification.findOne().sort({ createdAt: -1 });
  console.log(JSON.stringify(kyc, null, 2));
  process.exit();
}

checkKyc();
