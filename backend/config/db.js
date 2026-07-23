const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);

    // Seed Digio Credentials
    const DigioCredential = require('../models/DigioCredential');
    const digioCount = await DigioCredential.countDocuments();
    if (digioCount === 0) {
      await DigioCredential.create({
        client_id: process.env.DIGIO_CLIENT_ID || 'default_client_id',
        client_secret: process.env.DIGIO_CLIENT_SECRET || 'default_client_secret',
        api_base_url: process.env.DIGIO_API_BASE_URL || 'https://api.digio.in',
        workflow_name: process.env.DIGIO_WORKFLOW_NAME || 'AadharPanVerify',
        isActive: false
      });
      console.log('Digio credentials seeded into database.'.green);
    }

    // Seed Angel Credentials
    const AngelCredential = require('../models/AngelCredential');
    const angelCount = await AngelCredential.countDocuments();
    if (angelCount === 0) {
      await AngelCredential.create({
        apiKey: process.env.ANGEL_API_KEY || 'default_api_key',
        clientCode: process.env.ANGEL_CLIENT_CODE || 'default_client_code',
        password: process.env.ANGEL_PASSWORD || 'default_password',
        totpSecret: process.env.ANGEL_TOTP_SECRET || 'default_totp_secret',
        baseUrl: process.env.ANGEL_BASE_URL || 'https://apiconnect.angelbroking.com',
        marketBaseUrl: process.env.ANGEL_MARKET_BASE_URL || 'https://apiconnect.angelone.in',
        isActive: true
      });
      console.log('Angel One credentials seeded into database.'.green);
    }
  } catch (error) {
    console.error(`MongoDB Connection Failed: ${error.message}`.red.bold);
    console.log('Server is running without Database. Database-dependent features may fail.'.yellow);
  }
};

module.exports = connectDB;
