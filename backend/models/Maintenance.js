const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
  deviceName: { 
    type: String, 
    required: true,
    trim: true 
  },
  taskDescription: {
    type: String,
    trim: true
  },
  dueDate: { 
    type: Date, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending' 
  },
  cost: {
    type: Number,
    default: 0
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true 
  },
  householdId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Household',
    required: true,
    index: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Maintenance', maintenanceSchema);