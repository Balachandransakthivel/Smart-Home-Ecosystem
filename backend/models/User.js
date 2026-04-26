const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true,
    index: true 
  },
  username: {
    type: String,
    unique: true,
    sparse: true,
    index: true
  },
  password: { 
    type: String, 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['admin', 'member'], 
    default: 'member' 
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  twoFactorSecret: String,
  isTwoFactorEnabled: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date
  },
  householdId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Household',
    default: null 
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Number
  },
  expoPushToken: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);