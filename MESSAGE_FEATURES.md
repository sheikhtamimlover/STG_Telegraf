# 📬 Complete Message API Documentation

This document covers all available message methods in the bot's `message` object.

## 🔄 Message Sending Methods

### `message.reply(text, options)`
Sends a message as a **reply** to the user's message (shows reply connection).
```javascript
await message.reply("This is a reply to your message!");
await message.reply("Reply with options", { parse_mode: 'Markdown' });
```

### `message.send(text, chatId, options)`
Sends a **new message** without replying (no reply connection).
```javascript
await message.send("New message!");
await message.send("Message to another chat", "123456789");
await message.send("Message with **bold**", null, { parse_mode: 'Markdown' });
```

## 📸 Media Sending Methods

### `message.sendPhoto(photo, options)`
```javascript
await message.sendPhoto('https://example.com/image.jpg', { caption: 'Photo caption' });
await message.sendPhoto({ source: fs.createReadStream('photo.jpg') });
```

### `message.sendVideo(video, options)`
```javascript
await message.sendVideo('https://example.com/video.mp4', { caption: 'Video caption' });
```

### `message.sendAudio(audio, options)`
```javascript
await message.sendAudio('https://example.com/audio.mp3', { caption: 'Song title' });
```

### `message.sendDocument(document, options)`
```javascript
await message.sendDocument('https://example.com/file.pdf', { caption: 'Document' });
```

### `message.sendAnimation(animation, options)`
```javascript
await message.sendAnimation('https://example.com/animation.gif', { caption: 'GIF' });
```

### `message.sendVoice(voice, options)`
```javascript
await message.sendVoice({ source: fs.createReadStream('voice.ogg') });
```

### `message.sendVideoNote(videoNote, options)`
```javascript
await message.sendVideoNote({ source: fs.createReadStream('video_note.mp4') });
```

### `message.sendMediaGroup(media, options)`
```javascript
await message.sendMediaGroup([
  { type: 'photo', media: 'https://example.com/1.jpg' },
  { type: 'photo', media: 'https://example.com/2.jpg' }
]);
```

## 📍 Location & Contact Methods

### `message.sendLocation(latitude, longitude, options)`
```javascript
await message.sendLocation(23.8103, 90.4125, { chatId: '123456' });
```

### `message.sendVenue(latitude, longitude, title, address, options)`
```javascript
await message.sendVenue(23.8103, 90.4125, 'Restaurant Name', 'Dhaka, Bangladesh');
```

### `message.sendContact(phoneNumber, firstName, options)`
```javascript
await message.sendContact('+8801234567890', 'John', { last_name: 'Doe' });
```

## 🎲 Interactive Methods

### `message.sendPoll(question, options, extraOptions)`
```javascript
await message.sendPoll('What is your favorite color?', ['Red', 'Blue', 'Green'], {
  is_anonymous: true
});
```

### `message.sendQuiz(question, options, correctOptionId, extraOptions)`
```javascript
await message.sendQuiz(
  'What is 2+2?',
  ['3', '4', '5', '6'],
  1, // Correct answer index (4)
  { explanation: 'Basic math!' }
);
```

### `message.sendDice(emoji, options)`
```javascript
await message.sendDice('🎲'); // Dice
await message.sendDice('🎯'); // Dart
await message.sendDice('🏀'); // Basketball
await message.sendDice('⚽'); // Football
await message.sendDice('🎰'); // Slot machine
```

## 💬 Chat Actions (Typing Indicators)

### `message.sendChatAction(action)`
Shows typing, uploading, recording indicators:
```javascript
await message.sendChatAction('typing');
await message.sendChatAction('upload_photo');
await message.sendChatAction('record_video');
await message.sendChatAction('upload_video');
await message.sendChatAction('record_voice');
await message.sendChatAction('upload_voice');
await message.sendChatAction('upload_document');
await message.sendChatAction('choose_sticker');
await message.sendChatAction('find_location');
```

### `message.indicator(action, duration)`
Same as sendChatAction but with auto-stop after duration:
```javascript
await message.indicator('typing', 5000); // 5 seconds
```

## ✏️ Message Editing Methods

### `message.edit(text, messageId, chatId, options)`
```javascript
await message.edit('Updated text', sentMessage.message_id);
await message.edit('**Bold text**', msgId, null, { parse_mode: 'Markdown' });
```

### `message.editCaption(caption, messageId, chatId, options)`
```javascript
await message.editCaption('New caption', photoMessage.message_id);
```

### `message.editMedia(media, messageId, chatId, options)`
```javascript
await message.editMedia({ type: 'photo', media: 'new_photo.jpg' }, msgId);
```

### `message.editReplyMarkup(markup, messageId, chatId)`
```javascript
const { Markup } = require('telegraf');
await message.editReplyMarkup(
  Markup.inlineKeyboard([
    [Markup.button.callback('New Button', 'new_data')]
  ]),
  msgId
);
```

## 🔄 Message Actions

### `message.forwardMessage(toChatId, fromChatId, messageId)`
```javascript
await message.forwardMessage('987654321', null, ctx.message.message_id);
```

### `message.copyMessage(toChatId, fromChatId, messageId, options)`
```javascript
await message.copyMessage('987654321', null, ctx.message.message_id);
```

### `message.unsend(messageId, chatId)`
Deletes a message:
```javascript
await message.unsend(sentMessage.message_id);
```

### `message.react(emoji, messageId, isBig)`
React to a message with emoji:
```javascript
await message.react('👍'); // React to current message
await message.react('❤️', messageId, true); // Big reaction
```

## 📌 Pin Methods

### `message.pin(messageId, chatId, disableNotification)`
```javascript
await message.pin(ctx.message.message_id);
await message.pin(msgId, null, true); // Silent pin
```

### `message.unpin(messageId, chatId)`
```javascript
await message.unpin(msgId); // Unpin specific message
await message.unpin(); // Unpin all
```

### `message.unpinAll(chatId)`
```javascript
await message.unpinAll(); // Unpin all messages in chat
```

## 👤 User Methods

### `message.mention(userRef, chatId, sendMessage)`
```javascript
// Mention by user object
const mention = await message.mention(ctx.from);
await message.send(mention.mentionText, null, { parse_mode: 'Markdown' });

// Mention by ID
const mention2 = await message.mention('123456789');

// Mention by username
const mention3 = await message.mention('@username');

// Send mention immediately
await message.mention(ctx.from, null, true);
```

## 📎 Attachment Methods

### `message.sendAttachment(options)`
```javascript
// Single file
await message.sendAttachment({
  body: 'Check this out!',
  attachment: './photo.jpg'
});

// Multiple files
await message.sendAttachment({
  body: 'Album',
  attachment: ['./photo1.jpg', './photo2.jpg']
});
```

### `message.getAttachment(type)`
```javascript
const attachment = message.getAttachment('photo');
const anyAttachment = message.getAttachment('any');
// Types: 'photo', 'video', 'audio', 'document', 'voice', 'sticker', 'animation', 'any'
```

### `message.downloadAttachment(attachment, savePath)`
```javascript
const attachment = message.getAttachment('photo');
const filePath = await message.downloadAttachment(attachment, './downloads/photo.jpg');
```

## 🔧 Markup Builder

Access Telegraf's Markup builder via `message.Markup`:
```javascript
const keyboard = message.Markup.keyboard([
  ['Button 1', 'Button 2'],
  ['Button 3']
]).resize();

const inline = message.Markup.inlineKeyboard([
  [message.Markup.button.callback('Click me', 'callback_data')],
  [message.Markup.button.url('Visit', 'https://example.com')]
]);

await message.reply('Choose:', keyboard);
await message.send('Inline buttons:', null, inline);
```

## ⚙️ Admin Reaction Unsend Feature

Admins can now delete bot messages by reacting with a specific emoji!

### Configuration (config.json)
```json
{
  "adminReactionUnsend": {
    "enabled": true,
    "emoji": "👎",
    "note": "When enabled, admins can react with specified emoji to bot messages to delete them"
  }
}
```

### How it works:
1. Admin reacts to any bot message with the configured emoji (default: 👎)
2. Bot automatically deletes the message
3. Only works for admin users defined in `adminUID`
4. Can be enabled/disabled via config
5. Emoji can be customized (e.g., "🗑️", "❌", "👎")

### Example Usage:
1. Bot sends a message
2. Admin reacts with 👎 emoji
3. Message gets deleted automatically

## 💾 Database Access

### Get User Data
```javascript
const user = await global.db.getUser(userId);
console.log(user.level, user.exp, user.money);

// Update user
await global.db.updateUser(userId, { money: user.money + 100 });
```

### Get Thread/GC Data
```javascript
const thread = await global.db.getThread(chatId);
console.log(thread.type); // 'private', 'group', 'supergroup', 'channel'
console.log(thread.isGroup); // true/false
console.log(thread.totalMessages);

// Update thread
await global.db.updateThread(chatId, { approved: true });
```

### Message Count
```javascript
// Get user's message count in current chat
const count = await global.db.getUserMessageCount(userId, chatId);

// Get thread statistics
const stats = await global.db.getThreadMessageStats(chatId);
console.log(stats.totalMessages);
console.log(stats.userMessages); // Object with userId: count
```

## 🎯 Using ctx (Telegraf Context)

### Direct ctx Usage
```javascript
module.exports.ST = async function({ ctx, message }) {
  // React using ctx
  await ctx.react('🔥');
  
  // Reply using ctx
  await ctx.reply('Hello from ctx!');
  
  // Get chat info
  console.log(ctx.chat.type); // 'private', 'group', etc.
  console.log(ctx.from.id); // User ID
  
  // Send typing action
  await ctx.sendChatAction('typing');
  
  // Delete message
  await ctx.deleteMessage();
};
```

## 📝 Examples

### Basic Command with Database
```javascript
module.exports.ST = async function({ event, api, args, message, chatId, userId, ctx }) {
  // Get user from database
  const user = await global.db.getUser(userId);
  
  // Reply to user with await
  await message.reply(`Hello ${user.firstName}! Your level is ${user.level}`);
  
  // React using ctx
  await ctx.react('👍');
  
  // Send new message with await
  await message.send("This is a new message");
  
  // Send with typing indicator
  await message.indicator('typing', 3000);
  await message.reply("Typing done!");
};
```

### Thread/GC Detection
```javascript
module.exports.ST = async function({ ctx, message, chatId }) {
  const thread = await global.db.getThread(chatId);
  
  if (thread.isPrivate) {
    await message.reply("This is a private chat!");
  } else if (thread.isGroup || thread.isSupergroup) {
    await message.reply(`This is a group: ${thread.name}`);
    await message.reply(`Total members: ${thread.totalUsers}`);
  }
  
  // React based on chat type
  await ctx.react(thread.isPrivate ? '💬' : '👥');
};
```

### Advanced Example
```javascript
module.exports.ST = async function({ event, api, args, message }) {
  // Send photo with caption
  const photo = await message.sendPhoto('https://example.com/image.jpg', {
    caption: 'Beautiful photo!'
  });
  
  // Wait 3 seconds
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Edit caption
  await message.editCaption('Updated caption!', photo.message_id);
  
  // React to photo
  await message.react('❤️', photo.message_id);
  
  // Pin the photo
  await message.pin(photo.message_id, null, true);
};
```

### Media Group Example
```javascript
module.exports.ST = async function({ event, api, args, message }) {
  const media = [
    { type: 'photo', media: 'https://example.com/1.jpg', caption: 'First' },
    { type: 'photo', media: 'https://example.com/2.jpg' },
    { type: 'photo', media: 'https://example.com/3.jpg' }
  ];
  
  await message.sendMediaGroup(media);
};
```

## 🎯 Key Differences

| Method | Behavior |
|--------|----------|
| `message.reply()` | Shows as reply to user's message |
| `message.send()` | Sends as new message (no reply) |
| `message.react()` | Adds emoji reaction |
| `message.unsend()` | Deletes a message |
| `message.edit()` | Edits message text |
| `message.indicator()` | Shows typing/uploading status |

---

All methods support Telegraf's full feature set! 🚀
