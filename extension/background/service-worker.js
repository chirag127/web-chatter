// Background service worker for Contextual Web Page Chat Assistant

// Constants
const CONTEXT_MENU_ID = 'open-chat-sidebar';
const COMMAND_TOGGLE_SIDEBAR = 'toggle-sidebar';

// Initialize context menu when extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  // Create context menu item
  chrome.contextMenus.create({
    id: CONTEXT_MENU_ID,
    title: 'Chat with this page',
    contexts: ['page']
  });
  
  console.log('Contextual Web Page Chat Assistant installed');
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === CONTEXT_MENU_ID) {
    toggleSidebar(tab);
  }
});

// Handle browser action (toolbar icon) clicks
chrome.action.onClicked.addListener((tab) => {
  toggleSidebar(tab);
});

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener((command, tab) => {
  if (command === COMMAND_TOGGLE_SIDEBAR) {
    toggleSidebar(tab);
  }
});

// Function to toggle the sidebar
function toggleSidebar(tab) {
  if (!tab) return;
  
  chrome.tabs.sendMessage(tab.id, { action: 'toggle-sidebar' })
    .catch(error => {
      console.error('Error toggling sidebar:', error);
      
      // If content script is not loaded yet, inject it
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content/content_script.js']
      }).then(() => {
        // Try again after injecting content script
        setTimeout(() => {
          chrome.tabs.sendMessage(tab.id, { action: 'toggle-sidebar' })
            .catch(error => console.error('Error toggling sidebar after injection:', error));
        }, 100);
      }).catch(error => {
        console.error('Error injecting content script:', error);
      });
    });
}

// Listen for messages from content script or sidebar
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Handle API requests from sidebar
  if (message.action === 'api-request') {
    handleApiRequest(message.data)
      .then(response => sendResponse(response))
      .catch(error => sendResponse({ error: error.message }));
    return true; // Indicates async response
  }
  
  // Handle other messages as needed
  return false;
});

// Function to handle API requests
async function handleApiRequest(data) {
  try {
    // Get API key from storage
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
