// Content script for extracting webpage content
function extractPageContent() {
  const extractText = (element) => {
    // Get visible text content
    const text = element.textContent.trim();
    // Get ARIA labels if present
    const ariaLabel = element.getAttribute('aria-label');
    return (text || ariaLabel || '').trim();
  };

  const extractMainContent = () => {
    // Try to find main content container
    const mainSelectors = [
      'main',
      'article',
      '[role="main"]',
      '#main-content',
      '.main-content'
    ];

    let mainContent = '';
    for (const selector of mainSelectors) {
      const element = document.querySelector(selector);
      if (element) {
        mainContent = extractText(element);
        if (mainContent.length > 100) break; // Found substantial content
      }
    }

    // Fallback to body if no main content found
    if (!mainContent) {
      const bodyText = Array.from(document.body.children)
        .map(element => extractText(element))
        .filter(text => text.length > 0)
        .join('\n');
      mainContent = bodyText;
    }

    return mainContent;
  };

  // Extract meta information
  const getMeta = (name) => {
    const meta = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
    return meta ? meta.getAttribute('content') : '';
  };

  // Collect all relevant page information
  const pageData = {
    url: window.location.href,
    title: document.title,
    content: extractMainContent(),
    meta: {
      description: getMeta('description') || getMeta('og:description'),
      keywords: getMeta('keywords')
    }
  };

  return pageData;
}

// Listen for messages from the sidebar
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getPageContent') {
    const pageData = extractPageContent();
    sendResponse(pageData);
  }
  return true; // Required for async response
});
