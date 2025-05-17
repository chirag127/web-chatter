/**
 * WebPage Chatter - Popup Script
 */

// DOM Elements
const chatBtn = document.getElementById('chat-btn');
const settingsBtn = document.getElementById('settings-btn');
const savedChatsBtn = document.getElementById('saved-chats-btn');

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    chatBtn.addEventListener('click', openChat);
    settingsBtn.addEventListener('click', openSettings);
    savedChatsBtn.addEventListener('click', openSavedChats);
});

/**
 * Open the chat sidebar
 */
function openChat() {
    // Get the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
            // Send message to toggle sidebar
            chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleSidebar' })
                .catch(error => {
                    console.error('Error opening chat:', error);
                    
                    // If content script is not loaded yet, inject it
                    chrome.scripting.executeScript({
                        target: { tabId: tabs[0].id },
                        files: ['content_script.js']
                    }).then(() => {
                        // Try again after content script is loaded
                        setTimeout(() => {
                            chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleSidebar' });
                        }, 100);
                    }).catch(err => {
                        console.error('Failed to inject content script:', err);
                    });
                });
            
            // Close popup
            window.close();
        }
    });
}

/**
 * Open the settings page
 */
function openSettings() {
    chrome.runtime.openOptionsPage();
    window.close();
}

/**
 * Open the saved chats view
 */
function openSavedChats() {
    // Get the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
            // Send message to toggle sidebar and switch to saved chats tab
            chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleSidebar' })
                .then(() => {
                    // Switch to saved chats tab
                    setTimeout(() => {
                        chrome.tabs.sendMessage(tabs[0].id, { action: 'switchToSavedTab' });
                    }, 100);
                })
                .catch(error => {
                    console.error('Error opening saved chats:', error);
                    
                    // If content script is not loaded yet, inject it
                    chrome.scripting.executeScript({
                        target: { tabId: tabs[0].id },
                        files: ['content_script.js']
                    }).then(() => {
                        // Try again after content script is loaded
                        setTimeout(() => {
                            chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleSidebar' });
                            
                            // Switch to saved chats tab
                            setTimeout(() => {
                                chrome.tabs.sendMessage(tabs[0].id, { action: 'switchToSavedTab' });
                            }, 100);
                        }, 100);
                    }).catch(err => {
                        console.error('Failed to inject content script:', err);
                    });
                });
            
            // Close popup
            window.close();
        }
    });
}
