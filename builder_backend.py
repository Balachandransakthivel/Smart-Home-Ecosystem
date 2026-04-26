import os

base_dir = r"d:\projects\Mini Project\Smart_home"

files = {
    "backend/package.json": """{
  "name": "smart-home-backend",
  "version": "1.0.0",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.0.0",
    "express": "^4.18.0",
    "express-rate-limit": "^7.0.0",
    "express-validator": "^7.0.0",
    "firebase-admin": "^12.0.0",
    "mongoose": "^8.0.0",
    "node-cron": "^3.0.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.0"
  }
}""",

    "backend/.env.example": """PORT=5000
MONGO_URI=mongodb://localhost:27017/smarthome
FIREBASE_SERVICE_ACCOUNT_PATH=./config/serviceAccountKey.json
FRONTEND_URL=http://localhost:8081
AI_SERVICE_URL=http://localhost:8000""",

    "backend/server.js": """const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const rateLimit = require('express-rate-limit');
require('./jobs/reminderJob'); // Start cron jobs

dotenv.config();
connectDB();

const app = express();

// Set up rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

// Restrict CORS
app.use(cors({ origin: [process.env.FRONTEND_URL || 'http://localhost:8081'] }));
app.use(express.json());

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/cleaning', require('./routes/cleaningRoutes'));
app.use('/api/inventory', require('./routes/inventoryRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));
app.use('/api/maintenance', require('./routes/maintenanceRoutes'));
app.use('/api/alerts', require('./routes/alertRoutes'));
app.use('/api/household', require('./routes/householdRoutes'));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));""",

    "backend/config/db.js": """const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
  }
};

module.exports = connectDB;""",

    "backend/config/firebase.js": """const admin = require('firebase-admin');
const fs = require('fs');

if (fs.existsSync(process.env.FIREBASE_SERVICE_ACCOUNT_PATH)) {
  const serviceAccount = require('.' + process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
} else {
  console.warn("Firebase service account file not found. Auth will fail.");
  admin.initializeApp();
}

module.exports = admin;""",

    "backend/middleware/authMiddleware.js": """const admin = require('../config/firebase');

const protect = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
    const token = header.split(' ')[1];
    req.user = await admin.auth().verifyIdToken(token);
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = { protect };""",

    "backend/models/User.js": """const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['admin', 'member'], default: 'member' },
  householdId: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);""",

    "backend/models/Task.js": """const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, default: 'pending' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  deadline: { type: Date },
  assignedTo: { type: String },
  userId: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);""",

    "backend/models/Cleaning.js": """const mongoose = require('mongoose');

const cleaningSchema = new mongoose.Schema({
  type: { type: String, required: true },
  scheduledDate: { type: Date, required: true },
  assignedUser: { type: String },
  status: { type: String, default: 'pending' },
  recurring: { type: String, enum: ['none', 'daily', 'weekly', 'monthly'], default: 'none' },
  userId: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Cleaning', cleaningSchema);""",

    "backend/models/Inventory.js": """const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true, default: 0 },
  threshold: { type: Number, required: true, default: 1 },
  category: { type: String, default: 'general' },
  unitCost: { type: Number, default: 0 },
  userId: { type: String, required: true }
}, { timestamps: true });

inventorySchema.methods.isLowStock = function() {
  return this.quantity <= this.threshold;
};

module.exports = mongoose.model('Inventory', inventorySchema);""",

    "backend/models/Expense.js": """const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  linkedInventoryItem: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory' },
  date: { type: Date, default: Date.now },
  userId: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);""",

    "backend/models/Maintenance.js": """const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
  deviceName: { type: String, required: true },
  dueDate: { type: Date, required: true },
  status: { type: String, default: 'pending' },
  userId: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Maintenance', maintenanceSchema);""",

    "backend/models/Alert.js": """const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  type: { type: String, enum: ['low_stock', 'task_due', 'maintenance_due', 'cleaning_due'] },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  userId: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Alert', alertSchema);""",

    "backend/models/Household.js": """const mongoose = require('mongoose');

const householdSchema = new mongoose.Schema({
  name: { type: String, required: true },
  adminUid: { type: String, required: true },
  memberUids: [{ type: String }],
  inviteCode: { type: String, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('Household', householdSchema);""",

    "backend/controllers/authController.js": """const User = require('../models/User');

const registerUser = async (req, res) => {
  try {
    const { uid, email, name } = req.body;
    const existing = await User.findOne({ $or: [{ uid }, { email }] });
    if (existing) return res.status(409).json({ message: 'User already exists' });

    const user = await User.create({ uid, email, name });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerUser };""",

    "backend/controllers/taskController.js": """const Task = require('../models/Task');
const { validationResult } = require('express-validator');

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.uid });
    res.json(tasks);
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
};

const createTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const task = await Task.create({ ...req.body, userId: req.user.uid });
    res.status(201).json(task);
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate({ _id: req.params.id, userId: req.user.uid }, req.body, { new: true });
    if (!task) return res.status(404).json({ message: 'Not found' });
    res.json(task);
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
};

const deleteTask = async (req, res) => {
  try {
    const result = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.uid });
    if (!result) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Task deleted' });
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };""",

    "backend/controllers/cleaningController.js": """const Cleaning = require('../models/Cleaning');

const getCleaningTasks = async (req, res) => {
  try {
    const cleanings = await Cleaning.find({ userId: req.user.uid });
    res.json(cleanings);
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
};

const createCleaningTask = async (req, res) => {
  try {
    const cleaning = await Cleaning.create({ ...req.body, userId: req.user.uid });
    res.status(201).json(cleaning);
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
};

const updateCleaningTask = async (req, res) => {
  try {
    const cleaning = await Cleaning.findOneAndUpdate({ _id: req.params.id, userId: req.user.uid }, req.body, { new: true });
    if (!cleaning) return res.status(404).json({ message: 'Not found' });
    res.json(cleaning);
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
};

const deleteCleaningTask = async (req, res) => {
  try {
    const result = await Cleaning.findOneAndDelete({ _id: req.params.id, userId: req.user.uid });
    if (!result) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Cleaning deleted' });
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
};

module.exports = { getCleaningTasks, createCleaningTask, updateCleaningTask, deleteCleaningTask };""",

    "backend/controllers/inventoryController.js": """const Inventory = require('../models/Inventory');
const Expense = require('../models/Expense');
const Alert = require('../models/Alert');

const getInventory = async (req, res) => {
  try {
    const inv = await Inventory.find({ userId: req.user.uid });
    res.json(inv);
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
};

const createInventoryItem = async (req, res) => {
  try {
    const item = await Inventory.create({ ...req.body, userId: req.user.uid });
    res.status(201).json(item);
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
};

const updateInventoryItem = async (req, res) => {
  try {
    const oldItem = await Inventory.findOne({ _id: req.params.id, userId: req.user.uid });
    if (!oldItem) return res.status(404).json({ message: 'Not found' });
    
    const usedAmount = oldItem.quantity - (req.body.quantity || oldItem.quantity);
    const item = await Inventory.findOneAndUpdate({ _id: req.params.id, userId: req.user.uid }, req.body, { new: true });
    
    if (usedAmount > 0) {
      const cost = usedAmount * (oldItem.unitCost || 0);
      if (cost > 0) {
        await Expense.create({
          amount: cost,
          category: 'Supplies',
          linkedInventoryItem: item._id,
          userId: req.user.uid
        });
      }
    }
    
    if (item.isLowStock()) {
      await Alert.create({
        type: 'low_stock',
        message: `${item.itemName} is low (qty: ${item.quantity})`,
        userId: req.user.uid
      });
    }
    res.json(item);
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
};

const deleteInventoryItem = async (req, res) => {
  try {
    const result = await Inventory.findOneAndDelete({ _id: req.params.id, userId: req.user.uid });
    if (!result) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
};

module.exports = { getInventory, createInventoryItem, updateInventoryItem, deleteInventoryItem };""",

    "backend/controllers/expenseController.js": """const Expense = require('../models/Expense');

const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.uid });
    res.json(expenses);
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
};

const createExpense = async (req, res) => {
  try {
    const expense = await Expense.create({ ...req.body, userId: req.user.uid });
    res.status(201).json(expense);
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
};

const deleteExpense = async (req, res) => {
  try {
    const result = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.user.uid });
    if (!result) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
};

module.exports = { getExpenses, createExpense, deleteExpense };""",

    "backend/controllers/maintenanceController.js": """const Maintenance = require('../models/Maintenance');

const getMaintenanceTasks = async (req, res) => {
  try {
    const tasks = await Maintenance.find({ userId: req.user.uid });
    res.json(tasks);
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
};

const createMaintenanceTask = async (req, res) => {
  try {
    const task = await Maintenance.create({ ...req.body, userId: req.user.uid });
    res.status(201).json(task);
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
};

const updateMaintenanceTask = async (req, res) => {
  try {
    const task = await Maintenance.findOneAndUpdate({ _id: req.params.id, userId: req.user.uid }, req.body, { new: true });
    if (!task) return res.status(404).json({ message: 'Not found' });
    res.json(task);
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
};

const deleteMaintenanceTask = async (req, res) => {
  try {
    const result = await Maintenance.findOneAndDelete({ _id: req.params.id, userId: req.user.uid });
    if (!result) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
};

module.exports = { getMaintenanceTasks, createMaintenanceTask, updateMaintenanceTask, deleteMaintenanceTask };""",

    "backend/controllers/alertController.js": """const Alert = require('../models/Alert');

const getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ userId: req.user.uid, read: false }).sort({ createdAt: -1 });
    res.json(alerts);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

const markRead = async (req, res) => {
  try {
    const alert = await Alert.findOneAndUpdate({ _id: req.params.id, userId: req.user.uid }, { read: true }, { new: true });
    res.json(alert);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

const markAllRead = async (req, res) => {
  try {
    await Alert.updateMany({ userId: req.user.uid, read: false }, { read: true });
    res.json({ message: 'All read' });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

module.exports = { getAlerts, markRead, markAllRead };""",

    "backend/controllers/householdController.js": """const Household = require('../models/Household');
const User = require('../models/User');

const createHousehold = async (req, res) => {
  try {
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const household = await Household.create({
      name: req.body.name,
      adminUid: req.user.uid,
      memberUids: [req.user.uid],
      inviteCode
    });
    await User.findOneAndUpdate({ uid: req.user.uid }, { householdId: household._id });
    res.status(201).json(household);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

const joinHousehold = async (req, res) => {
  try {
    const household = await Household.findOne({ inviteCode: req.body.inviteCode });
    if (!household) return res.status(404).json({ message: 'Invalid code' });
    
    if (!household.memberUids.includes(req.user.uid)) {
      household.memberUids.push(req.user.uid);
      await household.save();
    }
    await User.findOneAndUpdate({ uid: req.user.uid }, { householdId: household._id });
    res.json(household);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

const getMembers = async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid });
    if (!user || !user.householdId) return res.json([]);
    const members = await User.find({ householdId: user.householdId });
    res.json(members);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

module.exports = { createHousehold, joinHousehold, getMembers };""",

    "backend/routes/authRoutes.js": """const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/authController');

router.post('/register', registerUser);

module.exports = router;""",

    "backend/routes/taskRoutes.js": """const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getTasks)
  .post(protect, [check('title').notEmpty()], createTask);

router.route('/:id')
  .put(protect, updateTask)
  .delete(protect, deleteTask);

module.exports = router;""",

    "backend/routes/cleaningRoutes.js": """const express = require('express');
const router = express.Router();
const { getCleaningTasks, createCleaningTask, updateCleaningTask, deleteCleaningTask } = require('../controllers/cleaningController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getCleaningTasks).post(protect, createCleaningTask);
router.route('/:id').put(protect, updateCleaningTask).delete(protect, deleteCleaningTask);

module.exports = router;""",

    "backend/routes/inventoryRoutes.js": """const express = require('express');
const router = express.Router();
const { getInventory, createInventoryItem, updateInventoryItem, deleteInventoryItem } = require('../controllers/inventoryController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getInventory).post(protect, createInventoryItem);
router.route('/:id').put(protect, updateInventoryItem).delete(protect, deleteInventoryItem);

module.exports = router;""",

    "backend/routes/expenseRoutes.js": """const express = require('express');
const router = express.Router();
const { getExpenses, createExpense, deleteExpense } = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getExpenses).post(protect, createExpense);
router.route('/:id').delete(protect, deleteExpense);

module.exports = router;""",

    "backend/routes/maintenanceRoutes.js": """const express = require('express');
const router = express.Router();
const { getMaintenanceTasks, createMaintenanceTask, updateMaintenanceTask, deleteMaintenanceTask } = require('../controllers/maintenanceController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getMaintenanceTasks).post(protect, createMaintenanceTask);
router.route('/:id').put(protect, updateMaintenanceTask).delete(protect, deleteMaintenanceTask);

module.exports = router;""",

    "backend/routes/alertRoutes.js": """const express = require('express');
const router = express.Router();
const { getAlerts, markRead, markAllRead } = require('../controllers/alertController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getAlerts);
router.put('/read-all', protect, markAllRead);
router.put('/:id/read', protect, markRead);

module.exports = router;""",

    "backend/routes/householdRoutes.js": """const express = require('express');
const router = express.Router();
const { createHousehold, joinHousehold, getMembers } = require('../controllers/householdController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create', protect, createHousehold);
router.post('/join', protect, joinHousehold);
router.get('/members', protect, getMembers);

module.exports = router;""",

    "backend/jobs/reminderJob.js": """const cron = require('node-cron');
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
});"""
}

# Update .gitignore and remove old files that user wants deleted
gitignore_path = os.path.join(base_dir, ".gitignore")
with open(gitignore_path, "a") as f:
    f.write("\nbackend/.env\nbackend/config/serviceAccountKey.json\n**/__pycache__/\n*.pyc\n*.h5\n.venv/\n")

# Write out all files
for p, content in files.items():
    full_path = os.path.join(base_dir, p)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding='utf-8') as f:
        f.write(content)

print(f"Successfully generated {len(files)} backend files!")
