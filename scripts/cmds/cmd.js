
const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "cmd",
    aliases: ["command"],
    author: "ST",
    version: "2.0",
    cooldown: 5,
    role: 2,
    description: "Manage bot commands - install, load, unload, delete",
    category: "system",
    usePrefix: true,
    guide: {
      en: `
Usage:
• {p}cmd install <filename.js> <code|url> - Install command from code or URL
• {p}cmd load <filename> - Load a command
• {p}cmd unload <filename> - Unload a command
• {p}cmd loadall - Load all commands
• {p}cmd delete <filename> - Delete a command file

Examples:
• {p}cmd install help.js module.exports = {...}
• {p}cmd install test.js https://pastebin.com/raw/abc123
• {p}cmd load help
• {p}cmd unload help
• {p}cmd delete test.js
      `.trim()
    }
  },

  ST: async function ({ event, api, args, message }) {
    try {
      if (args.length === 0) {
        const guide = this.config.guide.en.replace(/{p}/g, global.config.prefix);
        return message.reply(`📚 Command Management\n\n${guide}`);
      }

      const action = args[0].toLowerCase();

      if (action === 'install') {
        if (args.length < 3) {
          return message.reply('❌ Usage: /cmd install <filename.js> <code|url>');
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
        const commandsPath = path.join(__dirname);
        const filePath = path.join(commandsPath, fileName);

        if (fs.existsSync(filePath)) {
          // File exists, ask for confirmation
          const buttons = [
            [
              { text: '✅ Replace', callback_data: `cmd_replace_${fileName}` },
              { text: '📝 Rename', callback_data: `cmd_rename_${fileName}` }
            ],
            [{ text: '❌ Cancel', callback_data: 'cmd_cancel' }]
          ];

          // Store the code temporarily
          global.ST.onCallback.set(`cmd_install_${fileName}`, {
            commandName: 'cmd',
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

        // Validate code before installing
        try {
          // Check if code has module.exports
          if (!code.includes('module.exports')) {
            return message.reply('❌ Invalid command code: Missing module.exports');
          }

          // Install directly if file doesn't exist
          const result = global.installCommandFile(fileName, code);
          
          if (result.success) {
            try {
              await global.reloadCommand(fileName.replace('.js', ''));
              return message.reply(`✅ ${result.message}\n\n🔄 Command loaded successfully!`);
            } catch (loadError) {
              return message.reply(`⚠️ File installed but failed to load: ${loadError.message}\n\nUse /cmd load ${fileName.replace('.js', '')} to try loading again.`);
            }
          } else {
            return message.reply(`❌ ${result.message}`);
          }
        } catch (validationError) {
          return message.reply(`❌ Code validation failed: ${validationError.message}`);
        }
      }

      if (action === 'load') {
        if (args.length < 2) {
          return message.reply('❌ Usage: /cmd load <filename>');
        }

        const cmdName = args[1].replace('.js', '');
        const result = await global.reloadCommand(cmdName);

        if (result.success) {
          return message.reply(`✅ ${result.message}`);
        } else {
          return message.reply(`❌ ${result.message}`);
        }
      }

      if (action === 'unload') {
        if (args.length < 2) {
          return message.reply('❌ Usage: /cmd unload <filename>');
        }

        const cmdName = args[1].replace('.js', '');
        const result = global.unloadCommand(cmdName);

        if (result.success) {
          return message.reply(`✅ ${result.message}`);
        } else {
          return message.reply(`❌ ${result.message}`);
        }
      }

      if (action === 'loadall') {
        const result = await global.loadCommands(false);
        return message.reply(
          `✅ Load All Commands Complete\n\n` +
          `📦 Loaded: ${result.loaded.length}\n` +
          `❌ Errors: ${result.errors.length}\n\n` +
          (result.errors.length > 0 ? `Failed:\n${result.errors.map(e => `• ${e.file}: ${e.error}`).join('\n')}` : '')
        );
      }

      if (action === 'delete') {
        if (args.length < 2) {
          return message.reply('❌ Usage: /cmd delete <filename.js>');
        }

        const fileName = args[1];
        if (!fileName.endsWith('.js')) {
          return message.reply('❌ Filename must end with .js');
        }

        const result = global.deleteCommandFile(fileName);

        if (result.success) {
          return message.reply(`✅ ${result.message}`);
        } else {
          return message.reply(`❌ ${result.message}`);
        }
      }

      return message.reply('❌ Invalid action. Use: install, load, unload, loadall, delete');

    } catch (error) {
      global.log.error('Error in cmd command:', error);
      return message.reply(`❌ Error: ${error.message}`);
    }
  },

  onCallback: async ({ event, api, message, ctx }) => {
    try {
      const callbackData = event.data;

      if (!callbackData.startsWith('cmd_')) return;

      const userId = event.from.id;
      
      if (callbackData === 'cmd_cancel') {
        await ctx.answerCbQuery('❌ Cancelled');
        await api.deleteMessage(event.message.chat.id, event.message.message_id);
        return;
      }

      if (callbackData.startsWith('cmd_replace_')) {
        const fileName = callbackData.replace('cmd_replace_', '');
        const storedData = global.ST.onCallback.get(`cmd_install_${fileName}`);

        if (!storedData || storedData.userId !== userId) {
          await ctx.answerCbQuery('❌ Session expired or unauthorized');
          return;
        }

        await ctx.answerCbQuery('✅ Replacing file...');

        const result = global.installCommandFile(fileName, storedData.code);
        
        if (result.success) {
          try {
            await global.reloadCommand(fileName.replace('.js', ''));
            await api.editMessageText(
              event.message.chat.id,
              event.message.message_id,
              undefined,
              `✅ File "${fileName}" replaced and loaded successfully!`
            );
          } catch (loadError) {
            await api.editMessageText(
              event.message.chat.id,
              event.message.message_id,
              undefined,
              `⚠️ File replaced but failed to load: ${loadError.message}\n\nUse /cmd load ${fileName.replace('.js', '')} to try loading again.`
            );
          }
        } else {
          await api.editMessageText(
            event.message.chat.id,
            event.message.message_id,
            undefined,
            `❌ Failed to replace: ${result.message}`
          );
        }

        global.ST.onCallback.delete(`cmd_install_${fileName}`);
      }

      if (callbackData.startsWith('cmd_rename_')) {
        const fileName = callbackData.replace('cmd_rename_', '');
        const storedData = global.ST.onCallback.get(`cmd_install_${fileName}`);

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
          commandName: 'cmd',
          action: 'rename_install',
          originalFileName: fileName,
          code: storedData.code,
          userId: userId,
          messageId: event.message.message_id
        });

        global.ST.onCallback.delete(`cmd_install_${fileName}`);
      }

    } catch (error) {
      console.error('Error in cmd callback:', error);
      await ctx.answerCbQuery(`❌ Error: ${error.message}`);
    }
  },

  onReply: async ({ event, api, message }) => {
    try {
      const replyData = global.ST.onReply.get(event.reply_to_message.message_id);
      
      if (!replyData || replyData.commandName !== 'cmd') return;
      if (replyData.userId !== event.from.id) return;

      if (replyData.action === 'rename_install') {
        const newFileName = event.text.trim();
        
        if (!newFileName.endsWith('.js')) {
          return message.reply('❌ Filename must end with .js');
        }

        // Check if new name exists
        const commandsPath = path.join(__dirname);
        const filePath = path.join(commandsPath, newFileName);

        if (fs.existsSync(filePath)) {
          return message.reply(`❌ File "${newFileName}" already exists. Please choose a different name.`);
        }

        // Update code with new command name if it contains module.exports
        let updatedCode = replyData.code;
        const nameMatch = updatedCode.match(/name:\s*["']([^"']+)["']/);
        if (nameMatch) {
          const newCmdName = newFileName.replace('.js', '');
          updatedCode = updatedCode.replace(
            /name:\s*["']([^"']+)["']/,
            `name: "${newCmdName}"`
          );
        }

        const result = global.installCommandFile(newFileName, updatedCode);
        
        if (result.success) {
          try {
            await global.reloadCommand(newFileName.replace('.js', ''));
            await message.reply(`✅ Command installed as "${newFileName}" and loaded successfully!`);
          } catch (loadError) {
            await message.reply(`⚠️ File installed as "${newFileName}" but failed to load: ${loadError.message}\n\nUse /cmd load ${newFileName.replace('.js', '')} to try loading again.`);
          }
        } else {
          await message.reply(`❌ Failed to install: ${result.message}`);
        }

        global.ST.onReply.delete(event.reply_to_message.message_id);
      }

    } catch (error) {
      global.log.error('Error in cmd onReply:', error);
      return message.reply(`❌ Error: ${error.message}`);
    }
  }
};
