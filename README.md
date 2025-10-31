
<div align="center">

# 🤖 STG_Telegraf

<img src="https://i.ibb.co.com/gMVXVwbM/log.png" alt="STG_Telegraf Logo" width="200" style="border-radius: 50%"/>

### Advanced Telegram Bot Framework Built with Telegraf

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/sheikhtamimlover/STG_Telegraf)
[![Node.js](https://img.shields.io/badge/node.js-18+-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-yellow.svg)](LICENSE)
[![Telegraf](https://img.shields.io/badge/telegraf-4.16.3-blue.svg)](https://telegraf.js.org/)
[![Telegram Group](https://img.shields.io/badge/Telegram-Join%20Group-blue.svg)](https://t.me/STGBOTGC)

[Features](#-features) • [Installation](#-installation) • [Getting Bot Token](#-getting-your-telegram-bot-token) • [Commands](#-available-commands) • [Support](#-support)

</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Getting Your Telegram Bot Token](#-getting-your-telegram-bot-token)
- [Initial Setup](#-initial-setup)
- [Available Commands](#-available-commands)
- [Command Categories](#-command-categories)
- [Creating Custom Commands](#-creating-custom-commands)
- [Database System](#-database-system)
- [Update System](#-update-system)
- [Hosting on Replit](#-hosting-on-replit)
- [Support](#-support)

## ✨ Features

### 🎯 Core Features
- **Modular Command System** - Easy-to-use command handler with aliases and cooldowns
- **Event Handling** - Support for group events (welcome, leave, reactions, etc.)
- **Dual Database Support** - JSON (default) and MongoDB options
- **Role-Based Permissions** - Three-tier system (User, Admin, Owner)
- **Auto-Update System** - Built-in update checker with 5-minute safety wait
- **Auto-Restore** - Automatic backup creation and rollback on failed updates

### 🎮 User Features
- **Level System** - Earn EXP and level up through messaging
- **Economy System** - Money, daily rewards, and slot machine game
- **User Statistics** - Track messages, levels, and activity
- **Interactive Commands** - Buttons, callbacks, and reactions
- **Rich Formatting** - HTML/Markdown support with utilities

### 🛡️ Admin Features
- **Group Management** - Kick, ban, warn users
- **Anti-Out Protection** - Prevent users from leaving groups
- **Group Lock** - Prevent non-admins from messaging
- **Approval System** - Control group and DM access
- **Custom Prefix** - Per-group command prefixes

### 🔧 Developer Features
- **Hot-Reload Commands** - Load/unload commands without restart
- **Install from URL** - Install commands from raw GitHub/Pastebin URLs
- **Eval Command** - Execute JavaScript for debugging
- **Shell Command** - Run system commands
- **Comprehensive Logging** - Color-coded logs with timestamps

## 🚀 Installation

### Option 1: Quick Setup (Recommended)

```bash
git clone https://github.com/sheikhtamimlover/STG_Telegraf.git
cd STG_Telegraf
npm install
npm start
```

### Option 2: One-Line Install

```bash
git clone https://github.com/sheikhtamimlover/STG_Telegraf.git && cd STG_Telegraf && npm install && npm start
```

## 🔑 Getting Your Telegram Bot Token

Follow these steps to create a bot and get your token:

### Step 1: Open BotFather
1. Open Telegram app
2. Search for [@BotFather](https://t.me/BotFather)
3. Start a chat with BotFather

### Step 2: Create New Bot
1. Send `/newbot` command to BotFather
2. BotFather will ask for a name for your bot
   - Example: `My Awesome Bot`
3. Then choose a username (must end in 'bot')
   - Example: `my_awesome_bot` or `MyAwesomeBot`

### Step 3: Get Your Token
1. BotFather will send you a message with your bot token
2. It looks like: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`
3. **Keep this token secret!** Don't share it with anyone

### Step 4: Configure Your Bot (Optional)
- `/setdescription` - Set bot description
- `/setabouttext` - Set about text
- `/setuserpic` - Set profile picture
- `/setcommands` - Set command list (auto-configured by bot)

### Step 5: Add Token to Config
1. Open `config.json` in your project
2. Find the `"token"` field
3. Paste your token there:
```json
{
  "token": "1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
}
```

**Or** simply run `npm start` and the bot will prompt you to enter the token!

## ⚙️ Initial Setup

### 1. Configure config.json

Edit `config.json` with your preferences:

```json
{
  "prefix": "/",
  "usePrefix": true,
  "adminUID": ["YOUR_USER_ID"],
  "timezone": "Asia/Dhaka",
  "botName": "My Bot",
  "token": "YOUR_BOT_TOKEN",
  
  "database": {
    "type": "json"
  },
  
  "levelSystem": {
    "enabled": true,
    "expPerMessage": 5,
    "expToLevelUp": 100
  }
}
```

### 2. Get Your User ID

1. Start your bot (it will run even without admin ID)
2. Send `/uid` command to the bot
3. Copy your user ID from the response
4. Add it to `adminUID` in `config.json`:
   ```json
   "adminUID": ["1234567890"]
   ```
5. Restart the bot

### 3. Test Your Bot

Send these commands to verify everything works:
- `/ping` - Check bot response
- `/help` - View all commands
- `/userinfo` - View your profile

## 📚 Available Commands

### 🎯 General Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `/help` | List all commands | `/help` or `/help <command>` |
| `/ping` | Check bot status | `/ping` |
| `/uid` | Get your user ID | `/uid` or reply to user |
| `/tid` | Get thread/group ID | `/tid` |
| `/userinfo` | View user profile | `/userinfo [@user]` |
| `/rank` | View your level | `/rank` |
| `/balance` | Check your money | `/balance` |
| `/daily` | Claim daily reward | `/daily` |

### 💰 Economy Commands

| Command | Description | Reward |
|---------|-------------|--------|
| `/daily` | Daily reward (24h cooldown) | 500 coins |
| `/spain` | Slot machine game | Win up to 1000 coins |
| `/balance` | Check your balance | - |

### 👥 Group Commands

| Command | Description | Permission |
|---------|-------------|------------|
| `/kick` | Kick a user | Admin |
| `/ban` | Ban a user | Admin |
| `/warn` | Warn a user | Admin |
| `/antiout` | Toggle anti-leave | Admin |
| `/gclock` | Lock group | Admin |
| `/callad` | Notify all admins | User |
| `/tag` | Tag all members | Admin |

### 🎨 Fun Commands

| Command | Description |
|---------|-------------|
| `/beb` | AI chat with image support |
| `/flux` | Generate AI images |
| `/mj` | Midjourney-style images with interactive buttons |
| `/niji` | Niji Journey anime-style images |
| `/sing` | Download YouTube audio |
| `/tictactoe` | Play tic-tac-toe |

### 🎨 Midjourney Command Showcase

The `/mj` command generates stunning AI images with interactive controls:

**Image Generation with Interactive Buttons:**
<img src="https://i.ibb.co.com/ZR51ZhP2/IMG-7529.jpg" alt="Midjourney Generation Example 1" width="600"/>

**Advanced Control Options:**
<img src="https://i.ibb.co.com/Dgp9BV7Z/IMG-7530.jpg" alt="Midjourney Generation Example 2" width="600"/>

Features:
- Generate images from text prompts
- Use image references (reply to image with prompt)
- Interactive buttons for variations (V1-V4)
- Upscale options (U1-U4)
- Regenerate and pan controls
- Progress tracking
- WebP format for optimal file size

### 🔧 Admin Commands (Bot Admins)

| Command | Description |
|---------|-------------|
| `/admin add <uid>` | Add bot admin |
| `/admin remove <uid>` | Remove admin |
| `/admin list` | List all admins |
| `/groupapproval` | Toggle group approval |
| `/dmapproval` | Toggle DM approval |

### 👑 Owner Commands (Bot Owners Only)

| Command | Description |
|---------|-------------|
| `/restart` | Restart the bot |
| `/update` | Check and install updates |
| `/eval <code>` | Execute JavaScript |
| `/shell <command>` | Run shell commands |
| `/cmd load/unload <name>` | Manage commands |
| `/cmd install <file> <url>` | Install from URL |
| `/events load/unload <name>` | Manage events |

## 📂 Command Categories

### Information Commands
- `help`, `ping`, `uid`, `tid`, `userinfo`, `gcinfo`, `userdb`, `threaddb`

### Economy & Games
- `balance`, `daily`, `spain`, `tictactoe`, `rank`

### Group Management
- `kick`, `ban`, `warn`, `antiout`, `gclock`, `adduser`, `leave`

### AI & Media
- `beb` (AI chat), `flux` (AI images), `mj` (Midjourney), `sing` (music)

### Admin Tools
- `admin`, `groupapproval`, `dmapproval`, `prefix`, `count`, `noti`

### Developer Tools
- `restart`, `update`, `eval`, `shell`, `cmd`, `events`, `streport`

## 🔨 Creating Custom Commands

Create a new file in `scripts/cmds/` directory:

```javascript
module.exports = {
  config: {
    name: "hello",
    aliases: ["hi", "hey"],
    author: "Your Name",
    version: "1.0",
    cooldown: 5,
    role: 0, // 0=Everyone, 1=Admin, 2=Owner
    description: "Say hello",
    category: "fun",
    usePrefix: true
  },

  ST: async function ({ event, api, args, message, userId }) {
    await message.reply(`Hello ${event.from.first_name}! 👋`);
  }
};
```

### Command Features

Commands support these optional handlers:

- `ST` - Main command handler
- `onChat` - Trigger on any message
- `onReply` - Handle user replies
- `onCallback` - Handle button clicks
- `onReaction` - Handle reactions
- `onLoad` - Initialize on bot start

### Message Utilities

```javascript
// Reply to user
await message.reply("Hello!");

// Send message
await message.send("Text", chatId);

// Delete message
await message.unsend(messageId);

// React to message
await message.react("❤️");

// Send photo/video
await message.sendAttachment({
  body: "Caption",
  attachment: "/path/to/file.jpg"
});
```

## 💾 Database System

### JSON Database (Default)
- Lightweight, no setup required
- Stored in `database/data/`
- Perfect for small to medium bots

### MongoDB Database
1. Set `"type": "mongodb"` in config.json
2. Add MongoDB URI:
```json
{
  "database": {
    "type": "mongodb",
    "uriMongodb": "mongodb+srv://user:pass@cluster.mongodb.net/db"
  }
}
```
3. Restart bot

### Database API

```javascript
// Get user data
const user = await global.db.getUser(userId);

// Update user
await global.db.updateUser(userId, { money: 1000 });

// Get all users
const users = await global.db.getAllUsers();

// Thread operations
const thread = await global.db.getThread(chatId);
await global.db.updateThread(chatId, { locked: true });
```

## 🔄 Update System

### Features
- **5-Minute Safety Wait** - Prevents updating too quickly after release
- **Auto-Backup** - Creates backup before each update
- **Auto-Restore** - Rolls back on failure
- **Version Tracking** - Shows all missed updates
- **Change Logs** - Displays what's new
- **Visual Notifications** - Update notifications with images in DM

### Update Notification Example

When a new update is available, you'll receive a notification like this:

<img src="https://i.ibb.co.com/tPXf8Znn/IMG-7491.jpg" alt="Update Notification" width="600"/>

### How to Update

#### Method 1: Using Command (Recommended)
```
/update
```

<img src="https://i.ibb.co.com/HLBHbC5G/IMG-7471.jpg" alt="Basic Update Function" width="600"/>

The bot will:
1. Check for updates
2. Show what's new with images
3. Ask for confirmation
4. Create backup
5. Install updates
6. Restart automatically

#### Update Usage Examples

**Checking for updates:**
<img src="https://i.ibb.co.com/3yYFJ5zN/IMG-7490.jpg" alt="Update Check Example 1" width="400"/>

**Update confirmation:**
<img src="https://i.ibb.co.com/mF8N9mHV/IMG-7470.jpg" alt="Update Check Example 2" width="400"/>

**Update process:**
<img src="https://i.ibb.co.com/60ydDS9S/IMG-7468.jpg" alt="Update Process Example 1" width="400"/>

<img src="https://i.ibb.co.com/CsXq3K1t/IMG-7469.jpg" alt="Update Process Example 2" width="400"/>

#### Method 2: Manual Update
```bash
node update.js
```

### Update Safety

The bot includes these safety features:

1. **5-Minute Wait Period**
   - New updates must wait 5 minutes before installation
   - Ensures update stability
   - Shows countdown timer

2. **Automatic Backup**
   - Backup created before each update
   - Stored in `backups/backup_<version>/`
   - Includes all files and version info

3. **Auto-Restore on Failure**
   - Detects update failures on next start
   - Automatically restores from backup
   - Logs restoration process

4. **Manual Restore**
   ```bash
   node restoreBackup.js
   ```
   Or specify version:
   ```bash
   node restoreBackup.js 1.2.0
   ```

## 📦 Installing Commands from URL

Install commands directly from GitHub or any URL:

### Examples

1. **From GitHub Raw URL**
```
/cmd install mycommand.js https://raw.githubusercontent.com/user/repo/main/command.js
```

2. **From Pastebin**
```
/cmd install fun.js https://pastebin.com/raw/abc123
```

3. **From Reply**
Reply to a message containing code:
```
/cmd install newcmd.js
```

### Installing Events
Same syntax works for events:
```
/events install welcome.js https://raw.githubusercontent.com/user/repo/main/event.js
```

## 🌐 Hosting on Replit

### Quick Start on Replit

1. **Import Repository**
   - Go to [Replit](https://replit.com)
   - Click "Create Repl"
   - Choose "Import from GitHub"
   - Enter: `https://github.com/sheikhtamimlover/STG_Telegraf`

2. **Configure Bot**
   - Open `config.json`
   - Add your bot token
   - Click "Run"

3. **Keep Bot Online**
   - Enable "Always On" in Replit (requires Core plan)
   - Or use the built-in uptime system:
   ```json
   {
     "serverUptime": {
       "enabled": true,
       "port": 5000
     }
   }
   ```

### Environment Variables (Optional)

Instead of `config.json`, you can use Replit Secrets:
- `BOT_TOKEN` - Your bot token
- `ADMIN_UID` - Your user ID
- `MONGODB_URI` - MongoDB connection (if using MongoDB)

## 🤝 Support

### Get Help

- **Telegram Group**: [STG BOT GC](https://t.me/STGBOTGC)
- **GitHub Issues**: [Report Issues](https://github.com/sheikhtamimlover/STG_Telegraf/issues)
- **Documentation**: This README and inline code comments

### Contact Developer

- **GitHub**: [@sheikhtamimlover](https://github.com/sheikhtamimlover)
- **Instagram**: [@sheikh.tamim_lover](https://instagram.com/sheikh.tamim_lover)

### Common Issues

**Bot doesn't respond?**
- Check if token is correct in `config.json`
- Verify bot is running (check console)
- Make sure you're using correct prefix

**Commands not working?**
- Check if command is loaded: `/help`
- Verify your role/permissions
- Check console for errors

**Update failed?**
- Bot will auto-restore from backup
- Or manually: `node restoreBackup.js`
- Check GitHub for known issues

## 📜 License

This project is licensed under the MIT License.

```
MIT License

Copyright (c) 2024 Sheikh Tamim

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 🙏 Acknowledgments

- Telegram Bot API for excellent documentation
- Telegraf.js for the amazing framework
- The Node.js community for incredible tools
- All contributors and users

---

<div align="center">

**Made with ❤️ by [Sheikh Tamim](https://github.com/sheikhtamimlover)**

⭐ Star this repository if you find it helpful!

</div>
