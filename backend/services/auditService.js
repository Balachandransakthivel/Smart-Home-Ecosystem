const AuditLog = require('../models/AuditLog');

const logAuthEvent = async (eventType, { userId, email, ipAddress, userAgent, status, message, metadata }) => {
  try {
    await AuditLog.create({
      eventType,
      userId,
      email,
      ipAddress,
      userAgent,
      status,
      message,
      metadata
    });
  } catch (err) {
    console.error('Failed to log audit event:', err);
  }
};

module.exports = { logAuthEvent };
