const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const User = require('./models/User');
const Role = require('./models/Role');
const Permission = require('./models/Permission');

// Load env vars
dotenv.config();

// Connect to DB
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
// await mongoose.connect(process.env.MONGO_URI);

// console.log("MongoDB Connected");
const runSeeder = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");

    if (process.argv[2] === '-d') {
      await deleteData();
    } else {
      await importData();
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

runSeeder();

const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Role.deleteMany();
    await Permission.deleteMany();

    console.log('Data Destroyed...'.red.inverse);

    // 1. Create Initial Permissions
    const permissions = await Permission.insertMany([
      { name: 'All Access', slug: 'all_access', description: 'Can perform any action' },
      { name: 'Manage Users', slug: 'manage_users', description: 'Can create/edit/delete users' },
      { name: 'Manage Roles', slug: 'manage_roles', description: 'Can create/edit roles' }
    ]);

    // 2. Create Super Admin Role
    const superAdminRole = await Role.create({
      name: 'Super Admin',
      slug: 'super_admin',
      permissions: permissions.map(p => p._id) // Give all permissions
    });

    // 3. Create Admin User
    await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      phone: 9752008360,
      password: '11111111',
      role: superAdminRole._id
    });

    console.log('Data Imported Successfully!'.green.inverse);
    process.exit();
  } catch (err) {
    console.error(`${err}`.red);
    process.exit(1);
  }
};

const deleteData = async () => {
  try {
    await User.deleteMany();
    await Role.deleteMany();
    await Permission.deleteMany();

    console.log('Data Destroyed...'.red.inverse);
    process.exit();
  } catch (err) {
    console.error(`${err}`.red);
    process.exit(1);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
