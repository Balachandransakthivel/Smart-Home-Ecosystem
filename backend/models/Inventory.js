const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  itemName: { 
    type: String, 
    required: true,
    trim: true 
  },
  quantity: { 
    type: Number, 
    required: true, 
    default: 0 
  },
  threshold: { 
    type: Number, 
    required: true, 
    default: 1 
  },
  category: { 
    type: String, 
    default: 'general' 
  },
  unitCost: { 
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

inventorySchema.methods.isLowStock = function() {
  return this.quantity <= this.threshold;
};

module.exports = mongoose.model('Inventory', inventorySchema);