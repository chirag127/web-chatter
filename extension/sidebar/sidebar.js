// Sidebar script for Web Chatter extension

// DOM Elements
const messagesContainer = document.getElementById('messagesContainer');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const closeBtn = document.getElementById('closeBtn');
const settingsBtn = document.getElementById('settingsBtn');
const historyBtn = document.getElementById('historyBtn');
const chatTab = document.getElementById('chatTab');
const historyTab = document.getElementById('historyTab');
const chatContent = document.getElementById('chatContent');
const historyContent = document.getElementById('historyContent');
const historyItemsContainer = document.getElementById('historyItemsContainer');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const loadingIndicator = document.getElementById('loadingIndicator');
const apiKeyWarning = document.getElementById('apiKeyWarning');
const goToSettingsBtn = document.getElementById('goToSettingsBtn');

// Global variables
let pageContent = null;
let currentConversation = [];
let synthesis = window.speechSynthesis;
let currentUtterance = null;
let ttsVoice = null;
let ttsSpeed = 1.0;

// Initialize
document.addEventListener('DOMContentLoaded', initialize);

// Event Listeners
sendBtn.addEventListener('click', handleSendMessage);
userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSendMessage();
  }
});
closeBtn.addEventListener('click', closeSidebar);
settingsBtn.addEventListener('click', openSettings);
historyBtn.addEventListener('click', () => {
  historyTab.click();
});
chatTab.addEventListener('click', () => {
  chatTab.classList.add('bg-white');
  chatTab.classList.remove('bg-gray-200');
  historyTab.classList.add('bg-gray-200');
  historyTab.classList.remove('bg-white');
  chatContent.classList.remove('hidden');
  historyContent.classList.add('hidden');
});
historyTab.addEventListener('click', () => {
  historyTab.classList.add('bg-white');
  historyTab.classList.remove('bg-gray-200');
  chatTab.classList.add('bg-gray-200');
  chatTab.classList.remove('bg-white');
  historyContent.classList.remove('hidden');
  chatContent.classList.add('hidden');
  loadChatHistory();
});
clearHistoryBtn.addEventListener('click', clearChatHistory);
goToSettingsBtn.addEventListener('click', openSettings);

// Initialize the sidebar
async function initialize() {
  // Check if API key is set
  const settings = await chrome.storage.sync.get(['geminiApiKey', 'ttsVoice', 'ttsSpeed']);
  if (!settings.geminiApiKey) {
    apiKeyWarning.classList.remove('hidden');
  }

  // Load TTS settings
  if (settings.ttsVoice) {
    ttsVoice = settings.ttsVoice;
  }
  if (settings.ttsSpeed) {
    ttsSpeed = parseFloat(settings.ttsSpeed);
  }

  // Request page content from content script
  requestPageContent();
}

// Request page content from the content script
function requestPageContent() {
  window.parent.postMessage({
    action: 'getPageContent'
  }, '*');
}

// Handle messages from content script
window.addEventListener('message', (event) => {
  const message = event.data;

  if (message.action === 'pageContentResult') {
    pageContent = message.content;
  } else if (message.action === 'queryResponse') {
    handleQueryResponse(message.response);
  }
});

// Handle sending a message
function handleSendMessage() {
  const query = userInput.value.trim();
  if (!query) return;

  // Add user message to UI
  addMessageToUI('user', query);
  userInput.value = '';

  // Show loading indicator
  loadingIndicator.classList.remove('hidden');

  // Check if we have page content
  if (!pageContent) {
    requestPageContent();
    setTimeout(() => sendQuery(query), 500); // Wait for content to be fetched
  } else {
    sendQuery(query);
  }
}

// Send query to backend via service worker
function sendQuery(query) {
  // Add to current conversation
  currentConversation.push({ role: 'user', content: query });

  // Prepare data for backend
  const data = {
    query,
    url: pageContent.url,
    title: pageContent.title,
    metaTags: pageContent.metaTags,
    content: pageContent.content,
    conversation: currentConversation
  };

  // Send message to content script to forward to service worker
  window.parent.postMessage({
    action: 'sendQuery',
    data: data
  }, '*');
}

// Handle query response from backend
function handleQueryResponse(response) {
  // Hide loading indicator
  loadingIndicator.classList.add('hidden');

  if (response.error) {
    // Show error message
    addMessageToUI('error', response.error);
    return;
  }

  // Add response to conversation
  const answer = response.answer;
  currentConversation.push({ role: 'assistant', content: answer });

  // Add to UI
  addMessageToUI('assistant', answer);

  // Save to history
  saveToHistory({
    query: currentConversation[currentConversation.length - 2].content,
    answer: answer,
    url: pageContent.url,
    title: pageContent.title,
    timestamp: new Date().toISOString()
  });
}

// Add a message to the UI
function addMessageToUI(role, content) {
  const messageDiv = document.createElement('div');
  messageDiv.className = role === 'user'
    ? 'bg-blue-100 p-3 rounded-lg max-w-[85%] ml-auto'
    : role === 'assistant'
      ? 'bg-white border border-gray-300 p-3 rounded-lg max-w-[85%]'
      : 'bg-red-100 p-3 rounded-lg max-w-[85%]';

  // Create message content
  const messageContent = document.createElement('p');
  messageContent.className = 'text-sm whitespace-pre-wrap';
  messageContent.textContent = content;
  messageDiv.appendChild(messageContent);

  // Add TTS button for assistant messages
  if (role === 'assistant') {
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'flex justify-end mt-2';

    const ttsButton = document.createElement('button');
    ttsButton.className = 'text-blue-600 hover:text-blue-800';
    ttsButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clip-rule="evenodd" />
      </svg>
    `;
    ttsButton.title = 'Read aloud';
    ttsButton.addEventListener('click', () => {
      speakText(content);
    });

    controlsDiv.appendChild(ttsButton);
    messageDiv.appendChild(controlsDiv);
  }

  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Text-to-Speech function
function speakText(text) {
  // Stop any current speech
  stopSpeech();

  // Create new utterance
  const utterance = new SpeechSynthesisUtterance(text);

  // Set voice if specified
  if (ttsVoice) {
    const voices = synthesis.getVoices();
    const selectedVoice = voices.find(voice => voice.name === ttsVoice);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
  }

  // Set rate (speed)
  utterance.rate = ttsSpeed;

  // Store current utterance
  currentUtterance = utterance;

  // Speak
  synthesis.speak(utterance);
}

// Stop current speech
function stopSpeech() {
  if (synthesis.speaking) {
    synthesis.cancel();
  }
  currentUtterance = null;
}

// Save chat to history
async function saveToHistory(chatItem) {
  try {
    // Get existing history
    const result = await chrome.storage.local.get(['chatHistory']);
    let history = result.chatHistory || [];

    // Add new item
    history.unshift(chatItem); // Add to beginning

    // Limit history size (e.g., keep last 50 items)
    if (history.length > 50) {
      history = history.slice(0, 50);
    }

    // Save back to storage
    await chrome.storage.local.set({ chatHistory: history });
  } catch (error) {
    console.error('Error saving to history:', error);
  }
}

// Load chat history
async function loadChatHistory() {
  try {
    // Clear current history display
    historyItemsContainer.innerHTML = '';

    // Get history from storage
    const result = await chrome.storage.local.get(['chatHistory']);
    const history = result.chatHistory || [];

    // Update empty message visibility
    document.getElementById('emptyHistoryMessage').style.display =
      history.length === 0 ? 'block' : 'none';

    // Display history items
    history.forEach((item, index) => {
      const historyItem = createHistoryItem(item, index);
      historyItemsContainer.appendChild(historyItem);
    });
  } catch (error) {
    console.error('Error loading history:', error);
  }
}

// Create a history item element
function createHistoryItem(item, index) {
  const itemDiv = document.createElement('div');
  itemDiv.className = 'bg-white border border-gray-300 rounded-lg p-4';

  // Create header with title and timestamp
  const header = document.createElement('div');
  header.className = 'flex justify-between items-center mb-2';

  const title = document.createElement('h3');
  title.className = 'font-medium text-blue-600 truncate flex-1';
  title.textContent = item.title || 'Unknown Page';
  title.title = item.url || '';

  const timestamp = document.createElement('span');
  timestamp.className = 'text-xs text-gray-500';
  timestamp.textContent = new Date(item.timestamp).toLocaleString();

  header.appendChild(title);
  header.appendChild(timestamp);
  itemDiv.appendChild(header);

  // Create query
  const query = document.createElement('p');
  query.className = 'text-sm font-medium mb-2';
  query.textContent = `Q: ${item.query}`;
  itemDiv.appendChild(query);

  // Create answer (truncated)
  const answer = document.createElement('p');
  answer.className = 'text-sm text-gray-700 mb-2';
  const maxLength = 150;
  const truncatedAnswer = item.answer.length > maxLength
    ? item.answer.substring(0, maxLength) + '...'
    : item.answer;
  answer.textContent = `A: ${truncatedAnswer}`;
  itemDiv.appendChild(answer);

  // Create actions
  const actions = document.createElement('div');
  actions.className = 'flex justify-end space-x-2';

  // View full button
  const viewBtn = document.createElement('button');
  viewBtn.className = 'text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 py-1 px-2 rounded';
  viewBtn.textContent = 'View Full';
  viewBtn.addEventListener('click', () => {
    // Switch to chat tab and display this conversation
    chatTab.click();
    messagesContainer.innerHTML = '';
    addMessageToUI('user', item.query);
    addMessageToUI('assistant', item.answer);

    // Update current conversation
    currentConversation = [
      { role: 'user', content: item.query },
      { role: 'assistant', content: item.answer }
    ];
  });

  // Delete button
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'text-xs bg-red-100 hover:bg-red-200 text-red-800 py-1 px-2 rounded';
  deleteBtn.textContent = 'Delete';
  deleteBtn.addEventListener('click', async () => {
    try {
      // Get current history
      const result = await chrome.storage.local.get(['chatHistory']);
      let history = result.chatHistory || [];

      // Remove this item
      history.splice(index, 1);

      // Save back to storage
      await chrome.storage.local.set({ chatHistory: history });

      // Reload history display
      loadChatHistory();
    } catch (error) {
      console.error('Error deleting history item:', error);
    }
  });

  actions.appendChild(viewBtn);
  actions.appendChild(deleteBtn);
  itemDiv.appendChild(actions);

  return itemDiv;
}

// Clear all chat history
async function clearChatHistory() {
  if (confirm('Are you sure you want to clear all chat history?')) {
    try {
      await chrome.storage.local.remove(['chatHistory']);
      loadChatHistory(); // Reload (empty) history display
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  }
}

// Open settings page
function openSettings() {
  chrome.runtime.openOptionsPage();
}

// Close the sidebar
function closeSidebar() {
  window.parent.postMessage({ action: 'closeSidebar' }, '*');
}