
# 📘 Complete Eval Command Guide

This guide shows you how to test all system features using the `/eval` command.

## 🔧 Basic Syntax

```javascript
/eval <code>
```

The eval command supports:
- `await` for async operations
- Access to: `message`, `api`, `event`, `ctx`, `db`, `global`, `require`, `axios`, `fs`, `path`

---

## 💬 Message API Tests

### Send Messages
```javascript
// Simple reply
await message.reply('Hello World!');

// Send without reply
await message.send('New message');

// Reply with markdown
await message.reply('**Bold** and _italic_', { parse_mode: 'Markdown' });
```

### React to Messages
```javascript
// React using ctx (recommended)
await ctx.react('🔥');

// React using message
await message.react('❤️');

// React to specific message
await message.react('👍', event.message_id);
```

### Send Media
```javascript
// Send photo
await message.sendPhoto('https://example.com/image.jpg', { caption: 'Photo!' });

// Send with local file
const fs = require('fs');
await message.sendPhoto({ source: fs.createReadStream('./image.jpg') });

// Send attachment helper
await message.sendAttachment({
  body: 'Check this out!',
  attachment: './file.jpg'
});
```

### Edit Messages
```javascript
// Send and edit
const sent = await message.reply('Original text');
await new Promise(r => setTimeout(r, 2000));
await message.edit('Edited text!', sent.message_id);
```

### Delete Messages
```javascript
const sent = await message.reply('Delete me!');
await new Promise(r => setTimeout(r, 2000));
await message.unsend(sent.message_id);
```

---

## 💾 Database Tests

### User Database
```javascript
// Get user data
const user = await db.getUser(event.from.id);
return user;

// Using message.db shortcut
const user = await message.db.getUser(event.from.id);
return user;

// Update user
await db.updateUser(event.from.id, { money: 1000, level: 10 });
return 'User updated';

// Increment exp
await db.incrementUserExp(event.from.id, 50);
return 'Exp added';

// Get all users
const users = await db.getAllUsers();
return `Total users: ${users.length}`;
```

### Thread/Group Database
```javascript
// Get thread data
const thread = await db.getThread(event.chat.id);
return thread;

// Using message.db shortcut
const thread = await message.db.getThread(event.chat.id);
return thread;

// Update thread
await db.updateThread(event.chat.id, { approved: true, customPrefix: '!' });
return 'Thread updated';

// Get all threads
const threads = await db.getAllThreads();
return `Total threads: ${threads.length}`;
```

### Message Count Tracking
```javascript
// Get user's message count in current chat
const count = await db.getUserMessageCount(event.from.id, event.chat.id);
return `Your messages: ${count}`;

// Get thread statistics
const stats = await db.getThreadMessageStats(event.chat.id);
return stats;

// Increment manually
await db.incrementMessageCount(event.from.id, event.chat.id);
return 'Message count incremented';
```

### Warnings System
```javascript
// Add warning
const count = await db.addWarning(event.from.id, event.chat.id, 'Spam', 'Admin');
return `Total warnings: ${count}`;

// Get warnings
const warnings = await db.getWarnings(event.from.id, event.chat.id);
return warnings;

// Clear warnings
await db.clearWarnings(event.from.id, event.chat.id);
return 'Warnings cleared';
```

### Ban System
```javascript
// Ban user
await db.banUser('123456789', 'Spam', event.from.id);
return 'User banned';

// Check if banned
const banned = await db.isUserBanned('123456789');
return `Is banned: ${banned}`;

// Unban user
await db.unbanUser('123456789');
return 'User unbanned';

// Get all bans
const bans = await db.getAllBans();
return bans;
```

---

## 🎯 Context (ctx) Tests

### Basic ctx Usage
```javascript
// Get chat info
return {
  chatId: ctx.chat.id,
  chatType: ctx.chat.type,
  chatTitle: ctx.chat.title
};

// Get user info
return {
  userId: ctx.from.id,
  firstName: ctx.from.first_name,
  username: ctx.from.username
};
```

### ctx Actions
```javascript
// React to message
await ctx.react('🎉');

// Reply using ctx
await ctx.reply('Hello from ctx!');

// Send typing action
await ctx.sendChatAction('typing');

// Forward message
await ctx.forwardMessage(ctx.chat.id);

// Copy message
await ctx.copyMessage(ctx.chat.id);
```

### ctx Admin Functions
```javascript
// Get chat admins (groups only)
const admins = await ctx.telegram.getChatAdministrators(ctx.chat.id);
return admins.map(a => a.user.first_name);

// Get chat member
const member = await ctx.telegram.getChatMember(ctx.chat.id, event.from.id);
return member.status;

// Kick user (admin only)
await ctx.telegram.banChatMember(ctx.chat.id, userId);
return 'User kicked';
```

---

## 🌐 Global Object Tests

### Access Commands
```javascript
// List all commands
return Array.from(global.ST.commands.keys());

// Get command details
const cmd = global.ST.commands.get('help');
return cmd.config;

// Count commands
return `Total commands: ${global.ST.commands.size}`;
```

### Access Config
```javascript
// View config
return global.config;

// Get specific config
return {
  prefix: global.config.prefix,
  adminUID: global.config.adminUID,
  botName: global.config.botName
};

// Check if user is admin
return global.config.adminUID.includes(String(event.from.id));
```

### Access Events
```javascript
// List all events
return Array.from(global.ST.events.keys());

// Count events
return `Total events: ${global.ST.events.size}`;
```

### Cooldowns
```javascript
// View all cooldowns
return Array.from(global.ST.cooldowns.entries());

// Clear cooldowns
global.ST.cooldowns.clear();
return 'Cooldowns cleared';

// Set custom cooldown
global.ST.cooldowns.set(`${event.from.id}_test`, Date.now());
return 'Cooldown set';
```

---

## 🧪 Advanced Tests

### Async Operations
```javascript
// Wait 3 seconds
await new Promise(r => setTimeout(r, 3000));
return 'Done waiting!';

// Multiple async operations
const user = await db.getUser(event.from.id);
await db.updateUser(event.from.id, { money: user.money + 100 });
const updated = await db.getUser(event.from.id);
return `New balance: ${updated.money}`;
```

### API Calls
```javascript
// Fetch external data
const axios = require('axios');
const response = await axios.get('https://api.github.com/users/github');
return response.data.name;

// Download image
const img = await axios.get('https://picsum.photos/200', { responseType: 'arraybuffer' });
const fs = require('fs');
fs.writeFileSync('./test.jpg', Buffer.from(img.data));
return 'Image downloaded';
```

### File Operations
```javascript
// Read file
const fs = require('fs');
const data = fs.readFileSync('./config.json', 'utf-8');
return JSON.parse(data);

// Write file
fs.writeFileSync('./test.txt', 'Hello from eval!');
return 'File written';

// List files
const files = fs.readdirSync('./scripts/cmds');
return files;
```

### Database Queries
```javascript
// Complex user query
const users = await db.getAllUsers();
const richest = users.sort((a, b) => b.money - a.money)[0];
return `Richest: ${richest.firstName} with ${richest.money}`;

// Active groups
const threads = await db.getAllThreads();
const groups = threads.filter(t => t.type === 'group' || t.type === 'supergroup');
return `Active groups: ${groups.length}`;
```

### Utility Functions
```javascript
// Get time
const { getTime } = require('./utils');
return getTime();

// Format uptime
const { formatUptime } = require('./utils');
return formatUptime(process.uptime());

// Check permissions
const { checkPermission } = require('./utils');
return checkPermission(event.from.id, 2, event.chat.id);
```

---

## ⚠️ Important Notes

1. **Only bot owners** can use the eval command (role: 2)
2. **Be careful** - eval can execute any code
3. **Use await** for async operations
4. **Return values** to see output
5. **No output** if result is `undefined`
6. **Error messages** show only the error, not stack trace

---

## 🎓 Common Patterns

### Send and Track
```javascript
const sent = await message.reply('Click me!', {
  reply_markup: {
    inline_keyboard: [[
      { text: 'Button', callback_data: 'test' }
    ]]
  }
});
global.ST.onCallback.set('test', {
  commandName: 'eval',
  author: event.from.id
});
return 'Button sent';
```

### Bulk User Update
```javascript
const users = await db.getAllUsers();
for (const user of users) {
  await db.updateUser(user.id, { money: user.money + 10 });
}
return `Updated ${users.length} users`;
```

### Test Reactions
```javascript
await ctx.react('🔥');
await new Promise(r => setTimeout(r, 1000));
await ctx.react('❤️');
await new Promise(r => setTimeout(r, 1000));
await ctx.react('👍');
return 'Reactions sent!';
```

---

**Happy Testing! 🚀**
