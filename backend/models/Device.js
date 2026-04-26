const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['light', 'thermostat', 'lock', 'fan', 'camera'], required: true },
  room: { type: String, required: true },
  status: { type: String, enum: ['on', 'off', 'locked', 'unlocked', 'recording'], default: 'off' },
  powerUsage: { type: Number, default: 0 }, // in watts
  temperature: { type: Number }, // for thermostats
  householdId: { type: mongoose.Schema.Types.ObjectId, ref: 'Household', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Device', deviceSchema);
