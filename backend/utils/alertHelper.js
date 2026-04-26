const Alert = require('../models/Alert');
const User = require('../models/User');
const { sendNotificationToUser } = require('../services/notificationService');

const createAlert = async (userId, type, message, data = {}) => {
  try {
    const alert = await Alert.create({ userId, type, message });
    
    // Attempt to send push notification
    const user = await User.findById(userId);
    if (user && user.expoPushToken) {
        await sendNotificationToUser(user, 'Smart Home Alert', message, data);
    }
    
    return alert;
  } catch (err) {
    console.error('Failed to create alert/send notification:', err);
  }
};

module.exports = { createAlert };
