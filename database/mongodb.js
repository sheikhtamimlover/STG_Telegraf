const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  firstName: String,
  lastName: String,
  username: String,
  pfpUrl: String,
  location: String,
  exp: { type: Number, default: 0 },
  money: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  lastDailyClaim: { type: String, default: '' },
  banned: { type: Boolean, default: false },
  dmApproved: { type: Boolean, default: false },
  warnings: { type: Object, default: {} },
  messageCount: { type: Object, default: {} },
  createdAt: { type: Number, default: Date.now }
});

const threadSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: String,
  type: String, // 'private', 'group', 'supergroup', 'channel'
  totalUsers: { type: Number, default: 0 },
  customPrefix: { type: String, default: '' },
  approved: { type: Boolean, default: false },
  antiOut: { type: Boolean, default: false },
  approvalMode: { type: Boolean, default: false },
  autoApprove: { type: Boolean, default: false },
  lockedName: { type: Boolean, default: false },
  lockedPhoto: { type: Boolean, default: false },
  lockedDescription: { type: Boolean, default: false },
  savedName: { type: String, default: '' },
  savedPhoto: { type: String, default: '' },
  savedDescription: { type: String, default: '' },
  totalMessages: { type: Number, default: 0 },
  userMessages: { type: Object, default: {} },
  isPrivate: { type: Boolean, default: false },
  isGroup: { type: Boolean, default: false },
  isSupergroup: { type: Boolean, default: false },
  isChannel: { type: Boolean, default: false },
  description: { type: String, default: '' },
  username: { type: String, default: '' },
  inviteLink: { type: String, default: '' },
  photoUrl: { type: String, default: '' },
  pinnedMessageId: { type: Number, default: null },
  permissions: { type: Object, default: {} },
  lastActivity: { type: Number, default: Date.now },
  createdAt: { type: Number, default: Date.now }
});

const approvalSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  chatId: String,
  chatName: String,
  userId: String,
  userName: String,
  addedBy: String,
  addedByName: String,
  createdAt: { type: Number, default: Date.now }
});

const banSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  reason: String,
  bannedBy: String,
  bannedAt: { type: Number, default: Date.now }
});

class MongoDatabase {
  constructor() {
    this.User = null;
    this.Thread = null;
    this.Approval = null;
    this.Ban = null;
    this.connected = false;
  }

  async connect(uri) {
    try {
      await mongoose.connect(uri);
      this.User = mongoose.model('User', userSchema);
      this.Thread = mongoose.model('Thread', threadSchema);
      this.Approval = mongoose.model('Approval', approvalSchema);
      this.Ban = mongoose.model('Ban', banSchema);
      this.connected = true;
      return true;
    } catch (error) {
      console.error('MongoDB connection error:', error);
      return false;
    }
  }

  async getUser(userId) {
    userId = String(userId);
    let user = await this.User.findOne({ id: userId });
    if (!user) {
      user = await this.User.create({
        id: userId,
        firstName: '',
        lastName: '',
        username: '',
        pfpUrl: '',
        location: '',
        exp: 0,
        money: 0,
        level: 1,
        lastDailyClaim: '',
        banned: false,
        dmApproved: false,
        warnings: {},
        createdAt: Date.now()
      });
    }
    return user.toObject();
  }

  async updateUser(userId, data) {
    userId = String(userId);
    const user = await this.User.findOneAndUpdate(
      { id: userId },
      { $set: data },
      { new: true, upsert: true }
    );
    return user.toObject();
  }

  async getThread(threadId) {
    threadId = String(threadId);
    let thread = await this.Thread.findOne({ id: threadId });
    if (!thread) {
      thread = await this.Thread.create({
        id: threadId,
        threadID: threadId,
        name: '',
        type: '',
        totalUsers: 0,
        customPrefix: '',
        approved: false,
        antiOut: false,
        createdAt: Date.now()
      });
    }
    return thread.toObject();
  }

  async updateThread(threadId, data) {
    threadId = String(threadId);
    const thread = await this.Thread.findOneAndUpdate(
      { id: threadId },
      { $set: data },
      { new: true, upsert: true }
    );
    return thread.toObject();
  }

  async incrementUserExp(userId, amount = 5) {
    userId = String(userId);
    const user = await this.getUser(userId);
    user.exp += amount;

    const expNeeded = user.level * 100;
    if (user.exp >= expNeeded) {
      user.level++;
      user.exp = user.exp - expNeeded;
    }

    return await this.updateUser(userId, { exp: user.exp, level: user.level });
  }

  async getAllUsers() {
    const users = await this.User.find({});
    return users.map(u => u.toObject());
  }

  async getAllThreads() {
    const threads = await this.Thread.find({});
    return threads.map(t => t.toObject());
  }

  async addApproval(type, data) {
    const id = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const approval = await this.Approval.create({
      id,
      type,
      ...data,
      createdAt: Date.now()
    });
    return id;
  }

  async getApproval(id) {
    const approval = await this.Approval.findOne({ id });
    return approval ? approval.toObject() : null;
  }

  async removeApproval(id) {
    await this.Approval.deleteOne({ id });
  }

  async getAllApprovals(type = null) {
    const query = type ? { type } : {};
    const approvals = await this.Approval.find(query);
    return approvals.map(a => a.toObject());
  }

  async banUser(userId, reason = '', bannedBy = '') {
    userId = String(userId);
    await this.Ban.findOneAndUpdate(
      { userId },
      { userId, reason, bannedBy, bannedAt: Date.now() },
      { upsert: true }
    );
    await this.updateUser(userId, { banned: true });
  }

  async unbanUser(userId) {
    userId = String(userId);
    await this.Ban.deleteOne({ userId });
    await this.updateUser(userId, { banned: false });
  }

  async isUserBanned(userId) {
    userId = String(userId);
    const ban = await this.Ban.findOne({ userId });
    return !!ban;
  }

  async getAllBans() {
    const bans = await this.Ban.find({});
    return bans.map(b => b.toObject());
  }

  async addWarning(userId, chatId, reason = '', warnedBy = '') {
    userId = String(userId);
    chatId = String(chatId);
    const user = await this.getUser(userId);
    
    // Ensure warnings object exists
    if (!user.warnings || typeof user.warnings !== 'object') {
      user.warnings = {};
    }
    
    if (!user.warnings[chatId]) {
      user.warnings[chatId] = [];
    }
    
    user.warnings[chatId].push({
      reason,
      warnedBy,
      warnedAt: Date.now()
    });
    
    await this.updateUser(userId, { warnings: user.warnings });
    return user.warnings[chatId].length;
  }

  async getWarnings(userId, chatId) {
    userId = String(userId);
    chatId = String(chatId);
    const user = await this.getUser(userId);
    if (!user.warnings || typeof user.warnings !== 'object') {
      return [];
    }
    return user.warnings[chatId] || [];
  }

  async clearWarnings(userId, chatId) {
    userId = String(userId);
    chatId = String(chatId);
    const user = await this.getUser(userId);
    if (user.warnings && typeof user.warnings === 'object' && user.warnings[chatId]) {
      delete user.warnings[chatId];
      await this.updateUser(userId, { warnings: user.warnings });
    }
  }

  async incrementMessageCount(userId, threadId) {
    userId = String(userId);
    threadId = String(threadId);
    
   
    
    // Ensure user exists first with proper initialization
    await this.getUser(userId);
    
    // Use atomic increment for user message count
    const updateKey = `messageCount.${threadId}`;
    const userUpdate = await this.User.findOneAndUpdate(
      { id: userId },
      { 
        $inc: { [updateKey]: 1 }
      },
      { new: true, upsert: false }
    );
    

    
    // Ensure thread exists first with proper initialization
    await this.getThread(threadId);
    
    // Use atomic increment for thread message count
    const threadUpdate = await this.Thread.findOneAndUpdate(
      { id: threadId },
      { 
        $inc: { 
          totalMessages: 1,
          [`userMessages.${userId}`]: 1
        }
      },
      { new: true, upsert: false }
    );
    
   
    
    // Extract counts with proper initialization
    const userCount = userUpdate?.messageCount?.[threadId] || 1;
    const threadTotal = threadUpdate?.totalMessages || 1;
    
  
    
    return {
      userCount: userCount,
      threadTotal: threadTotal
    };
  }

  async getUserMessageCount(userId, threadId) {
    userId = String(userId);
    threadId = String(threadId);
    const user = await this.getUser(userId);
    return user.messageCount?.[threadId] || 0;
  }

  async getThreadMessageStats(threadId) {
    threadId = String(threadId);
    const thread = await this.getThread(threadId);
    return {
      totalMessages: thread.totalMessages || 0,
      userMessages: thread.userMessages || {}
    };
  }
}

module.exports = MongoDatabase;