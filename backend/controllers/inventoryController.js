const Inventory = require('../models/Inventory');
const Expense = require('../models/Expense');
const Alert = require('../models/Alert');

const getInventory = async (req, res) => {
  try {
    const inv = await Inventory.find({ householdId: req.user.householdId });
    res.json(inv);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createInventoryItem = async (req, res) => {
  try {
    const { itemName, quantity, threshold, category, cost } = req.body;
    
    const item = await Inventory.create({ 
      itemName, 
      quantity, 
      threshold, 
      category,
      unitCost: cost ? (cost / quantity) : 0,
      userId: req.user._id,
      householdId: req.user.householdId
    });

    // Auto-sync with Spending Page
    if (cost && cost > 0) {
      await Expense.create({
        title: `Restock: ${itemName}`,
        amount: cost,
        category: 'Inventory',
        userId: req.user._id,
        householdId: req.user.householdId,
        metadata: { inventoryItemId: item._id }
      });
    }

    res.status(201).json(item);
  } catch (error) {
    console.error('createInventoryItem Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateInventoryItem = async (req, res) => {
  try {
    const { quantity, cost } = req.body;
    const oldItem = await Inventory.findOne({ _id: req.params.id, householdId: req.user.householdId });
    
    if (!oldItem) return res.status(404).json({ message: 'Inventory item not found' });
    
    const qtyDiff = (quantity || oldItem.quantity) - oldItem.quantity;
    
    const item = await Inventory.findOneAndUpdate(
      { _id: req.params.id, householdId: req.user.householdId },
      req.body,
      { new: true }
    );
    
    // Auto-sync with Spending Page if quantity increased and cost provided
    if (qtyDiff > 0 && cost && cost > 0) {
      await Expense.create({
        title: `Restock: ${item.itemName}`,
        amount: cost,
        category: 'Inventory',
        userId: req.user._id,
        householdId: req.user.householdId,
        metadata: { inventoryItemId: item._id }
      });
    }
    
    if (item.isLowStock()) {
      await Alert.create({
        type: 'low_stock',
        message: `${item.itemName} is reaching low stock (Current: ${item.quantity})`,
        userId: req.user._id,
        householdId: req.user.householdId
      });
    }
    res.json(item);
  } catch (error) {
    console.error('updateInventoryItem Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteInventoryItem = async (req, res) => {
  try {
    const result = await Inventory.findOneAndDelete({ _id: req.params.id, householdId: req.user.householdId });
    if (!result) return res.status(404).json({ message: 'Inventory item not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getInventory, createInventoryItem, updateInventoryItem, deleteInventoryItem };