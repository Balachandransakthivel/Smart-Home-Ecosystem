const cron = require('node-cron');
const Task = require('../models/Task');
const Maintenance = require('../models/Maintenance');
const Cleaning = require('../models/Cleaning');
const Alert = require('../models/Alert');

cron.schedule('0 * * * *', async () => {
  console.log('Running reminder cron job...');
  try {
    const now = new Date();
    const next24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const next7d = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const tasks = await Task.find({ deadline: { $lte: next24h, $gte: now }, status: { $ne: 'completed' } });
    for (let t of tasks) await Alert.create({ type: 'task_due', message: `Task "${t.title}" is due soon`, userId: t.userId });

    const maint = await Maintenance.find({ dueDate: { $lte: next7d, $gte: now }, status: { $ne: 'completed' } });
    for (let m of maint) await Alert.create({ type: 'maintenance_due', message: `Maintenance for ${m.deviceName} is due soon`, userId: m.userId });

    const clean = await Cleaning.find({ scheduledDate: { $lte: next24h, $gte: now }, status: { $ne: 'completed' } });
    for (let c of clean) await Alert.create({ type: 'cleaning_due', message: `Cleaning scheduled: ${c.type}`, userId: c.userId });
    
  } catch (err) { console.error('Cron job error:', err); }
});