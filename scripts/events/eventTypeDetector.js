
module.exports = {
  config: {
    name: "eventTypeDetector",
    author: "ST",
    version: "1.0",
    description: "Detect and log all event types in real-time",
    eventType: "all" // Listen to ALL event types
  },

  ST: async function ({ event, api, message, ctx, eventType }) {
    try {
      // Skip bot messages
      if (event.from?.is_bot) return;

      const chatId = String(ctx.chat?.id);
      const userId = String(event.from?.id);

      // Update thread with type detection
      if (chatId && ctx.chat) {
        const updateData = {
          type: ctx.chat.type,
          isPrivate: ctx.chat.type === 'private',
          isGroup: ctx.chat.type === 'group',
          isSupergroup: ctx.chat.type === 'supergroup',
          isChannel: ctx.chat.type === 'channel',
          lastActivity: Date.now()
        };

        if (ctx.chat.title) {
          updateData.name = ctx.chat.title;
        }

        if (ctx.chat.description) {
          updateData.description = ctx.chat.description;
        }

        if (ctx.chat.username) {
          updateData.username = ctx.chat.username;
        }

        await global.db.updateThread(chatId, updateData);
      }

      // Log detected event type
      if (eventType && eventType !== 'message') {
        global.log.info(`Event detected: ${eventType} in ${ctx.chat.type}`);
      }

    } catch (error) {
      global.log.error('Error in eventTypeDetector:', error.message);
    }
  }
};
