module.exports = {
  config: {
    name: "hi",
    aliases: ["hello"],
    author: "ST",
    version: "1.1",
    cooldown: 5,
    role: 0,
    description: "Responds to hi/hello messages",
    category: "fun",
    usePrefix: false
  },

  onChat: async function ({ bot, message, msg, chatId, args, db }) {
    try {
      const text = msg.text?.toLowerCase().trim();

      if (text === 'hi' || text === 'hello') {
        message.react('❤️').catch(() => {});
        await message.reply('Hi! I am STG BOT 👋\n\nUse /help to see all my commands!');
        return false; 
      }
    } catch (error) {
      
    }
  },
  ST: function() {
  }
};