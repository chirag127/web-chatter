/**
 * WebPage Chatter - Storage Service
 * Wrapper for chrome.storage API
 */

const StorageService = {
  /**
   * Get settings from sync storage
   * @param {Array<string>} keys - Keys to retrieve
   * @returns {Promise<Object>} Object containing the requested settings
   */
  getSettings: async function(keys) {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get(keys, (result) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(result);
        }
      });
    });
  },
  
  /**
   * Save settings to sync storage
   * @param {Object} settings - Settings to save
   * @returns {Promise<void>}
   */
  saveSettings: async function(settings) {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.set(settings, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  },
  
  /**
   * Get saved chats from local storage
   * @returns {Promise<Array>} Array of saved chat items
   */
  getSavedChats: async function() {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(['savedChats'], (result) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(result.savedChats || []);
        }
      });
    });
  },
  
  /**
   * Save a chat to local storage
   * @param {Object} chatItem - Chat item to save
   * @returns {Promise<Array>} Updated array of saved chat items
   */
  saveChat: async function(chatItem) {
    try {
      // Get current saved chats
      const savedChats = await this.getSavedChats();
      
      // Add new chat item with unique ID and timestamp
      const newChatItem = {
        ...chatItem,
        id: this.generateUniqueId(),
        timestamp: new Date().toISOString()
      };
      
      // Add to beginning of array (newest first)
      const updatedChats = [newChatItem, ...savedChats];
      
      // Save updated chats
      await new Promise((resolve, reject) => {
        chrome.storage.local.set({ savedChats: updatedChats }, () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve();
          }
        });
      });
      
      return updatedChats;
    } catch (error) {
      console.error('Error saving chat:', error);
      throw error;
    }
  },
  
  /**
   * Delete a chat from local storage
   * @param {string} chatId - ID of the chat to delete
   * @returns {Promise<Array>} Updated array of saved chat items
   */
  deleteChat: async function(chatId) {
    try {
      // Get current saved chats
      const savedChats = await this.getSavedChats();
      
      // Filter out the chat to delete
      const updatedChats = savedChats.filter(chat => chat.id !== chatId);
      
      // Save updated chats
      await new Promise((resolve, reject) => {
        chrome.storage.local.set({ savedChats: updatedChats }, () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve();
          }
        });
      });
      
      return updatedChats;
    } catch (error) {
      console.error('Error deleting chat:', error);
      throw error;
    }
  },
  
  /**
   * Clear all saved chats from local storage
   * @returns {Promise<void>}
   */
  clearAllChats: async function() {
    return new Promise((resolve, reject) => {
      chrome.storage.local.remove(['savedChats'], () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  },
  
  /**
   * Generate a unique ID for chat items
   * @returns {string} Unique ID
   */
  generateUniqueId: function() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }
};

// Export for use in other scripts
if (typeof module !== 'undefined') {
  module.exports = StorageService;
}
