// Sidebar script for Contextual Web Page Chat Assistant

// DOM Elements
const chatTab = document.getElementById('chat-tab');
const historyTab = document.getElementById('history-tab');
const chatContent = document.getElementById('chat-content');
const historyContent = document.getElementById('history-content');
const messagesContainer = document.getElementById('messages-container');
const historyItemsContainer = document.getElementById('history-items-container');
const noHistory = document.getElementById('no-history');
const queryInput = document.getElementById('query-input');
const sendBtn = document.getElementById('send-btn');
const closeBtn = document.getElementById('close-btn');
const settingsBtn = document.getElementById('settings-btn');
const apiKeyMissing = document.getElementById('api-key-missing');
const openSettings = document.getElementById('open-settings');
const loadingIndicator = document.getElementById('loading-indicator');
const clearHistoryBtn = document.getElementById('clear-history-btn');

// State
let pageContext = null;
let currentTab = 'chat';
let ttsVoice = null;
let ttsRate = 1.0;
let isSpeaking = false;

// Initialize
document.addEventListener('DOMContentLoaded', initialize);

function initialize() {
  // Set up event listeners
  chatTab.addEventListener('click', () => switchTab('chat'));
  historyTab.addEventListener('click', () => switchTab('history'));
  sendBtn.addEventListener('click', handleSendQuery);
  queryInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') handleSendQuery();
  });
  closeBtn.addEventListener('click', closeSidebar);
  settingsBtn.addEventListener('click', openSettingsPage);
  openSettings.addEventListener('click', openSettingsPage);
  clearHistoryBtn.addEventListener('click', clearAllHistory);
  
  // Listen for messages from content script
  window.addEventListener('message', handleMessages);
  
  // Check if API key is set
  checkApiKey();
  
  // Load TTS settings
  loadTtsSettings();
  
  // Load chat history
  loadChatHistory();
}

// Function to switch between tabs
function switchTab(tab) {
  currentTab = tab;
  
  if (tab === 'chat') {
    chatTab.classList.add('bg-blue-600');
    historyTab.classList.remove('bg-blue-600');
    chatContent.classList.remove('hidden');
    historyContent.classList.add('hidden');
  } else {
    chatTab.classList.remove('bg-blue-600');
    historyTab.classList.add('bg-blue-600');
    chatContent.classList.add('hidden');
    historyContent.classList.remove('hidden');
    
    // Refresh history when switching to history tab
    loadChatHistory();
  }
}

// Function to handle messages from content script
function handleMessages(event) {
  const message = event.data;
  
  if (message.action === 'page-content') {
    pageContext = message.data;
    console.log('Received page context:', pageContext);
  } else if (message.action === 'api-response') {
    handleApiResponse(message.data);
  }
}

// Function to check if API key is set
function checkApiKey() {
  chrome.storage.sync.get(['geminiApiKey'], result => {
    if (!result.geminiApiKey) {
      apiKeyMissing.classList.remove('hidden');
      queryInput.disabled = true;
      sendBtn.disabled = true;
    } else {
      apiKeyMissing.classList.add('hidden');
      queryInput.disabled = false;
      sendBtn.disabled = false;
    }
  });
}

// Function to handle sending a query
function handleSendQuery() {
  const query = queryInput.value.trim();
  
  if (!query || !pageContext) return;
  
  // Show loading indicator
  loadingIndicator.classList.remove('hidden');
  
  // Add user message to UI
  addMessage(query, 'user');
  
  // Clear input
  queryInput.value = '';
  
  // Send request to background script
  window.parent.postMessage({
    action: 'api-request',
    data: {
      query,
      context: pageContext
    }
  }, '*');
}

// Function to handle API response
function handleApiResponse(response) {
  // Hide loading indicator
  loadingIndicator.classList.add('hidden');
  
  if (response.error) {
    // Show error message
    addMessage(`Error: ${response.error}`, 'error');
    return;
  }
  
  // Add AI response to UI
  addMessage(response.answer, 'ai');
  
  // Save to history
  saveToHistory(queryInput.value, response.answer);
}

// Function to add a message to the chat UI
function addMessage(text, type) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', 'fade-in');
  
  if (type === 'user') {
    messageDiv.classList.add('user-message');
    messageDiv.textContent = text;
  } else if (type === 'ai') {
    messageDiv.classList.add('ai-message');
    
    // Create message content with markdown support
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('markdown-content');
    contentDiv.innerHTML = markdownToHtml(text);
    
    // Create TTS button
    const ttsButton = document.createElement('button');
    ttsButton.classList.add('tts-button');
    ttsButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z"/><path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z"/><path d="M8.707 11.182A4.486 4.486 0 0 0 10.025 8a4.486 4.486 0 0 0-1.318-3.182L8 5.525A3.489 3.489 0 0 1 9.025 8 3.49 3.49 0 0 1 8 10.475l.707.707zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z"/></svg>';
    ttsButton.title = 'Read aloud';
    ttsButton.addEventListener('click', () => {
      if (isSpeaking) {
        stopSpeech();
      } else {
        speakText(text);
      }
    });
    
    // Add content and button to message
    messageDiv.appendChild(contentDiv);
    messageDiv.appendChild(ttsButton);
  } else if (type === 'error') {
    messageDiv.classList.add('bg-red-100', 'text-red-800', 'border', 'border-red-200');
    messageDiv.textContent = text;
  }
  
  // Add timestamp
  const timeDiv = document.createElement('div');
  timeDiv.classList.add('message-time');
  timeDiv.textContent = new Date().toLocaleTimeString();
  messageDiv.appendChild(timeDiv);
  
  // Add to container and scroll to bottom
  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Function to convert markdown to HTML (simple implementation)
function markdownToHtml(markdown) {
  // This is a very basic implementation - in a real extension, consider using a library like marked.js
  let html = markdown
    // Headers
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Code blocks
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Lists
    .replace(/^\s*\d+\.\s+(.*$)/gm, '<ol><li>$1</li></ol>')
    .replace(/^\s*[\-\*]\s+(.*$)/gm, '<ul><li>$1</li></ul>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    // Paragraphs
    .replace(/^\s*(\n)?(.+)/gm, function(m) {
      return /\<(\/)?(h\d|ul|ol|li|blockquote|pre|img)/.test(m) ? m : '<p>'+m+'</p>';
    })
    // Fix duplicate tags
    .replace(/<\/ul>\s*<ul>/g, '')
    .replace(/<\/ol>\s*<ol>/g, '')
    .replace(/<\/p>\s*<p>/g, '<br>');
    
  return html;
}

// Function to save chat to history
function saveToHistory(query, answer) {
  const historyItem = {
    timestamp: Date.now(),
    url: pageContext.url,
    title: pageContext.title,
    query,
    answer
  };
  
  chrome.storage.local.get(['chatHistory'], result => {
    const history = result.chatHistory || [];
    history.unshift(historyItem); // Add to beginning of array
    
    // Limit history to 50 items
    if (history.length > 50) {
      history.pop();
    }
    
    chrome.storage.local.set({ chatHistory: history });
  });
}

// Function to load chat history
function loadChatHistory() {
  chrome.storage.local.get(['chatHistory'], result => {
    const history = result.chatHistory || [];
    
    // Clear container
    historyItemsContainer.innerHTML = '';
    
    if (history.length === 0) {
      noHistory.style.display = 'block';
      return;
    }
    
    noHistory.style.display = 'none';
    
    // Add history items
    history.forEach(item => {
      const historyItem = createHistoryItem(item);
      historyItemsContainer.appendChild(historyItem);
    });
  });
}

// Function to create a history item element
function createHistoryItem(item) {
  const div = document.createElement('div');
  div.classList.add('history-item');
  
  const header = document.createElement('div');
  header.classList.add('history-item-header');
  
  const date = new Date(item.timestamp);
  const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  
  header.innerHTML = `
    <span>${dateStr}</span>
    <button class="delete-history-item text-red-500 hover:text-red-700">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
      </svg>
    </button>
  `;
  
  const title = document.createElement('div');
  title.classList.add('history-item-title');
  title.textContent = item.title;
  
  const url = document.createElement('div');
  url.classList.add('history-item-url');
  url.textContent = item.url;
  
  const content = document.createElement('div');
  content.classList.add('history-item-content');
  content.innerHTML = `
    <div class="font-medium">Q: ${item.query}</div>
    <div class="mt-2">A: ${item.answer.substring(0, 150)}${item.answer.length > 150 ? '...' : ''}</div>
  `;
  
  div.appendChild(header);
  div.appendChild(title);
  div.appendChild(url);
  div.appendChild(content);
  
  // Add event listener for delete button
  div.querySelector('.delete-history-item').addEventListener('click', e => {
    e.stopPropagation();
    deleteHistoryItem(item.timestamp);
  });
  
  // Add event listener to view full conversation
  div.addEventListener('click', () => {
    switchTab('chat');
    messagesContainer.innerHTML = '';
    addMessage(item.query, 'user');
    addMessage(item.answer, 'ai');
  });
  
  return div;
}

// Function to delete a history item
function deleteHistoryItem(timestamp) {
  chrome.storage.local.get(['chatHistory'], result => {
    const history = result.chatHistory || [];
    const newHistory = history.filter(item => item.timestamp !== timestamp);
    
    chrome.storage.local.set({ chatHistory: newHistory }, () => {
      loadChatHistory();
    });
  });
}

// Function to clear all history
function clearAllHistory() {
  if (confirm('Are you sure you want to clear all chat history?')) {
    chrome.storage.local.set({ chatHistory: [] }, () => {
      loadChatHistory();
    });
  }
}

// Function to close the sidebar
function closeSidebar() {
  window.parent.postMessage({ action: 'close-sidebar' }, '*');
}

// Function to open the settings page
function openSettingsPage() {
  chrome.runtime.sendMessage({ action: 'open-settings' });
}

// Function to load TTS settings
function loadTtsSettings() {
  chrome.storage.sync.get(['ttsVoice', 'ttsRate'], result => {
    if (result.ttsVoice) {
      ttsVoice = result.ttsVoice;
    }
    
    if (result.ttsRate) {
      ttsRate = parseFloat(result.ttsRate);
    }
  });
}

// Function to speak text using TTS
function speakText(text) {
  if ('speechSynthesis' in window) {
    // Cancel any ongoing speech
    stopSpeech();
    
    // Create utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice if specified
    if (ttsVoice) {
      const voices = speechSynthesis.getVoices();
      const voice = voices.find(v => v.name === ttsVoice);
      if (voice) {
        utterance.voice = voice;
      }
    }
    
    // Set rate
    utterance.rate = ttsRate;
    
    // Set event handlers
    utterance.onstart = () => {
      isSpeaking = true;
      updateTtsButtons();
    };
    
    utterance.onend = () => {
      isSpeaking = false;
      updateTtsButtons();
    };
    
    utterance.onerror = () => {
      isSpeaking = false;
      updateTtsButtons();
    };
    
    // Speak
    speechSynthesis.speak(utterance);
  }
}

// Function to stop speech
function stopSpeech() {
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
    isSpeaking = false;
    updateTtsButtons();
  }
}

// Function to update TTS buttons
function updateTtsButtons() {
  const buttons = document.querySelectorAll('.tts-button');
  
  buttons.forEach(button => {
    if (isSpeaking) {
      button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/></svg>';
      button.title = 'Stop reading';
    } else {
      button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z"/><path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z"/><path d="M8.707 11.182A4.486 4.486 0 0 0 10.025 8a4.486 4.486 0 0 0-1.318-3.182L8 5.525A3.489 3.489 0 0 1 9.025 8 3.49 3.49 0 0 1 8 10.475l.707.707zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z"/></svg>';
      button.title = 'Read aloud';
    }
  });
}
