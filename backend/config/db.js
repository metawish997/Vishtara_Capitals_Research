const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000, // 15s — was 5s (too short for Atlas)
      socketTimeoutMS: 45000,          // Socket idle timeout
      connectTimeoutMS: 15000,         // Initial connection timeout
      heartbeatFrequencyMS: 10000,     // How often to check server health
      retryWrites: true,
      retryReads: true,
      maxPoolSize: 10,
      minPoolSize: 2,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);

    // Auto-reconnect on disconnect
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB Disconnected! Attempting reconnect in 5s...'.yellow);
      setTimeout(() => {
        connectDB().catch(err => console.error('Reconnect failed:', err.message));
      }, 5000);
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err.message);
    });

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
    console.log('Retrying in 5 seconds...'.yellow);
    // Auto-retry on initial failure
    setTimeout(() => {
      connectDB().catch(err => console.error('Retry failed:', err.message));
    }, 5000);
  }
};

module.exports = connectDB;
