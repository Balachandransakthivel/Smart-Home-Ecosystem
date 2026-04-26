const mongoose = require('mongoose');
const User = require('../models/User');
const Household = require('../models/Household');
const SmartDevice = require('../models/SmartDevice');
const authService = require('../services/authService');
const config = require('../config/config');

const seedData = async () => {
  try {
    await mongoose.connect(config.mongodb.uri);
    console.log('Connected to MongoDB for seeding...');

    // Clean up
    await User.deleteMany({ email: 'test@example.com' });
    await Household.deleteMany({ name: 'Test Home' });
    await SmartDevice.deleteMany({});

    const hashedPassword = await authService.hashPassword('TestPassword123!');
    
    // Create Admin User
    const user = await User.create({
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Test Administrator',
      username: 'testadmin',
      role: 'admin',
      isVerified: true
    });

    // Create Household
    const household = await Household.create({
      name: 'Test Home',
      adminId: user._id,
      memberIds: [user._id],
      inviteCode: 'TEST12'
    });

    // Update User with householdId
    user.householdId = household._id;
    await user.save();

    // Create Smart Devices
    await SmartDevice.create([
      { name: 'Living Room Light', type: 'light', status: 'on', value: 80, householdId: household._id, room: 'Living Room', icon: 'lightbulb' },
      { name: 'Front Door Lock', type: 'lock', status: 'locked', householdId: household._id, room: 'Entryway', icon: 'lock' },
      { name: 'Smart Thermostat', type: 'termostat', status: 'online', value: 22, householdId: household._id, room: 'Hallway', icon: 'thermometer' },
      { name: 'Kitchen Camera', type: 'camera', status: 'online', householdId: household._id, room: 'Kitchen', icon: 'video' }
    ]);

    console.log('Seed data created: test@example.com / TestPassword123!');

    // Create API Key for AI Service
    const ApiKey = require('../models/ApiKey');
    const crypto = require('crypto');
    const aiKey = config.aiService.apiKey;
    const hashedAiKey = crypto.createHash('sha256').update(aiKey).digest('hex');

    await ApiKey.deleteMany({ keyPrefix: 'sk-dev' });
    await ApiKey.create({
      name: 'AI Service Key',
      key: hashedAiKey,
      keyPrefix: 'sk-dev',
      userId: user._id,
      permissions: ['read', 'ai_access']
    });

    console.log('AI Service API Key seeded');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seedData();
