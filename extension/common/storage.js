// Storage utility for managing extension storage
export const storage = {
  // Get a value from storage
  async get(key) {
    const result = await chrome.storage.local.get(key);
    return result[key];
  },

  // Set a value in storage
  async set(key, value) {
    await chrome.storage.local.set({ [key]: value });
  },

  // Remove a value from storage
  async remove(key) {
    await chrome.storage.local.remove(key);
  },

  // Get saved chats for a URL
  async getSavedChats(url) {
    const saved = await this.get('savedChats') || {};
    return saved[url] || [];
  },

  // Save a new chat
  async saveChat(url, question, answer) {
    const saved = await this.get('savedChats') || {};
    const urlChats = saved[url] || [];

    urlChats.push({
      id: Date.now().toString(),
      question,
      answer,
      timestamp: new Date().toISOString()
    });

    saved[url] = urlChats;
    await this.set('savedChats', saved);
  },

  // Delete a saved chat
  async deleteChat(url, chatId) {
    const saved = await this.get('savedChats') || {};
    const urlChats = saved[url] || [];

    saved[url] = urlChats.filter(chat => chat.id !== chatId);
    await this.set('savedChats', saved);
  },

  // Get TTS settings
  async getTTSSettings() {
    return await this.get('ttsSettings') || {
      voice: '',
      speed: 1.0
    };
  },

  // Save TTS settings
  async saveTTSSettings(settings) {
    await this.set('ttsSettings', settings);
  }
};
