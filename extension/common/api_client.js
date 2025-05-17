// API client utilities for Contextual Web Page Chat Assistant

/**
 * API client for communicating with the backend
 */
class ApiClient {
  /**
   * Send a chat request to the backend
   * 
   * @param {object} data - Request data (query and context)
   * @returns {Promise<object>} - Response from the backend
   * @throws {Error} - If there's an error with the request
   */
  static async sendChatRequest(data) {
    try {
      // Get API key and backend URL from storage
      const storage = await chrome.storage.sync.get(['geminiApiKey', 'backendUrl']);
      const apiKey = storage.geminiApiKey;
      const backendUrl = storage.backendUrl || 'https://your-backend-url.run.app'; // Default URL, should be configured by user
      
      if (!apiKey) {
        throw new Error('Gemini API key not found. Please set it in the extension settings.');
      }
      
      // Add API key to request data
      const requestData = {
        ...data,
        apiKey
      };
      
      // Make request to backend
      const response = await fetch(`${backendUrl}/api/v1/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error communicating with backend');
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }
  
  /**
   * Check if the backend is reachable
   * 
   * @param {string} backendUrl - URL of the backend to check
   * @returns {Promise<boolean>} - True if backend is reachable, false otherwise
   */
  static async checkBackendHealth(backendUrl) {
    try {
      const response = await fetch(`${backendUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        return false;
      }
      
      const data = await response.json();
      return data.status === 'ok';
    } catch (error) {
      console.error('Backend health check error:', error);
      return false;
    }
  }
}

// Export the ApiClient class
if (typeof module !== 'undefined') {
  module.exports = ApiClient;
}
