
const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "event",
    aliases: ["evt"],
    author: "ST",
    version: "2.0",
    cooldown: 5,
    role: 2,
    description: "Manage bot events - install, load, unload, delete",
    category: "system",
    usePrefix: true,
    guide: {
      en: `
Usage:
• {p}event install <filename.js> <code|url> - Install event from code or URL
• {p}event load <filename> - Load an event
• {p}event unload <filename> - Unload an event
• {p}event loadall - Load all events
• {p}event delete <filename> - Delete an event file

Examples:
• {p}event install welcome.js module.exports = {...}
• {p}event install test.js https://pastebin.com/raw/abc123
• {p}event load welcome
• {p}event unload welcome
• {p}event delete test.js
      `.trim()
    }
  },

  ST: async function ({ event, api, args, message }) {
    try {
      if (args.length === 0) {
        const guide = this.config.guide.en.replace(/{p}/g, global.config.prefix);
        return message.reply(`📚 Event Management\n\n${guide}`);
      }

      const action = args[0].toLowerCase();

      if (action === 'install') {
        if (args.length < 3) {
          return message.reply('❌ Usage: /event install <filename.js> <code|url>');
        }

        const fileName = args[1];
        if (!fileName.endsWith('.js')) {
          return message.reply('❌ Filename must end with .js');
        }

        const codeOrUrl = args.slice(2).join(' ');
        let code = '';

        // Check if it's a URL
        if (codeOrUrl.startsWith('http://') || codeOrUrl.startsWith('https://')) {
          try {
            const response = await axios.get(codeOrUrl);
            code = response.data;
          } catch (error) {
            return message.reply(`❌ Failed to fetch from URL: ${error.message}`);
          }
        } else {
          code = codeOrUrl;
        }

        // Check if file already exists
        const eventsPath = path.join(__dirname, '..', 'events');
        const filePath = path.join(eventsPath, fileName);

        if (fs.existsSync(filePath)) {
          // File exists, ask for confirmation
          const buttons = [
            [
              { text: '✅ Replace', callback_data: `evt_replace_${fileName}` },
              { text: '📝 Rename', callback_data: `evt_rename_${fileName}` }
            ],
            [{ text: '❌ Cancel', callback_data: 'evt_cancel' }]
          ];

          // Store the code temporarily
          global.ST.onCallback.set(`evt_install_${fileName}`, {
            commandName: 'event',
            action: 'install',
            fileName: fileName,
            code: code,
            userId: event.from.id
          });

          return await api.sendMessage(
            event.chat.id,
            `⚠️ File "${fileName}" already exists.\n\nWhat would you like to do?`,
            {
              reply_markup: { inline_keyboard: buttons }
            }
          );
        }

        // Install directly if file doesn't exist
        const result = global.installEventFile(fileName, code);
        
        if (result.success) {
          await global.reloadEvent(fileName.replace('.js', ''));
          return message.reply(`✅ ${result.message}\n\n🔄 Event loaded successfully!`);
        } else {
          return message.reply(`❌ ${result.message}`);
        }
      }

      if (action === 'load') {
        if (args.length < 2) {
          return message.reply('❌ Usage: /event load <filename>');
        }

        const evtName = args[1].replace('.js', '');
        const result = await global.reloadEvent(evtName);

        if (result.success) {
          return message.reply(`✅ ${result.message}`);
        } else {
          return message.reply(`❌ ${result.message}`);
        }
      }

      if (action === 'unload') {
        if (args.length < 2) {
          return message.reply('❌ Usage: /event unload <filename>');
        }

        const evtName = args[1].replace('.js', '');
        const result = global.unloadEvent(evtName);

        if (result.success) {
          return message.reply(`✅ ${result.message}`);
        } else {
          return message.reply(`❌ ${result.message}`);
        }
      }

      if (action === 'loadall') {
        const result = await global.loadEvents(false);
        return message.reply(
          `✅ Load All Events Complete\n\n` +
          `📦 Loaded: ${result.loaded.length}\n` +
          `❌ Errors: ${result.errors.length}\n\n` +
          (result.errors.length > 0 ? `Failed:\n${result.errors.map(e => `• ${e.file}: ${e.error}`).join('\n')}` : '')
        );
      }

      if (action === 'delete') {
        if (args.length < 2) {
          return message.reply('❌ Usage: /event delete <filename.js>');
        }

        const fileName = args[1];
        if (!fileName.endsWith('.js')) {
          return message.reply('❌ Filename must end with .js');
        }

        const result = global.deleteEventFile(fileName);

        if (result.success) {
          return message.reply(`✅ ${result.message}`);
        } else {
          return message.reply(`❌ ${result.message}`);
        }
      }

      return message.reply('❌ Invalid action. Use: install, load, unload, loadall, delete');

    } catch (error) {
      global.log.error('Error in event command:', error);
      return message.reply(`❌ Error: ${error.message}`);
    }
  },

  onCallback: async ({ event, api, message, ctx }) => {
    try {
      const callbackData = event.data;

      if (!callbackData.startsWith('evt_')) return;

      const userId = event.from.id;
      
      if (callbackData === 'evt_cancel') {
        await ctx.answerCbQuery('❌ Cancelled');
        await api.deleteMessage(event.message.chat.id, event.message.message_id);
        return;
      }

      if (callbackData.startsWith('evt_replace_')) {
        const fileName = callbackData.replace('evt_replace_', '');
        const storedData = global.ST.onCallback.get(`evt_install_${fileName}`);

        if (!storedData || storedData.userId !== userId) {
          await ctx.answerCbQuery('❌ Session expired or unauthorized');
          return;
        }

        await ctx.answerCbQuery('✅ Replacing file...');

        const result = global.installEventFile(fileName, storedData.code);
        
        if (result.success) {
          await global.reloadEvent(fileName.replace('.js', ''));
          await api.editMessageText(
            event.message.chat.id,
            event.message.message_id,
            undefined,
            `✅ File "${fileName}" replaced and loaded successfully!`
          );
        } else {
          await api.editMessageText(
            event.message.chat.id,
            event.message.message_id,
            undefined,
            `❌ Failed to replace: ${result.message}`
          );
        }

        global.ST.onCallback.delete(`evt_install_${fileName}`);
      }

      if (callbackData.startsWith('evt_rename_')) {
        const fileName = callbackData.replace('evt_rename_', '');
        const storedData = global.ST.onCallback.get(`evt_install_${fileName}`);

        if (!storedData || storedData.userId !== userId) {
          await ctx.answerCbQuery('❌ Session expired or unauthorized');
          return;
        }

        await ctx.answerCbQuery('📝 Please provide new name...');
        await api.editMessageText(
          event.message.chat.id,
          event.message.message_id,
          undefined,
          `📝 Please reply with the new filename (must end with .js):`
        );

        // Set up reply handler
        global.ST.onReply.set(event.message.message_id, {
          commandName: 'event',
          action: 'rename_install',
          originalFileName: fileName,
          code: storedData.code,
          userId: userId,
          messageId: event.message.message_id
        });

        global.ST.onCallback.delete(`evt_install_${fileName}`);
      }

    } catch (error) {
      console.error('Error in event callback:', error);
      await ctx.answerCbQuery(`❌ Error: ${error.message}`);
    }
  },

  onReply: async ({ event, api, message }) => {
    try {
      const replyData = global.ST.onReply.get(event.reply_to_message.message_id);
      
      if (!replyData || replyData.commandName !== 'event') return;
      if (replyData.userId !== event.from.id) return;

      if (replyData.action === 'rename_install') {
        const newFileName = event.text.trim();
        
        if (!newFileName.endsWith('.js')) {
          return message.reply('❌ Filename must end with .js');
        }

        // Check if new name exists
        const eventsPath = path.join(__dirname, '..', 'events');
        const filePath = path.join(eventsPath, newFileName);

        if (fs.existsSync(filePath)) {
          return message.reply(`❌ File "${newFileName}" already exists. Please choose a different name.`);
        }

        // Update code with new event name if it contains module.exports
        let updatedCode = replyData.code;
        const nameMatch = updatedCode.match(/name:\s*["']([^"']+)["']/);
        if (nameMatch) {
          const newEvtName = newFileName.replace('.js', '');
          updatedCode = updatedCode.replace(
            /name:\s*["']([^"']+)["']/,
            `name: "${newEvtName}"`
          );
        }

        const result = global.installEventFile(newFileName, updatedCode);
        
        if (result.success) {
          await global.reloadEvent(newFileName.replace('.js', ''));
          await message.reply(`✅ Event installed as "${newFileName}" and loaded successfully!`);
        } else {
          await message.reply(`❌ Failed to install: ${result.message}`);
        }

        global.ST.onReply.delete(event.reply_to_message.message_id);
      }

    } catch (error) {
      global.log.error('Error in event onReply:', error);
      return message.reply(`❌ Error: ${error.message}`);
    }
  }
};
