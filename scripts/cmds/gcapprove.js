module.exports = {
  config: {
    name: "gcapprove",
    aliases: ["groupmode", "gcmode"],
    author: "ST | Sheikh Tamim",
    version: "1.0",
    cooldown: 5,
    role: 1,
    description: "Toggle group approval mode and auto-approve settings",
    category: "admin",
    usePrefix: true
  },

  ST: async function ({ event, api, args, message, chatId, userId, ctx }) {
    if (!message.isGroup) {
      return message.reply('❌ This command can only be used in groups.');
    }

    const adminList = await api.getChatAdministrators(chatId);
    const isAdmin = adminList.some(admin => admin.user.id === userId);
    const isBotAdmin = global.config.adminUID.includes(String(userId));

    if (!isAdmin && !isBotAdmin) {
      return message.reply('⚠️ Only group admins can use this command.');
    }

    const thread = await message.db.getThread(chatId);
    const subCommand = args[0]?.toLowerCase();

    if (!subCommand || subCommand === 'status') {
      const statusText = `📊 Group Approval Settings\n\n` +
        `📂 Group: ${message.chatTitle}\n` +
        `🆔 Chat ID: ${chatId}\n\n` +
        `🔐 Approval Mode: ${thread.approvalMode ? '✅ Enabled' : '❌ Disabled'}\n` +
        `🤖 Auto-Approve: ${thread.autoApprove ? '✅ Enabled' : '❌ Disabled'}\n\n` +
        `💡 Use buttons below to toggle settings`;

      const keyboard = message.Markup.inlineKeyboard([
        [
          message.Markup.button.callback(
            thread.approvalMode ? '🔓 Disable Approval' : '🔒 Enable Approval',
            `toggle_approval_${chatId}`
          )
        ],
        [
          message.Markup.button.callback(
            thread.autoApprove ? '⚠️ Disable Auto-Approve' : '✅ Enable Auto-Approve',
            `toggle_autoapprove_${chatId}`
          )
        ],
        [
          message.Markup.button.callback('🔄 Refresh', `gcapprove_refresh_${chatId}`)
        ]
      ]);

      return message.reply(statusText, keyboard);
    }

    if (subCommand === 'on' || subCommand === 'enable') {
      await message.db.updateThread(chatId, { approvalMode: true });
      return message.reply('✅ Group approval mode enabled!\n\nNew members will need approval to chat.');
    }

    if (subCommand === 'off' || subCommand === 'disable') {
      await message.db.updateThread(chatId, { approvalMode: false });
      return message.reply('❌ Group approval mode disabled!\n\nAll members can chat freely.');
    }

    if (subCommand === 'auto') {
      const newState = !thread.autoApprove;
      await message.db.updateThread(chatId, { autoApprove: newState });
      return message.reply(
        newState 
          ? '✅ Auto-approve enabled!\n\nBot will automatically approve members when it has admin rights.' 
          : '❌ Auto-approve disabled!'
      );
    }

    const helpText = `🔧 GC Approval Commands:\n\n` +
      `${global.config.prefix}gcapprove - Show status with buttons\n` +
      `${global.config.prefix}gcapprove on - Enable approval mode\n` +
      `${global.config.prefix}gcapprove off - Disable approval mode\n` +
      `${global.config.prefix}gcapprove auto - Toggle auto-approve\n` +
      `${global.config.prefix}gcapprove status - View current settings`;

    return message.reply(helpText);
  },

  onCallback: async function ({ event, api, message, ctx }) {
    const data = event.data;
    const userId = event.from.id;

    const chatIdMatch = data.match(/_(-?\d+)$/);
    if (!chatIdMatch) return;
    
    const chatId = chatIdMatch[1];

    const adminList = await api.getChatAdministrators(chatId);
    const isAdmin = adminList.some(admin => admin.user.id === userId);
    const isBotAdmin = global.config.adminUID.includes(String(userId));

    if (!isAdmin && !isBotAdmin) {
      return ctx.answerCbQuery('⚠️ Only admins can change these settings!', { show_alert: true });
    }

    if (data.startsWith('toggle_approval_')) {
      const thread = await message.db.getThread(chatId);
      const newState = !thread.approvalMode;
      await message.db.updateThread(chatId, { approvalMode: newState });

      const statusText = `📊 Group Approval Settings\n\n` +
        `📂 Group: ${thread.name}\n` +
        `🆔 Chat ID: ${chatId}\n\n` +
        `🔐 Approval Mode: ${newState ? '✅ Enabled' : '❌ Disabled'}\n` +
        `🤖 Auto-Approve: ${thread.autoApprove ? '✅ Enabled' : '❌ Disabled'}\n\n` +
        `💡 Use buttons below to toggle settings`;

      const keyboard = message.Markup.inlineKeyboard([
        [
          message.Markup.button.callback(
            newState ? '🔓 Disable Approval' : '🔒 Enable Approval',
            `toggle_approval_${chatId}`
          )
        ],
        [
          message.Markup.button.callback(
            thread.autoApprove ? '⚠️ Disable Auto-Approve' : '✅ Enable Auto-Approve',
            `toggle_autoapprove_${chatId}`
          )
        ],
        [
          message.Markup.button.callback('🔄 Refresh', `gcapprove_refresh_${chatId}`)
        ]
      ]);

      await ctx.editMessageText(statusText, keyboard);
      await ctx.answerCbQuery(newState ? '✅ Approval mode enabled!' : '❌ Approval mode disabled!');
    }

    if (data.startsWith('toggle_autoapprove_')) {
      const thread = await message.db.getThread(chatId);
      const newState = !thread.autoApprove;
      await message.db.updateThread(chatId, { autoApprove: newState });

      const statusText = `📊 Group Approval Settings\n\n` +
        `📂 Group: ${thread.name}\n` +
        `🆔 Chat ID: ${chatId}\n\n` +
        `🔐 Approval Mode: ${thread.approvalMode ? '✅ Enabled' : '❌ Disabled'}\n` +
        `🤖 Auto-Approve: ${newState ? '✅ Enabled' : '❌ Disabled'}\n\n` +
        `💡 Use buttons below to toggle settings`;

      const keyboard = message.Markup.inlineKeyboard([
        [
          message.Markup.button.callback(
            thread.approvalMode ? '🔓 Disable Approval' : '🔒 Enable Approval',
            `toggle_approval_${chatId}`
          )
        ],
        [
          message.Markup.button.callback(
            newState ? '⚠️ Disable Auto-Approve' : '✅ Enable Auto-Approve',
            `toggle_autoapprove_${chatId}`
          )
        ],
        [
          message.Markup.button.callback('🔄 Refresh', `gcapprove_refresh_${chatId}`)
        ]
      ]);

      await ctx.editMessageText(statusText, keyboard);
      await ctx.answerCbQuery(newState ? '✅ Auto-approve enabled!' : '❌ Auto-approve disabled!');
    }

    if (data.startsWith('gcapprove_refresh_')) {
      const thread = await message.db.getThread(chatId);

      const statusText = `📊 Group Approval Settings\n\n` +
        `📂 Group: ${thread.name}\n` +
        `🆔 Chat ID: ${chatId}\n\n` +
        `🔐 Approval Mode: ${thread.approvalMode ? '✅ Enabled' : '❌ Disabled'}\n` +
        `🤖 Auto-Approve: ${thread.autoApprove ? '✅ Enabled' : '❌ Disabled'}\n\n` +
        `💡 Use buttons below to toggle settings`;

      const keyboard = message.Markup.inlineKeyboard([
        [
          message.Markup.button.callback(
            thread.approvalMode ? '🔓 Disable Approval' : '🔒 Enable Approval',
            `toggle_approval_${chatId}`
          )
        ],
        [
          message.Markup.button.callback(
            thread.autoApprove ? '⚠️ Disable Auto-Approve' : '✅ Enable Auto-Approve',
            `toggle_autoapprove_${chatId}`
          )
        ],
        [
          message.Markup.button.callback('🔄 Refresh', `gcapprove_refresh_${chatId}`)
        ]
      ]);

      await ctx.editMessageText(statusText, keyboard);
      await ctx.answerCbQuery('🔄 Refreshed!');
    }
  }
};
