
# Masterplan for WebPage Chatter

Document Version: 1.0
Owner: Chirag Singhal
Status: final
Prepared for: augment code assistant
Prepared by: Chirag Singhal

---

## Project Overview
WebPage Chatter is a browser extension designed to enhance web browsing by allowing users to interactively chat with the content of any webpage. Users can open a sidebar to ask questions about the page's main content, URL, title, meta tags, and other textual elements. The extension leverages the Gemini AI API for generating intelligent responses. Key features include Text-to-Speech (TTS) for answers with customizable voice settings (speed, voice), user-configurable Gemini API key, local storage for saving Q&A pairs, and multiple ways to activate the sidebar (toolbar icon, context menu, keyboard shortcut). The backend is a FastAPI Python server hosted on a PaaS.

## Project Goals
- To provide users with a seamless way to query and understand web content interactively.
- To integrate powerful AI capabilities (via Gemini API) directly into the browsing experience.
- To offer accessibility features like Text-to-Speech for AI-generated answers.
- To ensure user privacy by allowing them to use their own API keys, stored locally.
- To create a lightweight, performant, and user-friendly browser extension compatible with major browsers.

## Technical Stack
- **Frontend (Extension)**:
    - HTML, CSS, Plain JavaScript (WebExtensions API)
    - Browser's built-in Web Speech API (`speechSynthesis`) for TTS
    - Browser's local storage (`chrome.storage.local` or equivalent) for settings and saved chats
- **Backend**:
    - Python 3.9+
    - FastAPI framework
    - Google GenAI SDK for Python (`google-genai`)
- **AI Model**:
    - Primary: `gemini-2.5-flash-preview-04-17`
    - Fallback (on 200k token limit): `gemini-2.0-flash-lite`
- **Database**: None for the backend (stateless). Extension uses browser local storage.
- **Deployment**:
    - Extension: Manual packaging for Chrome Web Store, Firefox Add-ons, Edge Add-ons.
    - Backend: Google Cloud Run (PaaS).

## Project Scope
### In Scope
- **IS1: Sidebar Interface**: Native browser sidebar (e.g., `chrome.sidePanel`, `browser.sidebarAction`) displaying chat UI.
- **IS2: Web Content Extraction**:
    - Extract main textual content, page title, URL, meta tags.
    - Advanced DOM analysis for comprehensive text capture (including alt text, ARIA labels where feasible).
- **IS3: Chat Functionality**:
    - Send extracted content and user query to backend.
    - Backend processes request and queries Gemini API.
    - Display AI response in chat interface.
    - Persist chat history for the current tab session.
    - Subtle notification on model switch (primary to fallback Gemini model).
    - Smart summarization/truncation strategy for oversized content.
- **IS4: Gemini API Integration**:
    - Backend securely calls Gemini API using user-provided key.
    - Use `gemini-2.5-flash-preview-04-17` and `gemini-2.0-flash-lite` as specified.
- **IS5: Text-to-Speech (TTS)**:
    - Convert AI responses to speech using browser's Web Speech API.
    - Allow users to play/pause TTS.
- **IS6: Settings Page/Section**:
    - Input for Gemini API Key.
    - TTS settings: voice selection (from available browser voices), speed (e.g., 0.5x, 0.75x, 1x, 1.25x, 1.5x, 2x).
    - Note about local API key storage.
- **IS7: Sidebar Activation**:
    - Browser toolbar icon click.
    - Right-click context menu option ("WebPage Chatter: Open Sidebar").
    - Keyboard shortcut (default: `Alt+Shift+C`, user-configurable).
- **IS8: Save Answers**:
    - Save Q&A pairs with page URL and timestamp to browser local storage.
    - "Saved Answers" tab/section in sidebar to view/manage saved items.
- **IS9: Basic Error Handling**: Display errors (API key, network, Gemini) in the chat interface.
- **IS10: UI Elements**:
    - Clear chat button.
    - Copy button for AI messages.

### Out of Scope
- **OOS1: User Accounts/Cloud Sync**: No backend user accounts or cloud synchronization of settings/history.
- **OOS2: Advanced Content Parsing**: No support for interacting with non-textual content like images directly (beyond alt text), videos, or complex canvas elements.
- **OOS3: Multi-lingual Support for UI**: Extension UI will be in English initially.
- **OOS4: Proactive Chat Suggestions**: AI will not proactively offer information without user queries.
- **OOS5: Automated Testing Suite (Beyond Unit Tests)**: Focus on manual testing for E2E initially.
- **OOS6: Safari Support**: Initial focus on Chrome, Firefox, Edge. Safari has a different extension model.

## Functional Requirements

### FR1: Extension Core
- **FR1.1 (Sidebar Activation - Toolbar):** User can click the extension's toolbar icon to open/close the sidebar.
- **FR1.2 (Sidebar Activation - Context Menu):** User can right-click on a webpage, select "WebPage Chatter: Open Sidebar" to open the sidebar.
- **FR1.3 (Sidebar Activation - Keyboard Shortcut):** User can press `Alt+Shift+C` (or user-configured shortcut) to open/close the sidebar.
- **FR1.4 (Sidebar UI):** The extension shall display a "native" sidebar interface (using `chrome.sidePanel` or `browser.sidebarAction`) docked to the side of the webpage.
- **FR1.5 (Content Script):** The extension shall inject a content script to extract webpage data and facilitate communication with the sidebar.

### FR2: Content Extraction
- **FR2.1 (Page Data Collection):** The content script must extract the page URL, title, and meta tags (description, keywords).
- **FR2.2 (Main Content Extraction):** The content script must perform advanced DOM analysis to extract all relevant textual content from the current webpage, including headers, paragraphs, lists, table content, alt text for images, and ARIA labels.
- **FR2.3 (Content Packaging):** Extracted content shall be packaged (e.g., JSON) and sent to the sidebar, then to the backend for processing.

### FR3: Chat Interaction
- **FR3.1 (User Input):** Sidebar UI must provide a text input field for users to type their questions.
- **FR3.2 (Query Submission):** Submitting a query sends the current page's extracted content and the user's question to the backend API.
- **FR3.3 (Display AI Response):** AI responses from the backend are displayed in a chat-like format (user queries and AI answers).
- **FR3.4 (Chat History - Tab Session):** Chat history for the current page context is maintained within the sidebar for the duration of the tab session.
- **FR3.5 (Clear Chat):** A button must be available to clear the current chat conversation in the sidebar.
- **FR3.6 (Copy AI Message):** Each AI message bubble must have a button to copy its content to the clipboard.
- **FR3.7 (Model Switch Notification):** If the backend switches to the fallback Gemini model due to token limits, a subtle notification must appear in the chat interface.
- **FR3.8 (Token Limit Handling - Content Prep):** Before sending to Gemini, if extracted content is too large, it will be intelligently summarized/truncated.

### FR4: Backend & Gemini Integration
- **FR4.1 (API Endpoint):** Backend exposes a secure API endpoint (e.g., `/api/chat`) to receive page content, user query, and API key.
- **FR4.2 (Gemini API Call):** Backend uses the provided `google-genai` library to make requests to the Gemini API (`gemini-2.5-flash-preview-04-17` primarily, `gemini-2.0-flash-lite` as fallback).
- **FR4.3 (API Key Usage):** The user's Gemini API key (sent with each request) is used for authentication with the Gemini API.
- **FR4.4 (Response Processing):** Backend processes the Gemini response and sends it back to the extension.

### FR5: Text-to-Speech (TTS)
- **FR5.1 (TTS Playback):** Users can click a button/icon associated with an AI response to play it as speech.
- **FR5.2 (TTS Controls):** Basic controls like play/pause for TTS. (Stop might be implicit if another message is played or pause is hit).
- **FR5.3 (TTS Voice Selection):** In settings, users can select from available system voices for TTS.
- **FR5.4 (TTS Speed Control):** In settings, users can adjust TTS playback speed (e.g., 0.5x, 0.75x, 1x, 1.25x, 1.5x, 2x).

### FR6: Settings
- **FR6.1 (Settings Access):** Users can access a settings panel/page from the sidebar.
- **FR6.2 (API Key Configuration):** Users can input and save their Gemini API Key. The key is stored in browser local storage.
- **FR6.3 (API Key Storage Note):** A message informs the user that the API key is stored locally.
- **FR6.4 (TTS Settings UI):** Settings UI for voice and speed adjustments for TTS.

### FR7: Saved Answers
- **FR7.1 (Save Q&A):** Users can save individual Q&A pairs from the chat.
- **FR7.2 (Data Saved):** Saved data includes user question, AI answer, page URL, and timestamp. Stored in browser local storage.
- **FR7.3 (View Saved Answers):** A dedicated section/tab in the sidebar lists saved Q&A pairs.
- **FR7.4 (Manage Saved Answers):** Users can delete saved Q&A pairs.

## Non-Functional Requirements (NFR)
- **NFR1. Performance:**
    - Sidebar should load quickly (under 2 seconds).
    - Content extraction from average pages should complete within 1-3 seconds.
    - API response time (excluding Gemini processing time) should be under 500ms.
- **NFR2. Scalability (Backend):**
    - Backend on Google Cloud Run should scale to handle concurrent requests based on configuration (e.g., up to 100 concurrent users per instance, with auto-scaling).
- **NFR3. Usability:**
    - UI must be intuitive, clean, and minimalist.
    - Clear feedback for user actions and system status (loading, errors).
    - Adhere to WCAG 2.1 Level AA accessibility guidelines where feasible.
- **NFR4. Security:**
    - API key stored in `chrome.storage.local` (or equivalent) and transmitted securely (HTTPS) to the backend.
    - Backend API should validate inputs.
    - No sensitive data stored on the backend.
- **NFR5. Maintainability:**
    - Code should be modular, well-commented, and follow SOLID, DRY, KISS principles.
- **NFR6. Browser Compatibility:**
    - Extension must function correctly on latest versions of Chrome, Firefox, and Edge.

## Project Structure

```
project-root/
├── extension/
│   ├── manifest.json
│   ├── icons/
│   │   ├── icon-16.png
│   │   ├── icon-48.png
│   │   └── icon-128.png
│   ├── sidebar/
│   │   ├── sidebar.html
│   │   ├── sidebar.css
│   │   └── sidebar.js       # Handles sidebar UI, chat logic, TTS, saved answers
│   ├── options/
│   │   ├── options.html
│   │   ├── options.css
│   │   └── options.js       # Handles settings page logic
│   ├── background/
│   │   └── background.js    # Handles context menu, keyboard shortcuts, sidebar opening
│   ├── content/
│   │   └── content_script.js # Handles DOM interaction, content extraction
│   └── common/
│       └── storage.js       # Utility for browser local storage access
│       └── utils.js         # Common utility functions
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI app definition, routes
│   │   ├── core/
│   │   │   └── config.py    # Configuration (e.g. Gemini model names)
│   │   ├── services/
│   │   │   └── gemini_service.py # Logic for interacting with Gemini API
│   │   └── models/
│   │       └── chat_models.py # Pydantic models for API requests/responses
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .env.example         # Example environment variables
├── README.md
├── CHANGELOG.md
├── build-assets.js          # Script using 'sharp' to generate PNG icons from SVG
├── assets-src/              # Source SVG icons
└── .gitignore
```

## Implementation Plan

This section outlines the implementation plan. MCP servers will be used strategically.

### Phase 1: Setup & Foundation (1 week)
- **Task 1.1:** Project Setup: Initialize Git repo, basic project structure (folders, `README.md`, `CHANGELOG.md`).
    - *MCP Usage:* `context7` to understand project setup best practices.
- **Task 1.2:** Extension Manifest & Basic Sidebar: Create `manifest.json` for Chrome/Firefox/Edge. Implement basic sidebar HTML/CSS/JS that can be opened/closed via toolbar icon.
    - *MCP Usage:* `mentalmodel_clear_thought` (First Principles Thinking for manifest essentials), `visualreasoning_clear_thought` (sketching basic sidebar layout).
- **Task 1.3:** Backend FastAPI Setup: Initialize FastAPI project, create basic health check endpoint. Prepare `Dockerfile` and `.env.example`.
    - *MCP Usage:* `designpattern_clear_thought` (Modular Architecture for FastAPI).
- **Task 1.4:** Define API Contract: Specify request/response models for the chat API endpoint.
    - *MCP Usage:* `structuredargumentation_clear_thought` (defining clear inputs/outputs for the API).

### Phase 2: Core Functionality - Content Extraction & Chat (2 weeks)
- **Task 2.1:** Content Script - Basic Data Extraction: Implement `content_script.js` to extract URL, title, meta tags. Send to sidebar.
    - *MCP Usage:* `sequentialthinking_clear_thought` (step-by-step extraction logic).
- **Task 2.2:** Content Script - Advanced Text Extraction: Enhance `content_script.js` for comprehensive DOM text extraction.
    - *MCP Usage:* `scientificmethod_clear_thought` (testing different extraction methods), `debuggingapproach_clear_thought` (for complex DOM issues).
- **Task 2.3:** Backend - Gemini Integration: Implement `gemini_service.py` to connect to Gemini API using the `google-genai` library (with user-provided key). Implement model fallback logic.
    - *MCP Usage:* `designpattern_clear_thought` (API Integration Patterns), `programmingparadigm_clear_thought` (handling async calls to Gemini).
- **Task 2.4:** Backend - Chat Endpoint: Implement FastAPI endpoint (`/api/chat`) to receive data from extension, call `gemini_service`, and return response.
    - *MCP Usage:* `metacognitivemonitoring_clear_thought` (ensuring API request/response handling is robust).
- **Task 2.5:** Sidebar - Chat UI & Backend Communication: Implement chat message display, user input, and `fetch` calls to backend. Display AI responses.
    - *MCP Usage:* `programmingparadigm_clear_thought` (Event-Driven Programming for UI updates).
- **Task 2.6:** Sidebar - Chat History (Tab Session): Implement logic to store and display chat history for the current tab session.
    - *MCP Usage:* `decisionframework_clear_thought` (choosing best way to manage session data).

### Phase 3: Features - Settings, TTS, Saved Answers (2 weeks)
- **Task 3.1:** Settings Page - API Key: Create `options.html/css/js` for API key input and storage in `chrome.storage.local`.
    - *MCP Usage:* `visualreasoning_clear_thought` (designing the options page layout).
- **Task 3.2:** TTS Integration: Implement TTS functionality in `sidebar.js` using `speechSynthesis` API. Add play button to AI messages.
- **Task 3.3:** Settings Page - TTS Configuration: Add voice selection and speed controls to settings page, storing preferences in `chrome.storage.local`.
    - *MCP Usage:* `metacognitivemonitoring_clear_thought` (evaluating usability of TTS settings).
- **Task 3.4:** Saved Answers - Storage & UI: Implement "Save Answer" button. Store Q&A with metadata. Create "Saved Answers" tab in sidebar to list and delete items.
    - *MCP Usage:* `designpattern_clear_thought` (State Management for saved answers display).
- **Task 3.5:** UI Enhancements: Implement "Clear Chat" and "Copy AI Message" buttons.
    - *MCP Usage:* `collaborativereasoning_clear_thought` (simulating user feedback on UI convenience).

### Phase 4: Activation Methods & Polish (1 week)
- **Task 4.1:** Context Menu Integration: Implement background script logic to add context menu item for opening sidebar.
- **Task 4.2:** Keyboard Shortcut: Implement background script logic for default keyboard shortcut and make it configurable.
- **Task 4.3:** Error Handling & UI Polish: Implement comprehensive error display. Refine UI/UX based on testing.
    - *MCP Usage:* `debuggingapproach_clear_thought` (systematically addressing UI bugs), `scientificmethod_clear_thought` (A/B testing small UI changes if possible).
- **Task 4.4:** Cross-Browser Testing: Test thoroughly on Chrome, Firefox, Edge. Address compatibility issues.
    - *MCP Usage:* `mentalmodel_clear_thought` (Error Propagation Understanding for cross-browser bugs).

### Phase 5: Deployment & Documentation (1 week)
- **Task 5.1:** Backend Deployment: Deploy FastAPI backend to Google Cloud Run. Configure environment variables.
- **Task 5.2:** Asset Generation Script: Create `build-assets.js` using `sharp` to convert SVG icons to PNG.
- **Task 5.3:** Documentation: Finalize `README.md` (setup, usage, API key info), `CHANGELOG.md`. Add comments. `getCurrentDateTime_node` for last updated in README.
    - *MCP Usage:* `context7` (for README best practices).
- **Task 5.4:** Packaging: Prepare extension packages for submission to browser web stores.
- **Task 5.5:** Final Review and Testing: Conduct a full product review and final testing round.
    - *MCP Usage:* `metacognitivemonitoring_clear_thought` (final check of requirements coverage).

## API Endpoints (Backend)
- `POST /api/chat`
    - **Description**: Receives webpage content, user query, and Gemini API key. Returns AI-generated response.
    - **Request Body (JSON)**:
      ```json
      {
        "page_content": "extracted textual content of the webpage...",
        "page_url": "current page URL",
        "page_title": "current page title",
        "meta_data": { "description": "...", "keywords": "..." },
        "user_query": "User's question",
        "api_key": "USER_GEMINI_API_KEY"
      }
      ```
    - **Response Body (JSON) - Success (200)**:
      ```json
      {
        "ai_response": "Gemini's answer...",
        "model_used": "gemini-2.5-flash-preview-04-17"
      }
      ```
    - **Response Body (JSON) - Error (e.g., 400, 401, 500)**:
      ```json
      {
        "detail": "Error message"
      }
      ```

## Data Models (Pydantic for FastAPI, conceptual for extension)

### Backend: ChatRequest (Pydantic)
```python
from pydantic import BaseModel, HttpUrl
from typing import Dict, Optional

class MetaData(BaseModel):
    description: Optional[str] = None
    keywords: Optional[str] = None

class ChatRequest(BaseModel):
    page_content: str
    page_url: HttpUrl
    page_title: str
    meta_data: MetaData
    user_query: str
    api_key: str
```

### Backend: ChatResponse (Pydantic)
```python
from pydantic import BaseModel

class ChatResponse(BaseModel):
    ai_response: str
    model_used: str
```

### Extension: StoredChat (Conceptual - in `chrome.storage.local`)
```javascript
// Example structure for a single saved Q&A item
{
  id: "unique_id_timestamp", // Unique ID for the saved item
  url: "page_url",
  question: "User's question",
  answer: "AI's answer",
  timestamp: "ISO_date_string"
}

// Example structure for settings
{
  geminiApiKey: "USER_API_KEY",
  ttsVoice: "voice_uri_or_name",
  ttsSpeed: 1.0 // (0.5, 0.75, 1.0, 1.25, 1.5, 2.0)
}
```

## Environment Variables
```
# Backend (.env for local, GCR service configuration for deployed)
# Required environment variables
# GEMINI_API_KEY is NOT stored on backend; it's passed per request from user's extension.
# However, the backend might need its own API key if it were to offer a managed service, which is out of scope.
# For this project, the primary API key handling is client-side.
# If there are backend-specific configs (e.g. logging levels, allowed origins for CORS):
# ALLOWED_ORIGINS="chrome-extension://<id1>,moz-extension://<id2>" (Example for CORS)
# LOG_LEVEL="INFO"

# Extension (No .env file directly packaged, but these are effectively managed by user in settings)
# GEMINI_API_KEY=User's Gemini API Key (stored in chrome.storage.local by the extension)
```
_Note: An `.env.example` file should be created for the backend folder if any backend-specific environment variables are identified, e.g., for CORS configuration or logging levels._

## Testing Strategy
- **Unit Tests (Backend)**: Pytest for FastAPI endpoints and service logic (e.g., Gemini interaction, content processing).
- **Unit Tests (Frontend)**: Jest or similar for critical JavaScript utility functions in the extension (e.g., storage management, complex UI logic if any).
- **Manual E2E Testing**:
    - Test sidebar opening/closing mechanisms (toolbar, context menu, shortcut).
    - Test content extraction on diverse websites (simple static, complex dynamic, SPAs).
    - Test chat functionality: query submission, response display, history.
    - Test TTS: playback, voice change, speed change.
    - Test settings: API key saving, TTS settings persistence.
    - Test saved answers: saving, viewing, deleting.
    - Test error handling for invalid API key, network errors, Gemini errors.
- **Cross-Browser Testing**: Manually test on latest versions of Chrome, Firefox, and Edge.

## Deployment Strategy
- **Backend (FastAPI on Google Cloud Run)**:
    - Containerize the FastAPI application using Docker.
    - Push the Docker image to Google Container Registry (GCR).
    - Deploy the image to Google Cloud Run, configuring necessary environment variables (if any, like CORS origins) and scaling parameters.
    - Set up HTTPS (default with Cloud Run).
- **Frontend (Browser Extension)**:
    - Develop using WebExtensions API for cross-browser compatibility.
    - Create separate builds/packages if minor manifest adjustments are needed per browser.
    - Manually submit the packaged extension to:
        - Chrome Web Store
        - Mozilla Add-ons (AMO)
        - Microsoft Edge Add-ons

## Maintenance Plan
- Monitor user feedback and bug reports from web store channels.
- Regularly update dependencies (Python packages for backend, review JS libraries if any are added).
- Test against new browser versions for compatibility.
- Periodically review Gemini API changes and update integration if necessary.
- `getCurrentDateTime_node` tool to update `README.md` last updated timestamp with each significant update.

## Risks and Mitigations
| Risk                                       | Impact | Likelihood | Mitigation                                                                                                                              |
|--------------------------------------------|--------|------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| Changes in Gemini API                      | High   | Medium     | Monitor API documentation. Encapsulate API interaction logic in `gemini_service.py` for easier updates. Use `metacognitivemonitoring_clear_thought` to track API stability. |
| Inconsistent DOM structures across websites| High   | High       | Robust content extraction logic. Use `debuggingapproach_clear_thought` for tricky sites. Potentially offer user option to select content area if extraction fails. |
| Browser API inconsistencies/changes        | Medium | Medium     | Stick to well-supported WebExtensions APIs. Test thoroughly on target browsers. Use `context7` for up-to-date browser API info.              |
| User API Key Security Concerns             | Medium | Low        | Store API key in `chrome.storage.local`. Clearly communicate local storage. All comms to backend over HTTPS. Backend doesn't store the key. |
| Performance issues on very large pages     | Medium | Medium     | Implement smart content summarization/truncation before sending to Gemini. Optimize content script. `scientificmethod_clear_thought` to benchmark. |
| TTS quality/voice variety limitations      | Low    | Medium     | Web Speech API is browser/OS-dependent. Clearly list available voices. Manage user expectations.                                            |
| Reaching Gemini token limits frequently    | Medium | Medium     | Implement fallback model. Inform user. Strategy for content summarization is key.                                                         |

## Future Enhancements
- **FE1: Cloud Sync**: Option for users to sync settings and saved answers across devices (would require user accounts and backend database).
- **FE2: Advanced Content Selection**: Allow users to manually select specific parts of a webpage for context if automatic extraction is insufficient.
- **FE3: Multi-language Support**: Localize extension UI and potentially support queries/responses in multiple languages.
- **FE4: Customizable Prompts**: Allow advanced users to customize the system prompt sent to Gemini.
- **FE5: Usage Analytics (Opt-in)**: Collect anonymized usage data to improve the extension (e.g., common errors, popular features).
- **FE6: Summarization Feature**: Dedicated feature to summarize the page content with one click.

## Development Guidelines

### Code Quality & Design Principles
- Follow industry-standard coding best practices (clean code, modularity, error handling, security, scalability).
- Apply SOLID, DRY (via abstraction), and KISS principles.
- Design modular, reusable components/functions.
- Optimize for code readability and maintainable structure.
- Add concise, useful function-level comments.
- Implement comprehensive error handling (try-catch, custom errors, async handling).

### Frontend Development (Extension)
- Provide modern, clean, professional, and intuitive UI designs for the sidebar and options page.
- Adhere to UI/UX principles (clarity, consistency, simplicity, feedback, accessibility/WCAG Level AA).
- Use plain HTML, CSS, and JavaScript. CSS will be organized per component (sidebar, options).

### Data Handling & APIs
- Integrate with the Gemini API as specified.
- Prohibit placeholder, mock, or dummy API responses in the final code for the backend.
- Accept Gemini API key exclusively via user input in extension settings, passed to backend per-request.
- Use `.env.example` file for backend (if any backend-specific config is needed).
- Centralize backend API endpoint URL in a constants module within the extension.
- Never hardcode API keys or sensitive URLs directly in service/component files.

### Asset Generation
- Do not use placeholder images or icons.
- Create necessary graphics (e.g., extension icons) as SVG (in `assets-src/`) and convert to PNG using the `sharp` library via a build script (`build-assets.js`).
- Reference only the generated PNG files (in `extension/icons/`) within the application code (`manifest.json`).

### Documentation Requirements
- Create a comprehensive `README.md` including project overview, setup instructions (for devs), usage guide (for users), how to get/use Gemini API key, and other essential information. Include last updated date/time.
- Maintain a `CHANGELOG.md` to document changes using semantic versioning.
- Document required API keys/credentials clearly (i.e., user needs their own Gemini key).
- Ensure all documentation is well-written, accurate, and reflects the final code.

## Tool Usage Instructions (For AI Code Assistant)

### MCP Servers and Tools
- Use the `context7` MCP server to gather contextual information about the current task, including relevant libraries, frameworks, and APIs (e.g., WebExtensions API, FastAPI, Google GenAI SDK).
- Use the clear thought MCP servers for various problem-solving approaches:
    - `mentalmodel_clear_thought`: For applying structured problem-solving (e.g., First Principles for manifest structure, Error Propagation for cross-browser bugs).
    - `designpattern_clear_thought`: For software architecture (e.g., Modular Architecture for FastAPI/Extension, API Integration for Gemini, State Management for UI updates).
    - `programmingparadigm_clear_thought`: For applying different programming approaches (e.g., Event-Driven for UI, Asynchronous for API calls).
    - `debuggingapproach_clear_thought`: For systematic debugging (e.g., for DOM extraction, API communication issues).
    - `collaborativereasoning_clear_thought`: For simulating expert collaboration (e.g., for UI/UX choices, feature impact).
    - `decisionframework_clear_thought`: For structured decision analysis (e.g., choosing data storage methods within extension).
    - `metacognitivemonitoring_clear_thought`: For tracking knowledge boundaries and reasoning quality (e.g., assessing robustness of error handling, Gemini API limits).
    - `scientificmethod_clear_thought`: For applying formal scientific reasoning (e.g., testing content extraction effectiveness, performance benchmarking).
    - `structuredargumentation_clear_thought`: For dialectical reasoning (e.g., defining API contracts, justifying design choices).
    - `visualreasoning_clear_thought`: For visual thinking (e.g., UI layout for sidebar/options).
    - `sequentialthinking_clear_thought`: For breaking down complex problems (e.g., content extraction pipeline, multi-step UI flows).
- Use the date and time MCP server:
    - Use `getCurrentDateTime_node` tool to get the current date and time in UTC format.
    - Add last updated date and time in UTC format to the `README.md` file.
- Use the `websearch` tool to find information on the internet when needed (e.g., latest browser API compatibility, Gemini SDK updates).

### System & Environment Considerations
- Target system: Windows 11 Home Single Language 23H2.
- Use semicolon (`;`) as the command separator in PowerShell commands, not `&&`.
- Use `New-Item -ItemType Directory -Path "path1", "path2", ... -Force` for creating directories in PowerShell.
- Use language-native path manipulation libraries (e.g., Node.js `path` for build scripts, Python `pathlib` for backend) for robust path handling.
- Use package manager commands (`npm install`, `pip install`) via the `launch-process` tool to add dependencies; do not edit `package.json` or `requirements.txt` directly without running install commands.

### Gemini API Integration Code (Backend Python Snippet)
The backend service interacting with Gemini should be structured similar to this, using the user-provided API key and specified models:
```python
# In backend/app/services/gemini_service.py
from google import genai
from app.core.config import settings # Assuming model names are in config

class GeminiService:
    def __init__(self, api_key: str):
        # Note: Client should be configured per-request or managed carefully if stateful
        # For stateless FastAPI requests, initializing client per call with user's key is safer.
        self.client = genai.Client(api_key=api_key)

    def generate_content(self, prompt_parts: list, use_fallback_model: bool = False):
        model_name = settings.GEMINI_FALLBACK_MODEL if use_fallback_model else settings.GEMINI_PRIMARY_MODEL
        try:
            # The user's raw idea uses models.generate_content which is for non-chat models.
            # For chat, it's typically client.generative_models(model_name).generate_content(...)
            # Or, if using a specific "flash" model that supports simple generation:
            model_instance = self.client.get_generative_model(model_name) # More flexible
            response = model_instance.generate_content(contents=prompt_parts)
            # For gemini-2.5-flash-preview-04-17 and gemini-2.0-flash-lite, ensure this API call pattern is correct.
            # The original prompt was: client.models.generate_content(model="gemini-2.0-flash", contents=["How does AI work?"])
            # Let's align with the user's direct example for the call structure, adapting the model name.
            # response = self.client.models.generate_content(model=model_name, contents=prompt_parts) # This seems to be for specific model types
            # Given the library structure, `GenerativeModel.generate_content` is more standard for newer models.
            # We will use `GenerativeModel(model_name).generate_content(contents)` pattern.
            return response.text, model_name
        except Exception as e:
            # Log error e
            print(f"Error calling Gemini API with model {model_name}: {e}") # Basic print for now, use proper logging
            if not use_fallback_model: # If primary failed, try fallback
                print(f"Retrying with fallback model: {settings.GEMINI_FALLBACK_MODEL}")
                return self.generate_content_with_fallback(prompt_parts, fallback_api_key=self.client._client._default_monotransport.api_key) # Pass key for re-init if needed
            raise  # Re-raise if fallback also fails or was already fallback

    def generate_content_with_fallback(self, prompt_parts: list, fallback_api_key: str):
        # This method specifically uses the fallback model.
        # It might be better to integrate this logic into the main generate_content or handle retry outside.
        # For simplicity, let's assume the main method handles the fallback switch.
        # The example code provided by user:
        # response = client.models.generate_content(model="gemini-2.0-flash", contents=["How does AI work?"])
        # This implies a top-level client.models.generate_content.
        # However, google-genai SDK typically uses:
        # model = genai.GenerativeModel(model_name)
        # response = model.generate_content(prompt_parts)
        # Let's stick to the more common GenerativeModel pattern for flexibility with chat vs non-chat models.
        # The final model choice (`gemini-2.5-flash-preview-04-17`, `gemini-2.0-flash-lite`) should be compatible.

        # Re-evaluating the user's strict code:
        # `response = client.models.generate_content(model="gemini-2.0-flash", contents=["How does AI work?"])`
        # This interface on `genai.Client` does exist.
        # So the service would be:
        model_to_use = settings.GEMINI_FALLBACK_MODEL if use_fallback_model else settings.GEMINI_PRIMARY_MODEL

        # Construct the full prompt including page content and user query
        # For example, prompt_parts could be a list like:
        # [f"Webpage content:\n{page_data_str}", f"User question: {user_query}"]

        try:
            response = self.client.generate_content( # Corrected based on user's strict example, available on Client itself
                model=model_to_use, # e.g., "models/gemini-2.5-flash-preview-04-17" or "models/gemini-2.0-flash-lite"
                                  # The SDK might require the "models/" prefix. This needs to be confirmed.
                                  # If the user-provided model names are direct aliases, then no prefix.
                contents=prompt_parts
            )
            return response.text, model_to_use
        except Exception as e:
            print(f"Error during Gemini API call with model {model_to_use}: {str(e)}")
            # If this was the primary model, and it failed (e.g. token limit specific error),
            # the calling code should catch this and retry with use_fallback_model=True
            raise

# Example usage in FastAPI endpoint:
# gemini_api_key = request_data.api_key
# service = GeminiService(api_key=gemini_api_key)
# combined_prompt = f"Context from webpage (URL: {request_data.page_url}, Title: {request_data.page_title}):\n{request_data.page_content}\n\nQuestion: {request_data.user_query}"
# try:
#     ai_response_text, model_used = service.generate_content([combined_prompt])
# except SpecificTokenLimitError: # Hypothetical error for token limits
#     ai_response_text, model_used = service.generate_content([combined_prompt], use_fallback_model=True)
# except Exception as e:
#     # Handle other errors
#     raise HTTPException(status_code=500, detail=str(e))
```
_The model names might need to be prefixed with `models/` (e.g., `models/gemini-1.5-flash-latest` if `gemini-2.5-flash-preview-04-17` is an alias or needs specific formatting for the SDK). This should be verified against the `google-genai` SDK documentation for the exact model identifiers._
_The logic for token limit detection and fallback needs robust implementation. The Gemini API might return specific errors for token limits, which should be caught to trigger the fallback._

### Error Handling & Debugging
- First attempt to resolve errors autonomously using available tools.
- Perform systematic debugging: consult web resources, documentation, modify code, adjust configuration, retry. Use `debuggingapproach_clear_thought` MCP server.
- Report back only if an insurmountable blocker persists after exhausting all self-correction efforts.

## Conclusion
This masterplan provides a comprehensive blueprint for developing the WebPage Chatter browser extension. By following this plan, leveraging the specified AI tools and adhering to the development guidelines, the AI code assistant should be able to implement a high-quality, functional, and user-friendly product. The focus is on core functionality, user experience, and robust integration with the Gemini API.
```