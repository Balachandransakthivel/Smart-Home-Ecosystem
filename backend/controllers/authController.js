const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const authService = require('../services/authService');
const auditService = require('../services/auditService');

const register = async (req, res) => {
  try {
    const { email, password, name, username, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await authService.hashPassword(password);
    
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      username,
      role: role || 'member'
    });

    await auditService.logAuthEvent('register', {
      userId: user._id,
      email: user.email,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      status: 'success'
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const ipAddress = req.ip;
    const userAgent = req.get('user-agent');

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      await auditService.logAuthEvent('login_failure', {
        email,
        ipAddress,
        userAgent,
        status: 'failure',
        message: 'Invalid credentials'
      });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if account is locked
    if (user.isLocked) {
      await auditService.logAuthEvent('login_failure', {
        userId: user._id,
        email: user.email,
        ipAddress,
        userAgent,
        status: 'failure',
        message: 'Account locked'
      });
      return res.status(403).json({ message: 'Account is temporarily locked due to many failed attempts' });
    }

    const isMatch = await authService.comparePassword(password, user.password);

    if (!isMatch) {
      // Increment login attempts
      user.loginAttempts += 1;
      if (user.loginAttempts >= 5) {
        user.lockUntil = Date.now() + 15 * 60 * 1000; // 15 mins
        await auditService.logAuthEvent('account_lockout', {
          userId: user._id,
          email: user.email,
          ipAddress,
          userAgent,
          status: 'failure'
        });
      }
      await user.save();

      await auditService.logAuthEvent('login_failure', {
        userId: user._id,
        email: user.email,
        ipAddress,
        userAgent,
        status: 'failure',
        message: 'Invalid credentials'
      });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Reset login attempts on success
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    user.lastLogin = Date.now();
    await user.save();

    const accessToken = authService.generateAccessToken(user);
    const refreshToken = await authService.generateRefreshToken(user, ipAddress, userAgent);

    await auditService.logAuthEvent('login_success', {
      userId: user._id,
      email: user.email,
      ipAddress,
      userAgent,
      status: 'success'
    });

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        householdId: user.householdId
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const refresh = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: 'Token is required' });

    const refreshToken = await RefreshToken.findOne({ token }).populate('userId');

    if (!refreshToken || !refreshToken.isActive) {
      return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }

    const user = refreshToken.userId;
    const newAccessToken = authService.generateAccessToken(user);
    
    // Rotate refresh token (optional but recommended in prompt)
    const newRefreshToken = await authService.generateRefreshToken(user, req.ip, req.get('user-agent'));
    
    // Revoke old token
    refreshToken.isRevoked = true;
    refreshToken.replacedByToken = newRefreshToken;
    await refreshToken.save();

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const logout = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: 'Token is required' });

    const refreshToken = await RefreshToken.findOne({ token });
    if (refreshToken) {
      refreshToken.isRevoked = true;
      await refreshToken.save();
      
      await auditService.logAuthEvent('logout', {
        userId: refreshToken.userId,
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
        status: 'success'
      });
    }

    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout
};