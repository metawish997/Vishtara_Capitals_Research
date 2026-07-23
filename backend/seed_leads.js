const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const colors = require('colors');

const LeadSource = require('./models/LeadSource');
const LeadCategory = require('./models/LeadCategory');
const LeadStatus = require('./models/LeadStatus');

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

const seedData = async () => {
  try {
    // Connect to DB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to DB for seeding leads...'.cyan);

    // 1. Seed Lead Sources
    await LeadSource.deleteMany();
    const sources = [
      { name: 'Website', status: true },
      { name: 'Facebook', status: true },
      { name: 'Instagram', status: true },
      { name: 'Google Ads', status: true },
      { name: 'Referral', status: true },
      { name: 'WhatsApp', status: true },
      { name: 'Manual Entry', status: true },
      { name: 'Trade Show', status: true },
      { name: 'Other', status: true }
    ];
    await LeadSource.insertMany(sources);
    console.log('✔ Lead Sources Seeded successfully!'.green);

    // 2. Seed Lead Categories with Harmonious HSL/Hex Colors
    await LeadCategory.deleteMany();
    const categories = [
      { name: 'Hot Lead', color: '#EF4444', status: true },      // Red
      { name: 'Warm Lead', color: '#F59E0B', status: true },     // Orange/Yellow
      { name: 'Cold Lead', color: '#3B82F6', status: true },     // Blue
      { name: 'Investor', color: '#6366F1', status: true },      // Indigo
      { name: 'Trader', color: '#8B5CF6', status: true },        // Purple
      { name: 'Corporate', color: '#10B981', status: true },     // Green
      { name: 'Retail', color: '#6B7280', status: true }         // Gray
    ];
    await LeadCategory.insertMany(categories);
    console.log('✔ Lead Categories Seeded successfully!'.green);

    // 3. Seed Lead Statuses
    await LeadStatus.deleteMany();
    const statuses = [
      { name: 'New', color: '#3B82F6', status: true },           // Blue
      { name: 'Contacted', color: '#6366F1', status: true },     // Indigo
      { name: 'Interested', color: '#8B5CF6', status: true },    // Purple
      { name: 'Follow Up', color: '#F59E0B', status: true },     // Orange
      { name: 'Qualified', color: '#06B6D4', status: true },     // Cyan
      { name: 'Converted', color: '#10B981', status: true },     // Green
      { name: 'Lost', color: '#EF4444', status: true },          // Red
      { name: 'Rejected', color: '#6B7280', status: true }       // Gray
    ];
    await LeadStatus.insertMany(statuses);
    console.log('✔ Lead Statuses Seeded successfully!'.green);

    console.log('All Lead Masters Seeded Successfully! 🚀'.green.bold.inverse);
    process.exit(0);
  } catch (err) {
    console.error(`Error seeding lead masters: ${err.message}`.red);
    process.exit(1);
  }
};

seedData();
