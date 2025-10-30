module.exports = {
  config: {
    name: "messageTracker",
    author: "ST",
    version: "1.0",
    description: "Track user and thread data",
    eventType: "message"
  },

  ST: async function ({ event, api, message, ctx }) {
    try {
      const msg = event;
      const userId = String(msg.from.id);
      const chatId = String(msg.chat.id);
      const chatType = msg.chat.type;

      // Skip bot messages
      if (msg.from.is_bot || !global.db) {
        return;
      }

      // CRITICAL: Increment message count for EVERY message (commands, chat, everything)
      try {
        const userName = msg.from.first_name + (msg.from.last_name ? ' ' + msg.from.last_name : '');
        
        const result = await global.db.incrementMessageCount(userId, chatId);

        
        // Verify the count was actually saved
        const verifyUser = await global.db.getUser(userId);
        const verifyThread = await global.db.getThread(chatId);
        
        // Increment user exp if level system is enabled
        if (global.config.levelSystem?.enabled) {
          await global.db.incrementUserExp(userId, global.config.levelSystem.expPerMessage || 5);
        }
      } catch (countError) {
        console.error('❌ ERROR incrementing message count:', countError.message);
        console.error('Stack:', countError.stack);
        global.log.error('Error incrementing message count:', countError.message);
      }

      // Update user profile data
      try {
        const user = await global.db.getUser(userId);
        let updateData = {
          firstName: msg.from.first_name || '',
          lastName: msg.from.last_name || '',
          username: msg.from.username || ''
        };

        // Fetch profile photo if not exists
        if (!user.pfpUrl) {
          try {
            const photos = await api.getUserProfilePhotos(userId, { limit: 1 });
            if (photos.photos && photos.photos.length > 0) {
              const photo = photos.photos[0][photos.photos[0].length - 1];
              const file = await api.getFile(photo.file_id);
              updateData.pfpUrl = `https://api.telegram.org/file/bot${global.config.token}/${file.file_path}`;
            }
          } catch (pfpError) {
            // Continue without profile photo
          }
        }

        await global.db.updateUser(userId, updateData);
      } catch (userError) {
        global.log.error('Error updating user data:', userError);
      }

      // Update thread info for groups
      if (chatType === 'group' || chatType === 'supergroup' || chatType === 'channel') {
        try {
          let totalUsers = 0;
          try {
            totalUsers = await api.getChatMemberCount(chatId);
          } catch (countError) {
            // Skip if can't get count
          }

          // Update thread basic info
          await global.db.updateThread(chatId, {
            name: msg.chat.title || '',
            type: chatType,
            totalUsers: totalUsers
          });
        } catch (updateError) {
          global.log.error('Error updating thread data:', updateError);
        }
      }
    } catch (error) {
      global.log.error('Error in messageTracker event:', error);
    }
  }
};
