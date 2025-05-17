// Background script for handling extension functionality
chrome.runtime.onInstalled.addListener(() => {
  // Create context menu item
  chrome.contextMenus.create({
    id: 'openWebChatter',
    title: 'WebPage Chatter: Open Sidebar',
    contexts: ['page', 'selection']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'openWebChatter') {
    chrome.sidePanel.open({ windowId: tab.windowId });
  }
});

// Listen for keyboard shortcut (Alt+Shift+C)
chrome.commands.onCommand.addListener((command) => {
  if (command === '_execute_action') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.sidePanel.open({ windowId: tabs[0].windowId });
      }
    });
  }
});
