module.exports = {
  config: {
    name: "antiChange",
    author: "Sheikh",
    version: "1.0",
    category: "events",
    description: "Automatically restore locked group settings when changed"
  },

  ST: async function({ api, event, db }) {
    try {
      const chat = event.chat;
      if (!chat || (chat.type !== 'group' && chat.type !== 'supergroup')) {
        return;
      }

      const chatId = chat.id;
      const threadData = await db.getThread(chatId);

      const botMember = await api.getChatMember(chatId, api.botInfo.id);
      if (botMember.status !== 'administrator' && botMember.status !== 'creator') {
        return;
      }

      const hasChangePermission = botMember.can_change_info;
      if (!hasChangePermission) {
        return;
      }

      if (event.new_chat_title) {
        if (threadData.lockedName && threadData.savedName) {
          const newTitle = event.new_chat_title;
          const savedTitle = threadData.savedName;

          if (newTitle !== savedTitle) {
            try {
              await api.setChatTitle(chatId, savedTitle);
              
              const changerName = event.from.first_name || 'Someone';
              const warnMessage = await api.sendMessage(
                chatId,
                `⚠️ **Group Name Protected**\n\n${changerName} tried to change the group name, but it's locked.\n\nRestored to: **${savedTitle}**`
              );

              setTimeout(async () => {
                try {
                  await api.deleteMessage(chatId, warnMessage.message_id);
                } catch (err) {}
              }, 10000);
            } catch (error) {
              console.error('Error restoring group name:', error);
            }
          }
        }
      }

      if (event.new_chat_photo) {
        if (threadData.lockedPhoto && threadData.savedPhoto) {
          try {
            const savedPhoto = threadData.savedPhoto;

            if (savedPhoto === 'NO_PHOTO') {
              await api.deleteChatPhoto(chatId);

              const changerName = event.from.first_name || 'Someone';
              const warnMessage = await api.sendMessage(
                chatId,
                `⚠️ **Group Photo Protected**\n\n${changerName} tried to add a group photo, but it's locked to have no photo.\n\nPhoto has been removed.`
              );

              setTimeout(async () => {
                try {
                  await api.deleteMessage(chatId, warnMessage.message_id);
                } catch (err) {}
              }, 10000);
            } else {
              const file = await api.getFile(savedPhoto);
              const fileUrl = `https://api.telegram.org/file/bot${global.config.token}/${file.file_path}`;
              
              const axios = require('axios');
              const response = await axios.get(fileUrl, { responseType: 'stream' });
              
              await api.setChatPhoto(chatId, { source: response.data });

              const changerName = event.from.first_name || 'Someone';
              const warnMessage = await api.sendMessage(
                chatId,
                `⚠️ **Group Photo Protected**\n\n${changerName} tried to change the group photo, but it's locked.\n\nPhoto has been restored to the original.`
              );

              setTimeout(async () => {
                try {
                  await api.deleteMessage(chatId, warnMessage.message_id);
                } catch (err) {}
              }, 10000);
            }
          } catch (error) {
            console.error('Error restoring group photo:', error);
          }
        }
      }

      if (event.delete_chat_photo) {
        if (threadData.lockedPhoto && threadData.savedPhoto) {
          try {
            const savedPhoto = threadData.savedPhoto;

            if (savedPhoto === 'NO_PHOTO') {
              const changerName = event.from.first_name || 'Someone';
              const warnMessage = await api.sendMessage(
                chatId,
                `✅ **Group Photo Protected**\n\n${changerName} deleted the group photo. This is the locked state (no photo).`
              );

              setTimeout(async () => {
                try {
                  await api.deleteMessage(chatId, warnMessage.message_id);
                } catch (err) {}
              }, 10000);
            } else {
              const file = await api.getFile(savedPhoto);
              const fileUrl = `https://api.telegram.org/file/bot${global.config.token}/${file.file_path}`;
              
              const axios = require('axios');
              const response = await axios.get(fileUrl, { responseType: 'stream' });
              
              await api.setChatPhoto(chatId, { source: response.data });

              const changerName = event.from.first_name || 'Someone';
              const warnMessage = await api.sendMessage(
                chatId,
                `⚠️ **Group Photo Protected**\n\n${changerName} tried to delete the group photo, but it's locked.\n\nPhoto has been restored.`
              );

              setTimeout(async () => {
                try {
                  await api.deleteMessage(chatId, warnMessage.message_id);
                } catch (err) {}
              }, 10000);
            }
          } catch (error) {
            console.error('Error restoring deleted group photo:', error);
          }
        }
      }

    } catch (error) {
      console.error('AntiChange event error:', error);
    }
  }
};
