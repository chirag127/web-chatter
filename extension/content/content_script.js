// Content script for Web Chatter extension

// Global variables
let sidebarFrame = null;
let sidebarVisible = false;

// Listen for messages from the service worker
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleSidebar') {
    toggleSidebar();
    sendResponse({ success: true });
  } else if (request.action === 'extractContent') {
    const content = extractPageContent();
    sendResponse(content);
  }
  return true; // Required for async response
});

// Function to toggle sidebar visibility
function toggleSidebar() {
  if (sidebarVisible && sidebarFrame) {
    // Hide sidebar
    document.body.removeChild(sidebarFrame);
    sidebarFrame = null;
    sidebarVisible = false;
  } else {
    // Show sidebar
    createSidebar();
    sidebarVisible = true;
  }
}

// Function to create and inject the sidebar iframe
function createSidebar() {
  // Create iframe element
  sidebarFrame = document.createElement('iframe');

  // Set attributes
  sidebarFrame.id = 'web-chatter-sidebar';
  sidebarFrame.src = chrome.runtime.getURL('sidebar/sidebar.html');

  // Set styles
  Object.assign(sidebarFrame.style, {
    position: 'fixed',
    top: '0',
    right: '0',
    width: '350px',
    height: '100%',
    zIndex: '2147483647', // Maximum z-index
    border: 'none',
    boxShadow: '-5px 0 15px rgba(0, 0, 0, 0.2)'
  });

  // Add to page
  document.body.appendChild(sidebarFrame);

  // Add event listener for messages from sidebar
  window.addEventListener('message', handleSidebarMessages);
}

// Function to handle messages from the sidebar
function handleSidebarMessages(event) {
  // Verify the origin of the message
  if (event.source !== sidebarFrame.contentWindow) {
    return;
  }

  const message = event.data;

  // Handle different message types
  if (message.action === 'getPageContent') {
    // Extract page content and send it back to the sidebar
    const content = extractPageContent();
    sidebarFrame.contentWindow.postMessage({
      action: 'pageContentResult',
      content: content
    }, '*');
  } else if (message.action === 'closeSidebar') {
    toggleSidebar();
  } else if (message.action === 'sendQuery') {
    // Forward the query to the service worker
    chrome.runtime.sendMessage({
      action: 'sendQuery',
      data: message.data
    }, response => {
      // Forward the response back to the sidebar
      sidebarFrame.contentWindow.postMessage({
        action: 'queryResponse',
        response: response
      }, '*');
    });
  }
}

// Function to extract page content
function extractPageContent() {
  try {
    // Get URL
    const url = window.location.href;

    // Get title
    const title = document.title;

    // Get meta tags
    const metaTags = {};
    const metaElements = document.querySelectorAll('meta[name], meta[property]');
    metaElements.forEach(meta => {
      const key = meta.getAttribute('name') || meta.getAttribute('property');
      const value = meta.getAttribute('content');
      if (key && value) {
        metaTags[key] = value;
      }
    });

    // Get page text content
    // Note: This is a simple implementation. For complex SPAs, more sophisticated
    // extraction might be needed.
    const bodyText = document.body.innerText;

    // Truncate content if too large (to avoid performance issues)
    const maxLength = 500000; // ~500K chars, adjust as needed
    const truncatedText = bodyText.length > maxLength
      ? bodyText.substring(0, maxLength) + '\n[Content truncated due to length...]'
      : bodyText;

    return {
      url,
      title,
      metaTags,
      content: truncatedText,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error extracting page content:', error);
    return {
      url: window.location.href,
      title: document.title,
      metaTags: {},
      content: '[Error extracting page content]',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}