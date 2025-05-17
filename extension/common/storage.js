// Storage utilities for Contextual Web Page Chat Assistant

/**
 * Storage utility class for browser.storage operations
 */
class StorageService {
  /**
   * Get one or more items from sync storage
   * 
   * @param {string|string[]} keys - Key(s) to get from storage
   * @returns {Promise<object>} - Object containing the requested keys and values
   */
  static async getSync(keys) {
    return new Promise((resolve) => {
      chrome.storage.sync.get(keys, (result) => {
        resolve(result);
      });
    });
  }
  
  /**
   * Set one or more items in sync storage
   * 
   * @param {object} items - Object with keys and values to store
   * @returns {Promise<void>}
   */
  static async setSync(items) {
    return new Promise((resolve) => {
      chrome.storage.sync.set(items, () => {
        resolve();
      });
    });
  }
  
  /**
   * Remove one or more items from sync storage
   * 
   * @param {string|string[]} keys - Key(s) to remove from storage
   * @returns {Promise<void>}
   */
  static async removeSync(keys) {
    return new Promise((resolve) => {
      chrome.storage.sync.remove(keys, () => {
        resolve();
      });
    });
  }
  
  /**
   * Get one or more items from local storage
   * 
   * @param {string|string[]} keys - Key(s) to get from storage
   * @returns {Promise<object>} - Object containing the requested keys and values
   */
  static async getLocal(keys) {
    return new Promise((resolve) => {
      chrome.storage.local.get(keys, (result) => {
        resolve(result);
      });
    });
  }
  
  /**
   * Set one or more items in local storage
   * 
   * @param {object} items - Object with keys and values to store
   * @returns {Promise<void>}
   */
  static async setLocal(items) {
    return new Promise((resolve) => {
      chrome.storage.local.set(items, () => {
        resolve();
      });
    });
  }
  
  /**
   * Remove one or more items from local storage
   * 
   * @param {string|string[]} keys - Key(s) to remove from storage
   * @returns {Promise<void>}
   */
  static async removeLocal(keys) {
    return new Promise((resolve) => {
      chrome.storage.local.remove(keys, () => {
        resolve();
      });
    });
  }
  
  /**
   * Clear all items from local storage
   * 
   * @returns {Promise<void>}
   */
  static async clearLocal() {
    return new Promise((resolve) => {
      chrome.storage.local.clear(() => {
        resolve();
      });
    });
  }
  
  /**
   * Get the total bytes used in sync storage
   * 
   * @returns {Promise<number>} - Bytes used
   */
  static async getSyncBytesInUse() {
    return new Promise((resolve) => {
      chrome.storage.sync.getBytesInUse(null, (bytesInUse) => {
        resolve(bytesInUse);
      });
    });
  }
  
  /**
   * Get the total bytes used in local storage
   * 
   * @returns {Promise<number>} - Bytes used
   */
  static async getLocalBytesInUse() {
    return new Promise((resolve) => {
      chrome.storage.local.getBytesInUse(null, (bytesInUse) => {
        resolve(bytesInUse);
      });
    });
  }
}

// Export the StorageService class
if (typeof module !== 'undefined') {
  module.exports = StorageService;
}
