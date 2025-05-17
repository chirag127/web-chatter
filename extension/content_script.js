/**
 * WebPage Chatter - Content Script
 * Handles content extraction and sidebar injection
 */

// Global variables
let sidebar = null;
let sidebarIframe = null;
let pageContent = null;
let pageMetadata = null;

// Listen for messages from background script or sidebar
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'toggleSidebar') {
    toggleSidebar();
    sendResponse({ success: true });
  } else if (message.action === 'extractContent') {
    extractPageContent()
      .then(content => {
        sendResponse({ success: true, content });
      })
      .catch(error => {
        console.error('Error extracting content:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // Keep the message channel open for async response
  } else if (message.action === 'getPageMetadata') {
    const metadata = getPageMetadata();
    sendResponse({ success: true, metadata });
  }
  
  // Return true to indicate async response
  return true;
});

/**
 * Toggle the sidebar visibility
 */
function toggleSidebar() {
  if (sidebar) {
    // If sidebar exists, remove it
    document.body.removeChild(sidebar);
    sidebar = null;
    sidebarIframe = null;
  } else {
    // If sidebar doesn't exist, create and inject it
    injectSidebar();
  }
}

/**
 * Inject the sidebar into the page
 */
function injectSidebar() {
  // Create sidebar container
  sidebar = document.createElement('div');
  sidebar.id = 'webpage-chatter-sidebar';
  sidebar.style.cssText = `
    position: fixed;
    top: 0;
    right: 0;
    width: 400px;
    height: 100%;
    z-index: 2147483647;
    border: none;
    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.2);
  `;
  
  // Create iframe for sidebar content
  sidebarIframe = document.createElement('iframe');
  sidebarIframe.style.cssText = `
    width: 100%;
    height: 100%;
    border: none;
    background-color: white;
  `;
  
  // Set iframe source to sidebar.html
  sidebarIframe.src = chrome.runtime.getURL('sidebar/sidebar.html');
  
  // Add iframe to sidebar container
  sidebar.appendChild(sidebarIframe);
  
  // Add sidebar to page
  document.body.appendChild(sidebar);
  
  // Extract page content when sidebar is first opened
  extractPageContent()
    .then(content => {
      pageContent = content;
      console.log('Page content extracted successfully');
    })
    .catch(error => {
      console.error('Error extracting page content:', error);
    });
  
  // Get page metadata
  pageMetadata = getPageMetadata();
}

/**
 * Extract the main content from the page using Readability.js
 * @returns {Promise<string>} The extracted page content
 */
async function extractPageContent() {
  return new Promise((resolve, reject) => {
    // Inject Readability.js if not already loaded
    if (typeof Readability === 'undefined') {
      const readabilityScript = document.createElement('script');
      readabilityScript.src = chrome.runtime.getURL('common/readability.js');
      readabilityScript.onload = () => {
        readabilityScript.remove();
        extractWithReadability().then(resolve).catch(reject);
      };
      readabilityScript.onerror = () => {
        reject(new Error('Failed to load Readability.js'));
      };
      document.head.appendChild(readabilityScript);
    } else {
      extractWithReadability().then(resolve).catch(reject);
    }
  });
}

/**
 * Extract content using Readability.js
 * @returns {Promise<string>} The extracted page content
 */
async function extractWithReadability() {
  return new Promise((resolve, reject) => {
    try {
      // Clone the document to avoid modifying the original
      const documentClone = document.cloneNode(true);
      
      // Create a new Readability object
      const reader = new Readability(documentClone);
      
      // Parse the page
      const article = reader.parse();
      
      if (article && article.textContent) {
        resolve(article.textContent);
      } else {
        // Fallback to extracting visible text if Readability fails
        const visibleText = extractVisibleText();
        if (visibleText.trim().length > 0) {
          resolve(visibleText);
        } else {
          reject(new Error('Failed to extract meaningful content from the page'));
        }
      }
    } catch (error) {
      console.error('Readability extraction error:', error);
      
      // Fallback to extracting visible text
      try {
        const visibleText = extractVisibleText();
        if (visibleText.trim().length > 0) {
          resolve(visibleText);
        } else {
          reject(new Error('Failed to extract meaningful content from the page'));
        }
      } catch (fallbackError) {
        reject(fallbackError);
      }
    }
  });
}

/**
 * Extract visible text from the page as a fallback method
 * @returns {string} The visible text content
 */
function extractVisibleText() {
  // Elements to exclude
  const excludeSelectors = [
    'script', 'style', 'noscript', 'iframe', 'svg',
    'header', 'footer', 'nav', 'aside', 'form',
    '[role="banner"]', '[role="navigation"]', '[role="complementary"]'
  ];
  
  // Create a selector to exclude elements
  const excludeSelector = excludeSelectors.join(', ');
  
  // Get all text nodes that are not in excluded elements
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: function(node) {
        // Skip if parent is in excluded elements
        if (node.parentElement && node.parentElement.closest(excludeSelector)) {
          return NodeFilter.FILTER_REJECT;
        }
        
        // Skip if text is just whitespace
        if (node.textContent.trim().length === 0) {
          return NodeFilter.FILTER_REJECT;
        }
        
        // Skip if node is not visible
        const style = window.getComputedStyle(node.parentElement);
        if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
          return NodeFilter.FILTER_REJECT;
        }
        
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );
  
  // Extract text from accepted nodes
  let text = '';
  let node;
  while (node = walker.nextNode()) {
    text += node.textContent.trim() + ' ';
  }
  
  return text.trim();
}

/**
 * Get metadata from the page
 * @returns {Object} Page metadata (URL, title, meta description)
 */
function getPageMetadata() {
  // Get page URL
  const pageUrl = window.location.href;
  
  // Get page title
  const pageTitle = document.title;
  
  // Get meta description
  let pageMetaDescription = '';
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    pageMetaDescription = metaDescription.getAttribute('content');
  }
  
  return {
    pageUrl,
    pageTitle,
    pageMetaDescription
  };
}
