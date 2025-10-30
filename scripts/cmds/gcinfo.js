module.exports = {
  config: {
    name: "gcinfo",
    aliases: ["groupinfo", "ginfo"],
    author: "ST | Sheikh Tamim",
    version: "1.0",
    cooldown: 5,
    role: 0,
    description: "Display detailed group information",
    category: "utility",
    usePrefix: true
  },

  ST: async function ({ event, api, args, message, chatId, userId, ctx }) {
    if (!message.isGroup) {
      return message.reply('❌ This command can only be used in groups.');
    }

    try {
      await message.indicator('typing');

      const chat = await api.getChat(chatId);
      const adminList = await api.getChatAdministrators(chatId);
      const membersCount = await api.getChatMembersCount(chatId);
      const thread = await message.db.getThread(chatId);

      const admins = adminList.filter(admin => !admin.user.is_bot);
      const botAdmins = adminList.filter(admin => admin.user.is_bot);
      const owners = adminList.filter(admin => admin.status === 'creator');

      const botMember = adminList.find(admin => admin.user.id === ctx.botInfo?.id);
      const botIsAdmin = !!botMember;

      let infoText = `📊 Group Information\n\n`;
      infoText += `📂 Name: ${chat.title}\n`;
      infoText += `🆔 Chat ID: ${chatId}\n`;
      infoText += `📝 Type: ${chat.type}\n`;
      infoText += `👥 Total Members: ${membersCount}\n`;
      infoText += `👨‍💼 Admins: ${admins.length}\n`;
      infoText += `🤖 Bot Admins: ${botAdmins.length}\n`;
      
      if (chat.username) {
        infoText += `🔗 Username: @${chat.username}\n`;
      }
      
      if (chat.description) {
        infoText += `\n📄 Description:\n${chat.description.substring(0, 200)}${chat.description.length > 200 ? '...' : ''}\n`;
      }

      infoText += `\n⚙️ Bot Settings:\n`;
      infoText += `🔐 Approval Mode: ${thread.approvalMode ? '✅ Enabled' : '❌ Disabled'}\n`;
      infoText += `🤖 Auto-Approve: ${thread.autoApprove ? '✅ Enabled' : '❌ Disabled'}\n`;
      infoText += `🚪 Anti-Out: ${thread.antiOut ? '✅ Enabled' : '❌ Disabled'}\n`;
      infoText += `📍 Custom Prefix: ${thread.customPrefix || global.config.prefix}\n`;
      infoText += `📨 Total Messages: ${thread.totalMessages || 0}\n`;
      infoText += `🤖 Bot is Admin: ${botIsAdmin ? '✅ Yes' : '❌ No'}\n`;

      if (owners.length > 0) {
        infoText += `\n👑 Owner${owners.length > 1 ? 's' : ''}:\n`;
        owners.forEach(owner => {
          const name = owner.user.first_name + (owner.user.last_name ? ' ' + owner.user.last_name : '');
          infoText += `   • ${name}${owner.user.username ? ` (@${owner.user.username})` : ''}\n`;
        });
      }

      const keyboard = message.Markup.inlineKeyboard([
        [
          message.Markup.button.callback('👥 Show Admins', `show_admins_${chatId}`),
          message.Markup.button.callback('📊 Stats', `show_stats_${chatId}`)
        ],
        [
          message.Markup.button.callback('🔄 Refresh', `gcinfo_refresh_${chatId}`)
        ]
      ]);

      return message.reply(infoText, keyboard);
    } catch (error) {
      return message.reply(`❌ Error fetching group info: ${error.message}`);
    }
  },

  onCallback: async function ({ event, api, message, ctx }) {
    const data = event.data;
    const userId = event.from.id;

    const chatIdMatch = data.match(/_(-?\d+)$/);
    if (!chatIdMatch) return;
    
    const chatId = chatIdMatch[1];

    if (data.startsWith('show_admins_')) {
      try {
        const adminList = await api.getChatAdministrators(chatId);
        const admins = adminList.filter(admin => !admin.user.is_bot);

        let adminText = `👥 Group Administrators (${admins.length}):\n\n`;
        
        admins.forEach((admin, index) => {
          const name = admin.user.first_name + (admin.user.last_name ? ' ' + admin.user.last_name : '');
          const username = admin.user.username ? `@${admin.user.username}` : '';
          const status = admin.status === 'creator' ? '👑' : '👨‍💼';
          adminText += `${index + 1}. ${status} ${name} ${username}\n`;
        });

        const keyboard = message.Markup.inlineKeyboard([
          [message.Markup.button.callback('« Back', `gcinfo_refresh_${chatId}`)]
        ]);

        await ctx.editMessageText(adminText, keyboard);
        await ctx.answerCbQuery('✅ Admins list loaded!');
      } catch (error) {
        await ctx.answerCbQuery('❌ Error loading admins!', { show_alert: true });
      }
    }

    if (data.startsWith('show_stats_')) {
      try {
        const thread = await message.db.getThread(chatId);
        const userMessages = thread.userMessages || {};
        const sortedUsers = Object.entries(userMessages)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 10);

        let statsText = `📊 Group Statistics\n\n`;
        statsText += `📨 Total Messages: ${thread.totalMessages || 0}\n`;
        statsText += `👥 Active Users: ${Object.keys(userMessages).length}\n\n`;
        statsText += `🏆 Top 10 Chatters:\n`;

        for (let i = 0; i < sortedUsers.length; i++) {
          const [uid, count] = sortedUsers[i];
          try {
            const user = await message.db.getUser(uid);
            const name = user.firstName || 'Unknown User';
            statsText += `${i + 1}. ${name}: ${count} msgs\n`;
          } catch (error) {
            statsText += `${i + 1}. User ${uid}: ${count} msgs\n`;
          }
        }

        const keyboard = message.Markup.inlineKeyboard([
          [message.Markup.button.callback('« Back', `gcinfo_refresh_${chatId}`)]
        ]);

        await ctx.editMessageText(statsText, keyboard);
        await ctx.answerCbQuery('✅ Stats loaded!');
      } catch (error) {
        await ctx.answerCbQuery('❌ Error loading stats!', { show_alert: true });
      }
    }

    if (data.startsWith('gcinfo_refresh_')) {
      try {
        const chat = await api.getChat(chatId);
        const adminList = await api.getChatAdministrators(chatId);
        const membersCount = await api.getChatMembersCount(chatId);
        const thread = await message.db.getThread(chatId);

        const admins = adminList.filter(admin => !admin.user.is_bot);
        const botAdmins = adminList.filter(admin => admin.user.is_bot);
        const owners = adminList.filter(admin => admin.status === 'creator');

        const botMember = adminList.find(admin => admin.user.id === ctx.botInfo?.id);
        const botIsAdmin = !!botMember;

        let infoText = `📊 Group Information\n\n`;
        infoText += `📂 Name: ${chat.title}\n`;
        infoText += `🆔 Chat ID: ${chatId}\n`;
        infoText += `📝 Type: ${chat.type}\n`;
        infoText += `👥 Total Members: ${membersCount}\n`;
        infoText += `👨‍💼 Admins: ${admins.length}\n`;
        infoText += `🤖 Bot Admins: ${botAdmins.length}\n`;
        
        if (chat.username) {
          infoText += `🔗 Username: @${chat.username}\n`;
        }
        
        if (chat.description) {
          infoText += `\n📄 Description:\n${chat.description.substring(0, 200)}${chat.description.length > 200 ? '...' : ''}\n`;
        }

        infoText += `\n⚙️ Bot Settings:\n`;
        infoText += `🔐 Approval Mode: ${thread.approvalMode ? '✅ Enabled' : '❌ Disabled'}\n`;
        infoText += `🤖 Auto-Approve: ${thread.autoApprove ? '✅ Enabled' : '❌ Disabled'}\n`;
        infoText += `🚪 Anti-Out: ${thread.antiOut ? '✅ Enabled' : '❌ Disabled'}\n`;
        infoText += `📍 Custom Prefix: ${thread.customPrefix || global.config.prefix}\n`;
        infoText += `📨 Total Messages: ${thread.totalMessages || 0}\n`;
        infoText += `🤖 Bot is Admin: ${botIsAdmin ? '✅ Yes' : '❌ No'}\n`;

        if (owners.length > 0) {
          infoText += `\n👑 Owner${owners.length > 1 ? 's' : ''}:\n`;
          owners.forEach(owner => {
            const name = owner.user.first_name + (owner.user.last_name ? ' ' + owner.user.last_name : '');
            infoText += `   • ${name}${owner.user.username ? ` (@${owner.user.username})` : ''}\n`;
          });
        }

        const keyboard = message.Markup.inlineKeyboard([
          [
            message.Markup.button.callback('👥 Show Admins', `show_admins_${chatId}`),
            message.Markup.button.callback('📊 Stats', `show_stats_${chatId}`)
          ],
          [
            message.Markup.button.callback('🔄 Refresh', `gcinfo_refresh_${chatId}`)
          ]
        ]);

        await ctx.editMessageText(infoText, keyboard);
        await ctx.answerCbQuery('🔄 Refreshed!');
      } catch (error) {
        await ctx.answerCbQuery('❌ Error refreshing!', { show_alert: true });
      }
    }
  }
};
