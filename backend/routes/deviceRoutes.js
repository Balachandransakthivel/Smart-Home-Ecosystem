const express = require('express');
const router = express.Router();
const Device = require('../models/Device');
const { protect } = require('../middleware/authMiddleware');

// Get all devices
router.get('/', protect, async (req, res) => {
  try {
    const devices = await Device.find(); // Ideally filtered by req.user.householdId
    res.json(devices);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Toggle basic device status
router.put('/:id/toggle', protect, async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);
    if (!device) return res.status(404).json({ message: 'Device not found' });
    
    // Simple toggle logic for demo
    if (device.type === 'lock') {
      device.status = device.status === 'locked' ? 'unlocked' : 'locked';
    } else {
      device.status = device.status === 'on' ? 'off' : 'on';
    }
    
    await device.save();
    res.json(device);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Mock seeding route for trial
router.post('/seed', protect, async (req, res) => {
  try {
    const defaultDevices = [
      { name: 'Living Room Light', type: 'light', room: 'Living Room', status: 'off', householdId: req.user.id },
      { name: 'Front Door Lock', type: 'lock', room: 'Entrance', status: 'locked', householdId: req.user.id },
      { name: 'Main AC', type: 'thermostat', room: 'Living Room', status: 'off', temperature: 24, householdId: req.user.id }
    ];
    await Device.insertMany(defaultDevices);
    res.json({ message: 'Devices seeded' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
