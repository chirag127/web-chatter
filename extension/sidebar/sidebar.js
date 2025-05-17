import { storage } from '../common/storage.js';

class Sidebar {
  constructor() {
    this.initializeElements();
    this.addEventListeners();
    this.loadTTSSettings();
    this.initializeTabs();
    this.loadSavedAnswers();
  }

  initializeElements() {
    this.chatMessages = document.getElementById('chat-messages');
    this.userInput = document.getElementById('user-input');
    this.sendButton = document.getElementById('send-button');
    this.errorContainer = document.getElementById('error-container');
    this.errorMessage = document.getElementById('error-message');
    this.dismissError = document.getElementById('dismiss-error');
    this.tabButtons = document.querySelectorAll('.tab-button');
    this.tabContents = document.querySelectorAll('.tab-content');
    this.savedAnswersContainer = document.getElementById('saved-answers');
  }

  addEventListeners() {
    this.sendButton.addEventListener('click', () => this.handleSendMessage());
    this.userInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.handleSendMessage();
      }
    });
    this.dismissError.addEventListener('click', () => this.hideError());
    this.tabButtons.forEach(button => {
      button.addEventListener('click', () => this.switchTab(button.dataset.tab));
    });
  }

  async loadTTSSettings() {
    this.ttsSettings = await storage.getTTSSettings();
  }

  initializeTabs() {
    this.switchTab('chat');
  }

  switchTab(tabId) {
    this.tabButtons.forEach(button => {
      button.classList.toggle('active', button.dataset.tab === tabId);
    });
    this.tabContents.forEach(content => {
      content.classList.toggle('hidden', content.id !== `${tabId}-tab`);
    });

    if (tabId === 'saved') {
      this.loadSavedAnswers();
    }
  }

  async loadSavedAnswers() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const savedChats = await storage.getSavedChats(tab.url);

    this.savedAnswersContainer.innerHTML = savedChats.length ?
      savedChats.map(chat => this.createSavedAnswerElement(chat)).join('') :
      '<p class="text-center">No saved answers yet.</p>';
  }

  createSavedAnswerElement(chat) {
    return `
      <div class="saved-item" data-id="${chat.id}">
        <div class="saved-item-header">
          <span class="saved-timestamp">${new Date(chat.timestamp).toLocaleString()}</span>
          <button class="secondary-button delete-saved" onclick="deleteSavedAnswer('${chat.id}')">Delete</button>
        </div>
        <p><strong>Q:</strong> ${chat.question}</p>
        <p><strong>A:</strong> ${chat.answer}</p>
      </div>
    `;
  }

  async handleSendMessage() {
    const message = this.userInput.value.trim();
    if (!message) return;

    try {
      this.userInput.value = '';
      this.addMessage(message, 'user');

      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const pageData = await this.getPageContent(tab.id);

      const apiKey = await storage.get('geminiApiKey');
      if (!apiKey) {
        throw new Error('Please set your Gemini API key in the extension settings.');
      }

      const response = await this.sendToBackend(pageData, message, apiKey);
      this.addMessage(response.ai_response, 'ai', true);

    } catch (error) {
      this.showError(error.message);
    }
  }

  addMessage(text, type, isSaveable = false) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}-message`;
    messageElement.textContent = text;

    if (isSaveable) {
      const actions = document.createElement('div');
      actions.className = 'message-actions';

      const saveButton = document.createElement('button');
      saveButton.className = 'secondary-button';
      saveButton.textContent = 'Save Answer';
      saveButton.onclick = () => this.saveAnswer(text);

      const speakButton = document.createElement('button');
      speakButton.className = 'secondary-button';
      speakButton.textContent = 'Speak';
      speakButton.onclick = () => this.speakText(text);

      actions.appendChild(saveButton);
      actions.appendChild(speakButton);
      messageElement.appendChild(actions);
    }

    this.chatMessages.appendChild(messageElement);
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }

  async getPageContent(tabId) {
    return new Promise((resolve) => {
      chrome.tabs.sendMessage(tabId, { action: 'getPageContent' }, resolve);
    });
  }

  async sendToBackend(pageData, query, apiKey) {
    const response = await fetch('YOUR_BACKEND_URL/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        page_content: pageData.content,
        page_url: pageData.url,
        page_title: pageData.title,
        meta_data: pageData.meta,
        user_query: query,
        api_key: apiKey
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to get response from AI');
    }

    return response.json();
  }

  async saveAnswer(answer) {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const question = this.chatMessages.lastElementChild.previousElementSibling.textContent;

      await storage.saveChat(tab.url, question, answer);
      this.showSuccess('Answer saved successfully!');
    } catch (error) {
      this.showError('Failed to save answer');
    }
  }

  speakText(text) {
    const utterance = new SpeechSynthesisUtterance(text);

    if (this.ttsSettings.voice) {
      const voices = speechSynthesis.getVoices();
      const voice = voices.find(v => v.voiceURI === this.ttsSettings.voice);
      if (voice) utterance.voice = voice;
    }

    utterance.rate = this.ttsSettings.speed;
    speechSynthesis.speak(utterance);
  }

  showError(message) {
    this.errorMessage.textContent = message;
    this.errorContainer.classList.remove('hidden');
  }

  hideError() {
    this.errorContainer.classList.add('hidden');
  }

  showSuccess(message) {
    // Could implement a success toast here
    console.log(message);
  }
}

// Initialize the sidebar when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.sidebar = new Sidebar();
});
