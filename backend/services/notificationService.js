const { Expo } = require('expo-server-sdk');

let expo = new Expo();

const sendNotificationToUser = async (user, title, body, data = {}) => {
  if (!user.expoPushToken || !Expo.isExpoPushToken(user.expoPushToken)) {
      console.error(`User ${user.email} has no valid push token`);
      return;
  }

  let messages = [];
  messages.push({
    to: user.expoPushToken,
    sound: 'default',
    title,
    body,
    data,
  });

  let chunks = expo.chunkPushNotifications(messages);
  let tickets = [];
  
  for (let chunk of chunks) {
    try {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    } catch (error) {
      console.error('Error sending push chunk:', error);
    }
  }
  return tickets;
};

module.exports = { sendNotificationToUser };
