const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiKey = require('../models/ApiKey');
const crypto = require('crypto');

const protect = async (req, res, next) => {
  let token;

  // 1. Check for Bearer Token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }
      return next();
    } catch (error) {
      console.error('JWT Auth error:', error.message);
      return res.status(401).json({ message: 'Not authorized, invalid token' });
    }
  }

  // 2. Check for API Key
  const apiKey = req.headers['x-api-key'];
  if (apiKey) {
    try {
      const hashedKey = crypto.createHash('sha256').update(apiKey).digest('hex');
      const keyRecord = await ApiKey.findOne({ key: hashedKey, isActive: true }).populate('userId');
      
      if (!keyRecord) {
        return res.status(401).json({ message: 'Not authorized, invalid API key' });
      }

      if (keyRecord.expiresAt && keyRecord.expiresAt < Date.now()) {
        return res.status(401).json({ message: 'Not authorized, API key expired' });
      }

      keyRecord.lastUsed = Date.now();
      await keyRecord.save();

      req.user = keyRecord.userId;
      req.apiKey = keyRecord;
      return next();
    } catch (error) {
      console.error('API Key Auth error:', error.message);
      return res.status(401).json({ message: 'Not authorized, API key error' });
    }
  }

  return res.status(401).json({ message: 'Not authorized, no token or API key provided' });
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient privileges' });
    }
    next();
  };
};

const isAdmin = authorize('admin');

const hasHousehold = (req, res, next) => {
  if (!req.user || !req.user.householdId) {
    return res.status(403).json({ message: 'Forbidden: You must belong to a household to access this resource' });
  }
  next();
};

module.exports = { protect, authorize, isAdmin, hasHousehold };