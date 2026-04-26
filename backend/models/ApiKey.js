const mongoose = require('mongoose');

const apiKeySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  key: {
    type: String, // Hashed sk- key
    required: true,
    unique: true,
    index: true
  },
  keyPrefix: {
    type: String, // sk-xxxx
    required: true
  },
  permissions: {
    type: [String],
    default: ['read']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  lastUsed: Date,
  expiresAt: Date,
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('ApiKey', apiKeySchema);
