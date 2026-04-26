const Maintenance = require('../models/Maintenance');
const Expense = require('../models/Expense');

const getMaintenanceTasks = async (req, res) => {
  try {
    const tasks = await Maintenance.find({ householdId: req.user.householdId }).sort({ dueDate: 1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createMaintenanceTask = async (req, res) => {
  try {
    const task = await Maintenance.create({ 
      ...req.body, 
      userId: req.user._id,
      householdId: req.user.householdId
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateMaintenanceTask = async (req, res) => {
  try {
    const oldTask = await Maintenance.findOne({ _id: req.params.id, householdId: req.user.householdId });
    if (!oldTask) return res.status(404).json({ message: 'Maintenance record not found' });

    const task = await Maintenance.findOneAndUpdate(
      { _id: req.params.id, householdId: req.user.householdId },
      req.body,
      { new: true }
    );
    
    // Auto-sync with Spending Page when transition to 'completed' happens
    if (req.body.status === 'completed' && oldTask.status !== 'completed') {
      const expenseCost = req.body.cost || task.cost;
      if (expenseCost > 0) {
        await Expense.create({
          title: `Maintenance: ${task.deviceName}`,
          amount: expenseCost,
          category: 'Maintenance',
          userId: req.user._id,
          householdId: req.user.householdId,
          metadata: { maintenanceTaskId: task._id }
        });
      }
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteMaintenanceTask = async (req, res) => {
  try {
    const result = await Maintenance.findOneAndDelete({ _id: req.params.id, householdId: req.user.householdId });
    if (!result) return res.status(404).json({ message: 'Maintenance record not found' });
    res.json({ message: 'Maintenance record deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getMaintenanceTasks, createMaintenanceTask, updateMaintenanceTask, deleteMaintenanceTask };