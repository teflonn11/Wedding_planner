const logger = require('../utils/logger');

module.exports = (socket) => {
  logger.info('New socket connection:', socket.id);
  
  // Real-time messaging
  socket.on('join_conversation', (conversationId) => {
    socket.join(conversationId);
    logger.info(`User joined conversation ${conversationId}`);
  });
  
  socket.on('send_message', async (data) => {
    try {
      // Save message to database
      const result = await db.query(
        'INSERT INTO messages (conversation_id, sender_id, message_text) VALUES (?, ?, ?)',
        [data.conversationId, data.senderId, data.message]
      );
      
      // Broadcast message to other participants
      socket.to(data.conversationId).emit('receive_message', {
        messageId: result.insertId,
        senderId: data.senderId,
        message: data.message,
        sentAt: new Date()
      });
    } catch (error) {
      logger.error('Socket message error:', error);
    }
  });
  
  // Notification system
  socket.on('subscribe_notifications', (userId) => {
    socket.join(`user_notifications_${userId}`);
  });
  
  socket.on('disconnect', () => {
    logger.info('Socket disconnected:', socket.id);
  });
};