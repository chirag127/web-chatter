// Common utilities for Web Chatter extension

/**
 * Text-to-speech utilities
 */
const ttsUtils = {
  // Initialize TTS with saved settings
  async initialize() {
    const settings = await chrome.storage.sync.get(['ttsVoice', 'ttsSpeed']);
    this.selectedVoice = settings.ttsVoice || '';
    this.speed = settings.ttsSpeed ? parseFloat(settings.ttsSpeed) : 1.0;
    return settings;
  },

  // Get available voices
  getVoices() {
    return speechSynthesis.getVoices();
  },

  // Speak text with selected voice and speed
  speak(text) {
    // Cancel any current speech
    this.cancel();

    // Create utterance
    const utterance = new SpeechSynthesisUtterance(text);

    // Set voice if selected
    if (this.selectedVoice) {
      const voices = this.getVoices();
      const voice = voices.find(v => v.name === this.selectedVoice);
      if (voice) {
        utterance.voice = voice;
      }
    }

    // Set speed
    utterance.rate = this.speed;

    // Speak
    speechSynthesis.speak(utterance);

    return utterance;
  },

  // Cancel current speech
  cancel() {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
  }
};

/**
 * Storage utilities
 */
const storageUtils = {
  // Save chat to history
  async saveChatToHistory(chatData) {
    try {
      // Get existing history
      const result = await chrome.storage.local.get(['chatHistory']);
      const history = result.chatHistory || [];

      // Add new chat to history
      history.unshift(chatData);

      // Limit history size (keep last 50 chats)
      const limitedHistory = history.slice(0, 50);

      // Save updated history
      await chrome.storage.local.set({ chatHistory: limitedHistory });

      return limitedHistory;
    } catch (error) {
      console.error('Error saving chat to history:', error);
      throw error;
    }
  },

  // Get chat history
  async getChatHistory() {
    try {
      const result = await chrome.storage.local.get(['chatHistory']);
      return result.chatHistory || [];
    } catch (error) {
      console.error('Error getting chat history:', error);
      throw error;
    }
  },

  // Clear chat history
  async clearChatHistory() {
    try {
      await chrome.storage.local.set({ chatHistory: [] });
      return [];
    } catch (error) {
      console.error('Error clearing chat history:', error);
      throw error;
    }
  }
};

// Export utilities
export { ttsUtils, storageUtils };