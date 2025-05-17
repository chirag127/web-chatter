# WebPage Chatter

A browser extension that allows users to interactively chat with the content of any webpage using Google's Gemini AI.

**Last Updated:** 2025-05-16

## Overview

WebPage Chatter enhances web browsing by allowing users to ask questions about the content of any webpage. The extension extracts the main content of the page and uses Google's Gemini AI to generate answers based on that content.

Key features:

-   Chat with any webpage content through a convenient sidebar
-   Text-to-speech functionality with customizable voice, speed, and pitch
-   Save and manage chat history
-   Multiple activation methods (toolbar icon, context menu, keyboard shortcut)
-   Fallback to a lighter Gemini model for large content

## Prerequisites

-   Google Chrome, Mozilla Firefox, or Microsoft Edge (Chromium-based)
-   A Google Gemini API key (get one at [Google AI Studio](https://ai.google.dev/))

## Installation

### Local Development Installation

1. Clone this repository:

    ```
    git clone https://github.com/chirag127/web-chatter.git
    cd web-chatter
    ```

2. Install backend dependencies:

    ```
    cd backend
    pip install -r requirements.txt
    ```

3. Install frontend dependencies and generate icons:

    ```
    cd ..
    npm install --save-dev sharp
    node scripts/generate-pngs.js
    ```

4. Load the extension in your browser:
    - Chrome: Go to `chrome://extensions/`, enable "Developer mode", click "Load unpacked", and select the `extension` folder.
    - Firefox: Go to `about:debugging#/runtime/this-firefox`, click "Load Temporary Add-on", and select any file in the `extension` folder.
    - Edge: Go to `edge://extensions/`, enable "Developer mode", click "Load unpacked", and select the `extension` folder.

### Backend Deployment

The backend is designed to be deployed on Google Cloud Run:

1. Build and push the Docker image:

    ```
    cd backend
    gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/webpage-chatter-backend
    ```

2. Deploy to Cloud Run:

    ```
    gcloud run deploy webpage-chatter-backend \
      --image gcr.io/YOUR_PROJECT_ID/webpage-chatter-backend \
      --platform managed \
      --allow-unauthenticated
    ```

3. Update the `BACKEND_URL` constant in `extension/sidebar/sidebar.js` with your Cloud Run service URL.

## Usage

1. Click the WebPage Chatter icon in your browser toolbar, or right-click on a webpage and select "Chat with this page", or use the keyboard shortcut (Ctrl+Shift+C by default).

2. Enter your Gemini API key in the settings panel (you only need to do this once).

3. Ask questions about the current webpage in the chat input field.

4. Use the text-to-speech button to listen to the AI's responses.

5. View and manage your saved chats in the "Saved Chats" tab.

## Project Structure

```
project-root/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py             # FastAPI app definition, routes
│   │   ├── services/
│   │   │   └── gemini_service.py # Logic for Gemini API interaction, model fallback
│   │   └── models/
│   │       └── chat_models.py    # Pydantic models for API requests/responses
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .env.example            # Example environment variables
├── extension/
│   ├── manifest.json
│   ├── icons/
│   │   ├── icon16.png
│   │   ├── icon48.png
│   │   └── icon128.png
│   ├── popup/
│   │   ├── popup.html
│   │   └── popup.js
│   ├── sidebar/
│   │   ├── sidebar.html
│   │   ├── sidebar.css
│   │   └── sidebar.js          # Main logic for sidebar UI, chat, TTS, settings access
│   ├── settings/
│   │   ├── settings.html
│   │   ├── settings.css
│   │   └── settings.js         # Logic for settings page
│   ├── background.js           # Background scripts (context menu, keyboard shortcuts, message passing)
│   ├── content_script.js       # Injected into web pages (content extraction, sidebar injection)
│   └── common/
│       ├── readability.js      # Readability.js library
│       └── storage_service.js  # Wrapper for chrome.storage API
├── scripts/
│   └── generate-pngs.js        # Script to generate PNG icons from SVG
├── README.md
└── CHANGELOG.md
```

## Technical Stack

-   **Frontend (Extension)**:

    -   HTML5, CSS3, Vanilla JavaScript
    -   Content Extraction: Mozilla Readability.js
    -   Text-to-Speech: Browser's `window.speechSynthesis` API
    -   Storage: `chrome.storage.sync` (for settings), `chrome.storage.local` (for saved chats)

-   **Backend**:

    -   Framework: FastAPI (Python)
    -   AI Integration: Google Gemini API (`gemini-2.5-flash-preview-04-17` with fallback to `gemini-2.0-flash-lite`)

-   **Deployment (Backend)**:
    -   Google Cloud Run (containerized deployment)

## API Key Security

-   Your Gemini API key is stored securely in your browser's local storage.
-   The key is sent directly to the backend over HTTPS for each request.
-   The backend does not store or log your API key.
-   You maintain full control over your API key and usage.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

Chirag Singhal ([@chirag127](https://github.com/chirag127))
