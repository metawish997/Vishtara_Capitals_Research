const mongoose = require('mongoose');
const dotenv = require('dotenv');
const express = require('express');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const Permission = require('../models/Permission');
const generatePermissions = require('../utils/permissionGenerator');

// We need to simulate the app with routes to test the generator
const app = express();
const routes = require('../routes/index');
const angelRoutes = require('../routes/angelRoutes');

app.use('/api/v1', routes);
app.use('/api/angel', angelRoutes);

const run = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected.');

    console.log('Generating permissions...');
    await generatePermissions(app);

    console.log('Done.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
