const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');
const connectDB = require('./config/db');
const config = require('./config/config');
const rateLimit = require('express-rate-limit');
const initSocket = require('./realtime/socketHandler');
require('./jobs/reminderJob'); // Start cron jobs

// Connect to Database
connectDB();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = initSocket(server);
app.set('io', io); // Make io accessible in routes if needed



// Security Headers
app.use(helmet());

// Set up rate limiting
const limiter = rateLimit({ 
  windowMs: 15 * 60 * 1000, 
  max: 1000, // Increased for dev/socket heartbeats
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use(limiter);

// Allow CORS for mobile app development
app.use(cors());
app.use(express.json());

// Global handler for JSON parsing errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ message: 'Invalid JSON payload. Please check your syntax.' });
  }
  next();
});


// Auth limiter for sensitive routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Too many login/registration attempts, please try again after 15 minutes'
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/cleaning', require('./routes/cleaningRoutes'));
app.use('/api/inventory', require('./routes/inventoryRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));
app.use('/api/maintenance', require('./routes/maintenanceRoutes'));
app.use('/api/alerts', require('./routes/alertRoutes'));
app.use('/api/household', require('./routes/householdRoutes'));
app.use('/api/devices', require('./routes/deviceRoutes'));

app.use('/api/ai', require('./routes/aiRoutes'));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: config.env === 'production' ? 'Internal server error' : err.message 
  });
});

const PORT = config.port;
server.listen(PORT, () => console.log(`Server running in ${config.env} mode on port ${PORT}`));