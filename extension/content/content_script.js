// Content script for Contextual Web Page Chat Assistant

// Constants
const SIDEBAR_ID = 'contextual-chat-sidebar';
const SIDEBAR_IFRAME_ID = 'contextual-chat-sidebar-iframe';
const SIDEBAR_WIDTH = '350px';

// Track sidebar state
let sidebarVisible = false;
let sidebarIframe = null;

// Initialize when content script is loaded
initialize();

function initialize() {
  console.log('Contextual Web Page Chat Assistant content script initialized');
  
  // Listen for messages from background script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'toggle-sidebar') {
      toggleSidebar();
      sendResponse({ success: true });
    }
    return true;
  });
}

// Function to toggle sidebar visibility
function toggleSidebar() {
  if (sidebarVisible) {
    hideSidebar();
  } else {
    showSidebar();
  }
}

// Function to show the sidebar
function showSidebar() {
  if (sidebarIframe) {
    sidebarIframe.style.display = 'block';
    sidebarVisible = true;
    return;
  }
  
  // Create sidebar container
  const sidebarContainer = document.createElement('div');
  sidebarContainer.id = SIDEBAR_ID;
  sidebarContainer.style.cssText = `
    position: fixed;
    top: 0;
    right: 0;
    width: ${SIDEBAR_WIDTH};
    height: 100%;
    z-index: 2147483647;
    border: none;
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.2);
  `;
  
  // Create iframe for sidebar content
  sidebarIframe = document.createElement('iframe');
  sidebarIframe.id = SIDEBAR_IFRAME_ID;
  sidebarIframe.src = chrome.runtime.getURL('sidebar/sidebar.html');
  sidebarIframe.style.cssText = `
    width: 100%;
    height: 100%;
    border: none;
    background-color: white;
  `;
  
  // Add iframe to container and container to page
  sidebarContainer.appendChild(sidebarIframe);
  document.body.appendChild(sidebarContainer);
  
  // Set sidebar as visible
  sidebarVisible = true;
  
  // Listen for messages from sidebar iframe
  window.addEventListener('message', handleSidebarMessages);
  
  // Extract page content and send to sidebar when it's ready
  sidebarIframe.onload = () => {
    sendPageContentToSidebar();
  };
}

// Function to hide the sidebar
function hideSidebar() {
  if (sidebarIframe) {
    sidebarIframe.style.display = 'none';
    sidebarVisible = false;
  }
}

// Function to extract page content
function extractPageContent() {
  return {
    url: window.location.href,
    title: document.title,
    metaDescription: getMetaContent('description'),
    metaKeywords: getMetaContent('keywords'),
    pageText: document.body.innerText
  };
}

// Helper function to get meta tag content
function getMetaContent(name) {
  const metaTag = document.querySelector(`meta[name="${name}"]`) || 
                  document.querySelector(`meta[property="og:${name}"]`);
  return metaTag ? metaTag.content : '';
}

// Function to send page content to sidebar
function sendPageContentToSidebar() {
  const pageContent = extractPageContent();
  
  sidebarIframe.contentWindow.postMessage({
    action: 'page-content',
    data: pageContent
  }, '*');
}

// Function to handle messages from sidebar iframe
function handleSidebarMessages(event) {
  // Ensure message is from our sidebar
  if (event.source !== sidebarIframe.contentWindow) return;
  
  const message = event.data;
  
  if (message.action === 'close-sidebar') {
    hideSidebar();
  } else if (message.action === 'api-request') {
    // Forward API requests to background script
    chrome.runtime.sendMessage({
      action: 'api-request',
      data: message.data
    }, response => {
      // Send response back to sidebar
      sidebarIframe.contentWindow.postMessage({
        action: 'api-response',
        data: response
      }, '*');
    });
  }
}
