/**
 * WebPage Chatter - Background Script
 * Handles context menu, keyboard shortcuts, and message passing
 */

// Constants
const CONTEXT_MENU_ID = 'webpage-chatter-context-menu';

// Initialize extension when installed or updated
chrome.runtime.onInstalled.addListener(() => {
  console.log('WebPage Chatter extension installed or updated');
  
  // Create context menu item
  chrome.contextMenus.create({
    id: CONTEXT_MENU_ID,
    title: 'Chat with this page',
    contexts: ['page', 'selection']
  });
  
  // Initialize default settings if not already set
  initializeDefaultSettings();
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === CONTEXT_MENU_ID) {
    toggleSidebar(tab.id);
  }
});

// Handle browser action (toolbar icon) clicks
chrome.action.onClicked.addListener((tab) => {
  toggleSidebar(tab.id);
});

// Handle messages from content script or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'toggleSidebar') {
    toggleSidebar(sender.tab.id);
    sendResponse({ success: true });
  }
  
  // Keep the message channel open for async responses
  return true;
});

/**
 * Toggle the sidebar visibility
 * @param {number} tabId - The ID of the current tab
 */
function toggleSidebar(tabId) {
  chrome.tabs.sendMessage(tabId, { action: 'toggleSidebar' })
    .catch(error => {
      console.error('Error toggling sidebar:', error);
      
      // If content script is not loaded yet, inject it
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['content_script.js']
      }).then(() => {
        // Try again after content script is loaded
        setTimeout(() => {
          chrome.tabs.sendMessage(tabId, { action: 'toggleSidebar' });
        }, 100);
      }).catch(err => {
        console.error('Failed to inject content script:', err);
      });
    });
}

/**
 * Initialize default settings if not already set
 */
function initializeDefaultSettings() {
  chrome.storage.sync.get(['geminiApiKey', 'ttsVoiceURI', 'ttsSpeed', 'ttsPitch', 'autoSaveChats'], (result) => {
    const defaultSettings = {
      // Don't set a default API key - user must provide their own
      ttsVoiceURI: '',  // Will be set to first available voice in settings page
      ttsSpeed: 1.0,    // Normal speed
      ttsPitch: 1.0,    // Normal pitch
      autoSaveChats: true
    };
    
    // Only set defaults for settings that don't exist yet
    const updatedSettings = {};
    let needsUpdate = false;
    
    for (const [key, value] of Object.entries(defaultSettings)) {
      if (result[key] === undefined) {
        updatedSettings[key] = value;
        needsUpdate = true;
      }
    }
    
    if (needsUpdate) {
      chrome.storage.sync.set(updatedSettings, () => {
        console.log('Default settings initialized');
      });
    }
  });
}
