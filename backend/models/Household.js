const mongoose = require('mongoose');

const householdSchema = new mongoose.Schema({
  name: { type: String, required: true },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  memberIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  inviteCode: { type: String, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('Household', householdSchema);