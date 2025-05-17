// Background service worker for Web Chatter extension

// Initialize context menu when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  // Create context menu item
  chrome.contextMenus.create({
    id: 'toggleWebChatter',
    title: 'Open Web Chatter',
    contexts: ['page']
  });

  // Initialize storage with default settings if not already set
  chrome.storage.sync.get(['geminiApiKey', 'ttsVoice', 'ttsSpeed'], (result) => {
    if (!result.ttsSpeed) {
      chrome.storage.sync.set({ ttsSpeed: 1.0 }); // Default speed is 1.0x
    }
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'toggleWebChatter') {
    toggleSidebar(tab);
  }
});

// Handle toolbar icon clicks
chrome.action.onClicked.addListener((tab) => {
  toggleSidebar(tab);
});

// Handle keyboard shortcut
chrome.commands.onCommand.addListener((command) => {
  if (command === 'toggle-sidebar') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        toggleSidebar(tabs[0]);
      }
    });
  }
});

// Function to toggle the sidebar
function toggleSidebar(tab) {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content/content_script.js']
  }).then(() => {
    // Send message to content script to toggle sidebar
    chrome.tabs.sendMessage(tab.id, { action: 'toggleSidebar' });
  }).catch(error => {
    console.error('Error injecting content script:', error);
  });
}

// Listen for messages from content script or options page
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Handle message to send query to backend
  if (request.action === 'sendQuery') {
    sendQueryToBackend(request.data, sender.tab.id)
      .then(response => sendResponse(response))
      .catch(error => sendResponse({ error: error.message }));
    return true; // Indicates async response
  }

  // Handle other message types as needed
});

// Function to send query to backend
async function sendQueryToBackend(data, tabId) {
  try {
    // Get API key from storage
    const result = await chrome.storage.sync.get(['geminiApiKey']);
    if (!result.geminiApiKey) {
      throw new Error('Gemini API key not found. Please set it in the extension settings.');
    }

    // Add API key to data
    data.apiKey = result.geminiApiKey;

    // Send request to backend
    const backendUrl = 'http://localhost:8000/api/v1/chat'; // Local development URL
    // For production, use a deployed URL like 'https://your-backend-url.run.app/api/v1/chat'
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Error from backend');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending query to backend:', error);
    throw error;
  }
}