
# Masterplan for Contextual Web Page Chat Assistant

Document Version: 1.1
Owner: Chirag Singhal
Status: final
Prepared for: augment code assistant
Prepared by: Chirag Singhal (CTO Persona via AI)

---

## Project Overview
The Contextual Web Page Chat Assistant is a browser extension designed to enhance web browsing by allowing users to interactively "chat" with the content of any webpage. Users can activate a sidebar to ask questions about the current page's text, URL, title, and meta tags. The backend, built with FastAPI (Python), will process these queries using Google's Gemini API. The extension will feature text-to-speech (TTS) for answers, with user-configurable voice speed and selection. Users will manage their Gemini API key and TTS preferences through a dedicated settings screen within the extension. Chat interactions can also be saved to the browser's local storage for later reference.

## Project Goals
- To provide users with an intuitive way to understand and extract information from web pages via a conversational interface.
- To integrate seamlessly with the user's browsing experience across various websites.
- To deliver accurate and context-aware answers using the Gemini Large Language Model.
- To offer accessibility features like Text-to-Speech with customizable settings.
- To ensure user privacy by having users provide their own API keys and processing data securely.

## Technical Stack
- **Frontend (Browser Extension)**:
    - HTML, CSS, JavaScript (ES6+)
    - WebExtensions API (for cross-browser compatibility: Chrome, Firefox, Edge)
    - UI Framework: No complex framework, vanilla JS with a focus on clean DOM manipulation for the sidebar and options page. Tailwind CSS for styling.
    - State Management: Simple event-driven state, `browser.storage.sync` for settings.
    - TTS: Browser's Web Speech API (`SpeechSynthesis`).
- **Backend**:
    - Python 3.9+
    - FastAPI framework
    - Gemini API Client: `google-genai` Python library
    - AI Models:
        - Primary: "gemini 2.5 flash preview 04-17" (Note: Actual API identifier might be `gemini-1.5-flash-latest` or a specific preview version string; to be confirmed during implementation)
        - Fallback: "gemini 2.0 flash lite" (Note: Actual API identifier for a lighter/cheaper model like `gemini-pro` or a future light flash model; to be confirmed)
- **Database**:
    - Not applicable for the backend (stateless).
    - Browser Local Storage (`browser.storage.local`) for saving chat history on the client-side.
- **Deployment**:
    - Backend: Google Cloud Run (PaaS for serverless FastAPI deployment).
    - Frontend: Manual packaging and submission to browser extension stores (Chrome Web Store, Firefox Add-ons, Edge Add-ons).

## Project Scope
### In Scope
- Browser extension (Chrome, Firefox, Edge) with a sidebar interface.
- Sidebar activation via toolbar icon, context menu, and configurable keyboard shortcut.
- Extraction of webpage content (text, URL, title, key meta tags).
- Chat functionality: User input, sending context + query to backend, displaying Gemini's response.
- Gemini API integration via a FastAPI backend.
    - Logic to switch between "gemini 2.5 flash preview 04-17" and "gemini 2.0 flash lite" based on input token count (threshold: 200k tokens).
- Text-to-Speech (TTS) for answers using Web Speech API.
- Settings page for:
    - User to input and save their Gemini API key.
    - TTS settings: voice selection (from browser-available voices), speed (0.5x to 4x).
- Saving Q&A pairs to browser local storage (chat history).
- Displaying chat history within the extension.
- Clear error handling and user feedback.
- Responsive sidebar UI.

### Out of Scope
- User accounts or authentication beyond the API key.
- Syncing chat history across devices (history is local).
- Advanced content extraction (e.g., handling complex SPAs beyond initial load, PDF content).
- Support for browsers other than Chrome, Firefox, and Edge initially.
- Proactive suggestions or summaries without user queries.
- Complex backend data analysis or user analytics.
- Direct DOM manipulation of the host page beyond injecting the sidebar.

## Functional Requirements

### FR-EXT: Extension Core
- **FR-EXT.1:** The extension shall be installable on Google Chrome, Mozilla Firefox, and Microsoft Edge.
- **FR-EXT.2:** The extension icon shall be visible on the browser toolbar.
- **FR-EXT.3:** Clicking the toolbar icon shall toggle the visibility of the chat sidebar.
- **FR-EXT.4:** Right-clicking on a webpage shall present a context menu option to open/toggle the chat sidebar.
- **FR-EXT.5:** A user-configurable keyboard shortcut (default: Alt+S or Cmd+Shift+Y) shall toggle the visibility of the chat sidebar.
- **FR-EXT.6:** The sidebar shall be implemented as an iframe injected into the current webpage to ensure style isolation.

### FR-CHAT: Chat Interface & Functionality
- **FR-CHAT.1:** The sidebar shall display a chat interface with a text input field for user queries and an area for displaying conversation history (Q&A).
- **FR-CHAT.2:** When a user submits a query, the extension shall extract:
    - Current page URL.
    - Current page title (`document.title`).
    - Key meta tags (e.g., description, keywords).
    - Text content from the main body of the page (`document.body.innerText`).
- **FR-CHAT.3:** The extracted context and user query shall be sent to the backend API.
- **FR-CHAT.4:** The backend's response (answer from Gemini) shall be displayed in the chat interface.
- **FR-CHAT.5:** The chat interface shall clearly distinguish between user queries and AI responses.
- **FR-CHAT.6:** Users shall be able to clear the current chat conversation in the sidebar.

### FR-BACKEND: Backend API & Gemini Integration
- **FR-BACKEND.1:** The backend shall provide an API endpoint to receive webpage context and a user query.
- **FR-BACKEND.2:** The backend shall use the user-provided Gemini API key (forwarded securely from the extension) to authenticate with the Gemini API.
- **FR-BACKEND.3:** The backend shall structure the prompt for the Gemini API, including the webpage context and user query, to elicit relevant answers. (Suggested structure: Labeled sections for URL, Title, Meta, Content, and User Query).
- **FR-BACKEND.4:** The backend shall primarily use the "gemini 2.5 flash preview 04-17" model.
- **FR-BACKEND.5:** If the estimated input token count (context + query) exceeds 200,000 tokens, the backend shall switch to the "gemini 2.0 flash lite" model for that request.
- **FR-BACKEND.6:** The backend shall return the Gemini API's response to the extension.
- **FR-BACKEND.7:** The backend shall handle API errors from Gemini gracefully and return appropriate error messages.
- **FR-BACKEND.8:** The Python code for Gemini integration will follow the structure:
  ```python
  # Note: GEMINI_API_KEY will be passed dynamically
  # Model name will be dynamic (primary/fallback)
  from google import genai

  # Client initialization will occur once, or be managed per-request contextually
  # client = genai.Client(api_key="USER_PROVIDED_GEMINI_API_KEY")

  # response = client.models.generate_content(
  #     model="[dynamic_model_name]", # e.g., "gemini 2.5 flash preview 04-17" or "gemini 2.0 flash lite"
  #     contents=[structured_prompt_with_context_and_query]
  # )
  # return response.text
  ```

### FR-TTS: Text-to-Speech
- **FR-TTS.1:** An option (e.g., a speaker icon next to AI responses) shall allow users to trigger TTS for an answer.
- **FR-TTS.2:** TTS shall use the browser's Web Speech API (`SpeechSynthesis`).
- **FR-TTS.3:** Users shall be able to select the TTS voice from the list of available voices in their browser via the settings page.
- **FR-TTS.4:** Users shall be able to adjust the TTS speed (e.g., 0.5x, 1x, 1.5x, 2x, up to a practical limit like 4x) via the settings page. The selected speed will apply to all subsequent TTS playback.
- **FR-TTS.5:** TTS playback should be pausable/stoppable.

### FR-SETTINGS: Extension Settings
- **FR-SETTINGS.1:** The extension shall provide an options/settings page accessible via the browser's extension management area or a link in the sidebar.
- **FR-SETTINGS.2:** On the settings page, users shall be able to input and save their Gemini API key.
- **FR-SETTINGS.3:** The API key shall be stored securely using `browser.storage.sync`.
- **FR-SETTINGS.4:** On the settings page, users shall be able to configure TTS voice and speed preferences. These settings shall be stored using `browser.storage.sync`.
- **FR-SETTINGS.5:** The extension shall provide clear instructions on how to obtain a Gemini API key.

### FR-HISTORY: Chat History
- **FR-HISTORY.1:** Each Q&A pair (user query + AI response + source URL/title) shall be automatically saved to the browser's local storage (`browser.storage.local`).
- **FR-HISTORY.2:** The extension sidebar shall have a dedicated "History" tab/section to view saved Q&A pairs.
- **FR-HISTORY.3:** Users shall be able to clear individual history items or the entire chat history.
- **FR-HISTORY.4:** History items should be timestamped.

### FR-ERROR: Error Handling
- **FR-ERROR.1:** If the Gemini API key is missing or invalid, the extension shall display a clear message prompting the user to check their settings.
- **FR-ERROR.2:** Network errors or errors from the backend API shall be communicated clearly to the user within the sidebar.
- **FR-ERROR.3:** If webpage content cannot be extracted, a message shall inform the user.
- **FR-ERROR.4:** If content is truncated due to length, the user should be subtly informed.

## Non-Functional Requirements (NFR)
- **7.1. Performance:**
    - Sidebar should load quickly (<2 seconds).
    - Content extraction should not noticeably slow down page rendering.
    - API response time (excluding Gemini processing time) should be <500ms.
- **7.2. Scalability (Backend):**
    - The backend deployed on Google Cloud Run should scale automatically based on request load, including scaling to zero.
- **7.3. Usability:**
    - The interface should be intuitive and require minimal learning.
    - Settings should be easy to find and understand.
    - Feedback for all user actions should be clear and immediate.
- **7.4. Security:**
    - The Gemini API key must be handled securely, transmitted over HTTPS to the backend, and not exposed in client-side code accessible to the webpage.
    - The backend should not store API keys.
    - Content scripts should be minimally privileged and carefully sandboxed if interacting with page DOM directly. Using an iframe for the sidebar helps.
- **7.5. Compatibility:**
    - The extension must function correctly on the latest stable versions of Google Chrome, Mozilla Firefox, and Microsoft Edge.
- **7.6. Maintainability:**
    - Code should be modular, well-commented, and follow DRY/KISS principles.
    - Configuration (e.g., API endpoints, default settings) should be centralized.
- **7.7. Accessibility:**
    - Sidebar UI should adhere to WCAG 2.1 Level AA guidelines where feasible (e.g., color contrast, keyboard navigation).
    - TTS feature enhances accessibility.

## Project Structure
```
project-root/
├── extension/
│   ├── manifest.json
│   ├── icons/
│   │   ├── icon-16.png
│   │   ├── icon-48.png
│   │   └── icon-128.png
│   ├── background/
│   │   └── service-worker.js  # (Manifest V3) or background.js (Manifest V2)
│   ├── content/
│   │   └── content_script.js  # Injects sidebar iframe, listens for messages
│   ├── sidebar/
│   │   ├── sidebar.html
│   │   ├── sidebar.js
│   │   └── sidebar.css
│   ├── options/
│   │   ├── options.html
│   │   ├── options.js
│   │   └── options.css
│   └── common/
│       └── storage.js         # Utilities for browser.storage
│       └── api_client.js      # Handles communication with backend
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py            # FastAPI app definition, middleware
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   └── v1/
│   │   │       ├── __init__.py
│   │   │       └── endpoints/
│   │   │           ├── __init__.py
│   │   │           └── chat.py    # Chat endpoint logic
│   │   │       └── schemas.py   # Pydantic models for API requests/responses
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   ├── config.py      # Environment variables, settings
│   │   │   └── gemini_client.py # Logic for Gemini API interaction, model switching
│   │   └── services/
│   │       ├── __init__.py
│   │       └── content_processor.py # Text processing, token estimation
│   ├── .env.example           # Example environment variables
│   ├── Dockerfile             # For containerizing the backend
│   ├── requirements.txt
│   └── tests/                 # Unit and integration tests
├── .gitignore
├── README.md
├── CHANGELOG.md
└── scripts/
    └── generate_assets.js     # (Optional) Script for generating icons if needed
```

## Implementation Plan

This section outlines the implementation plan, including phases and tasks. MCP servers are integrated to guide the development process.

### Phase 1: Setup & Foundation (1 week)
- **Task 1.1: Project Setup**
    - Initialize Git repository.
    - Set up project structure (folders as defined above).
    - `sequentialthinking_clear_thought`: Break down initial setup into atomic steps (repo init, folder creation, basic file stubs).
- **Task 1.2: Backend (FastAPI) Basic Setup**
    - Create FastAPI application skeleton (`main.py`).
    - Define basic health check endpoint.
    - Set up `requirements.txt` (FastAPI, Uvicorn, python-dotenv, google-genai).
    - Create `.env.example` for `GEMINI_API_KEY`.
    - `designpattern_clear_thought`: Apply Modular Architecture for backend structure (api, core, services).
- **Task 1.3: Extension Basic Setup (Manifest V3)**
    - Create `manifest.json` with basic permissions (activeTab, storage, contextMenus, scripting).
    - Set up `service-worker.js` for background tasks (e.g., context menu creation, toolbar icon click).
    - Create placeholder `sidebar.html`, `options.html`.
    - `mentalmodel_clear_thought`: Use First Principles Thinking to determine minimal manifest permissions.
- **Task 1.4: Initial Backend-Extension Communication Test**
    - Implement a simple message passing from extension to a test backend endpoint and back.
    - `debuggingapproach_clear_thought`: Use Divide and Conquer to test extension-backend link independently.

### Phase 2: Core Chat Functionality (3 weeks)
- **Task 2.1: Sidebar UI Implementation**
    - Develop `sidebar.html` structure and `sidebar.css` (Tailwind CSS) for chat interface (input, message display area).
    - Implement `sidebar.js` for basic DOM manipulation and event handling.
    - `visualreasoning_clear_thought`: Sketch UI layouts and user flows for the sidebar.
- **Task 2.2: Content Extraction**
    - Implement `content_script.js` to extract URL, title, meta tags, and `document.body.innerText`.
    - `context7_clear_thought`: Research best practices for robust `innerText` extraction and handling SPAs (initial focus on static content).
- **Task 2.3: Backend Gemini Integration**
    - Implement `gemini_client.py` to:
        - Initialize Gemini client with user-provided key (passed from extension).
        - Construct prompts using structured context.
        - Call `client.models.generate_content` with "gemini 2.5 flash preview 04-17".
        - Handle API responses and errors.
    - Implement `chat.py` endpoint in FastAPI.
    - `programmingparadigm_clear_thought`: Use Functional Programming principles for prompt construction and data transformation if suitable.
- **Task 2.4: Full Chat Loop**
    - Connect sidebar input to content script, to service worker, to backend API, and display response in sidebar.
    - `sequentialthinking_clear_thought`: Map the entire data flow for a single chat message.
- **Task 2.5: Gemini Model Switching Logic (Backend)**
    - Implement token estimation (e.g., characters/N as proxy, or a lightweight tokenizer).
    - Implement logic in `gemini_client.py` to switch to "gemini 2.0 flash lite" if token count > 200k.
    - `decisionframework_clear_thought`: Evaluate trade-offs of different token estimation methods (accuracy vs. performance).

### Phase 3: Settings & TTS (2 weeks)
- **Task 3.1: Options Page UI & API Key Management**
    - Develop `options.html`, `options.css` (Tailwind CSS), `options.js`.
    - Implement input for Gemini API key and saving to `browser.storage.sync`.
    - Load and use API key in service worker for backend requests.
    - `designpattern_clear_thought`: Apply State Management patterns for handling API key across extension components.
- **Task 3.2: TTS Implementation**
    - Add TTS controls to the chat interface (play button per message).
    - Implement TTS using Web Speech API in `sidebar.js`.
    - `metacognitivemonitoring_clear_thought`: Assess certainty about Web Speech API compatibility and voice availability across target browsers.
- **Task 3.3: TTS Settings**
    - Add voice selection (dynamic dropdown from `speechSynthesis.getVoices()`) and speed control (slider) to `options.html`.
    - Save TTS settings to `browser.storage.sync` and apply them in `sidebar.js`.
    - `collaborativereasoning_clear_thought`: Imagine different user personas (e.g., visually impaired, fast reader) to design useful TTS settings.

### Phase 4: Advanced Features & Polishing (2 weeks)
- **Task 4.1: Chat History**
    - Implement saving Q&A pairs (with URL, title, timestamp) to `browser.storage.local`.
    - Create a "History" view/tab in `sidebar.html` to display and manage history.
    - Add functionality to clear history.
    - `mentalmodel_clear_thought`: Apply Rubber Duck Debugging while working through data persistence logic for history.
- **Task 4.2: Sidebar Activation Methods**
    - Implement context menu item in `service-worker.js`.
    - Define command for keyboard shortcut in `manifest.json` and listener in `service-worker.js`.
    - `scientificmethod_clear_thought`: Test each activation method systematically across browsers.
- **Task 4.3: UI/UX Refinements & Error Handling**
    - Improve visual design, add loading indicators, smooth transitions.
    - Implement comprehensive user-friendly error messages for all anticipated issues.
    - `designpattern_clear_thought`: Review UI for consistency and apply UI/UX best practices (clarity, feedback).
- **Task 4.4: Cross-Browser Testing & Adjustments**
    - Test thoroughly on latest Chrome, Firefox, Edge.
    - Address any browser-specific quirks.
    - `debuggingapproach_clear_thought`: Use Cause Elimination when diagnosing browser-specific bugs.

### Phase 5: Testing, Documentation & Deployment (2 weeks)
- **Task 5.1: Backend Testing & Dockerization**
    - Write unit tests for FastAPI backend (Pytest).
    - Create `Dockerfile` for backend deployment.
    - `programmingparadigm_clear_thought`: Use Imperative Programming for test scripts and Dockerfile instructions.
- **Task 5.2: Backend Deployment to Google Cloud Run**
    - Set up Google Cloud Project, enable Cloud Run and related APIs.
    - Deploy the containerized backend.
    - `context7_clear_thought`: Consult Google Cloud Run documentation for FastAPI deployment.
- **Task 5.3: Final Extension Testing**
    - End-to-end testing of all features.
    - Test performance and stability.
    - `structuredargumentation_clear_thought`: Argue for/against specific test cases to ensure coverage.
- **Task 5.4: Documentation**
    - Create `README.md` (overview, setup, usage, API key instructions, troubleshooting).
    - Create `CHANGELOG.md`.
    - Add inline code comments.
    - `dateandtime_clear_thought` (`getCurrentDateTime_node` tool): Add "Last Updated" timestamp to README.md.
- **Task 5.5: Packaging & Preparation for Submission**
    - Package the extension for Chrome Web Store, Firefox Add-ons, Edge Add-ons.
    - Prepare store listing materials (description, screenshots, privacy policy).
    - `sequentialthinking_clear_thought`: Create a checklist for submission to each browser store.

## API Endpoints (Backend - FastAPI)
- `POST /api/v1/chat`
    - **Description**: Receives webpage context and user query, interacts with Gemini API, and returns the AI's response.
    - **Request Body** (JSON):
        ```json
        {
            "apiKey": "USER_GEMINI_API_KEY",
            "query": "User's question string",
            "context": {
                "url": "string",
                "title": "string",
                "metaDescription": "string (optional)",
                "metaKeywords": "string (optional)",
                "pageText": "string (potentially large)"
            }
        }
        ```
    - **Response Body (Success - 200 OK)** (JSON):
        ```json
        {
            "answer": "AI's response string"
        }
        ```
    - **Response Body (Error - 4xx/5xx)** (JSON):
        ```json
        {
            "detail": "Error message string"
        }
        ```
- `GET /health`
    - **Description**: Health check endpoint.
    - **Response Body (Success - 200 OK)** (JSON):
        ```json
        {
            "status": "ok"
        }
        ```

## Data Models (Pydantic Schemas for Backend)
### ChatRequest
```python
from pydantic import BaseModel, HttpUrl
from typing import Optional

class PageContext(BaseModel):
    url: HttpUrl
    title: str
    metaDescription: Optional[str] = None
    metaKeywords: Optional[str] = None
    pageText: str

class ChatRequest(BaseModel):
    apiKey: str
    query: str
    context: PageContext
```

### ChatResponse
```python
from pydantic import BaseModel

class ChatResponse(BaseModel):
    answer: str
```

### ErrorResponse
```python
from pydantic import BaseModel

class ErrorResponse(BaseModel):
    detail: str
```

## Environment Variables
```
# Required environment variables for the backend (.env file for local development)
# For Google Cloud Run, these will be set in the service configuration.

# GEMINI_API_KEY= # This is NOT set on the server; it's passed by the client per request.
# However, the backend might need its own operational configs if any.
# For now, the primary dynamic variable is the user's API key passed in request body.

# Optional:
LOG_LEVEL=INFO # Logging level for the backend (e.g., INFO, DEBUG)
PRIMARY_GEMINI_MODEL="gemini 2.5 flash preview 04-17" # Or actual API string
FALLBACK_GEMINI_MODEL="gemini 2.0 flash lite" # Or actual API string
TOKEN_THRESHOLD_FOR_FALLBACK=200000 # Token count to trigger fallback model
```
**Note for AI Code Assistant**: The Gemini API key is provided by the user and sent with each request from the extension to the backend. The backend itself does not store a global API key via environment variables for accessing Gemini on behalf of all users.

## Testing Strategy
- **Unit Tests (Backend)**: Pytest will be used to test individual functions and classes in the FastAPI backend, especially business logic in `gemini_client.py`, `content_processor.py`, and API endpoint handlers. Mocking will be used for external dependencies like the Gemini API.
- **Integration Tests (Backend)**: Test interactions between components of the backend (e.g., API endpoint to service layer).
- **E2E Tests (Extension)**: Manually test the full user flow: opening sidebar, extracting content, sending query, receiving response, TTS, settings changes, history. Automated E2E tests (e.g., using Puppeteer or Playwright) could be a future enhancement.
- **Cross-Browser Testing**: Manually test all functionalities on the latest versions of Chrome, Firefox, and Edge.
- **User Acceptance Testing (UAT)**: (Self-UAT) Go through common use cases as if you were a new user.

## Deployment Strategy
- **Backend (FastAPI)**:
    - Containerize the FastAPI application using Docker.
    - Push the Docker image to Google Container Registry (GCR).
    - Deploy to Google Cloud Run from the GCR image.
    - Configure environment variables (model names, token threshold) in Cloud Run service settings.
    - Set up continuous deployment (CD) via GitHub Actions (or similar) to automatically build and deploy on pushes to the main branch (Future Enhancement).
- **Frontend (Browser Extension)**:
    - Manually package the `extension/` directory into a .zip file.
    - Submit the packaged extension to:
        - Chrome Web Store
        - Mozilla Add-ons (AMO)
        - Microsoft Edge Add-ons
    - Follow each store's review process and guidelines.

## Maintenance Plan
- **Monitoring**: Monitor Google Cloud Run for backend errors and performance.
- **Updates**:
    - Regularly update dependencies (Python packages, browser extension APIs).
    - Adapt to changes in Gemini API, if any.
    - Address bugs reported by users or found during testing.
- **Browser Compatibility**: Periodically test on new browser versions to ensure continued compatibility.
- **Feedback Loop**: Collect user feedback for bug fixes and future enhancements.

## Risks and Mitigations
| Risk                                       | Impact | Likelihood | Mitigation                                                                                                                              |
|--------------------------------------------|--------|------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| Changes to Gemini API                      | High   | Medium     | Regularly review Gemini API documentation. Design `gemini_client.py` to be modular for easier updates. Have fallback logic or error messages. |
| Gemini API Costs for Users                 | Medium | Medium     | Clearly communicate that users need their own API key and are responsible for costs. Provide info on monitoring usage.                      |
| Inconsistent Content Extraction            | Medium | Medium     | Start with `innerText`, refine based on testing. Clearly state limitations (e.g., complex SPAs might not fully work).                       |
| Browser API/Manifest Changes               | Medium | Low        | Stay updated with browser release notes. Test on beta/dev channels.                                                                     |
| Rejection from Extension Stores            | Medium | Medium     | Carefully review store policies (especially regarding permissions, API key handling, and user data). Provide clear privacy policy.          |
| Performance Issues with Large Webpages     | Medium | Medium     | Implement content truncation. Optimize content script. Inform user if content is too large. Backend handles token limits for Gemini.        |
| Security of User's API Key                 | High   | Low        | Ensure HTTPS for backend. API key passed in request body, not stored long-term by backend. Advise users on API key security best practices. |
| Variations in Web Speech API (TTS)         | Low    | Medium     | Test across browsers. Allow voice selection. Gracefully degrade if API is unavailable.                                                    |

## Future Enhancements
- Advanced content extraction (e.g., summarization pre-processing for very long texts, specific element selection).
- Support for interacting with PDF content if viewed in browser.
- User-configurable prompt templates.
- Option to choose from more Gemini models if available/applicable.
- Basic analytics on feature usage (opt-in and anonymized).
- Internationalization (i18n) and Localization (l10n) for the UI.
- Automated E2E testing framework.
- CI/CD pipeline for both backend and extension packaging.

## Development Guidelines

### Code Quality & Design Principles
- Follow industry-standard coding best practices (clean code, modularity, error handling, security, scalability).
- Apply SOLID, DRY (via abstraction), and KISS principles.
- Design modular, reusable components/functions.
- Optimize for code readability and maintainable structure.
- Add concise, useful function-level comments.
- Implement comprehensive error handling (try-catch, custom errors, async handling).

### Frontend Development
- Provide modern, clean, professional, and intuitive UI designs using Tailwind CSS.
- Adhere to UI/UX principles (clarity, consistency, simplicity, feedback, accessibility/WCAG).
- Use vanilla JavaScript for DOM manipulation and event handling to keep the extension lightweight.

### Data Handling & APIs
- Integrate with real, live data sources and APIs as specified (Gemini API).
- Prohibit placeholder, mock, or dummy data/API responses in the final code.
- The Gemini API key is user-provided; accept it exclusively via the settings page and pass it with requests. Do not hardcode or store it globally in the backend.
- Use `.env` files for local backend secrets/config with a template `.env.example` file.
- Centralize the backend API endpoint URL in a single location within the extension's code (e.g., a constants module or environment variable for the extension build process if applicable, though likely a config constant).
- Never hardcode API endpoint URLs directly in service/component files if they are subject to change.

### Asset Generation
- Do not use placeholder images or icons. Icons are provided in `extension/icons/`.
- If new graphics are needed, create them as SVG and convert to PNG using a library like `sharp` via a build script (e.g., `scripts/generate_assets.js` if Node.js is used for scripting).
- Reference only the generated PNG files within the application code.

### Documentation Requirements
- Create a comprehensive `README.md` including project overview, setup instructions (for extension and backend development), usage guide, how to get & use Gemini API key, troubleshooting tips, and other essential information. Include "Last Updated" timestamp.
- Maintain a `CHANGELOG.md` to document changes using semantic versioning.
- Document required API keys/credentials clearly (i.e., user needs their own Gemini key).
- Ensure all documentation is well-written, accurate, and reflects the final code.

## Tool Usage Instructions (For AI Code Assistant)

### MCP Servers and Tools
- Use the `context7` MCP server to gather contextual information about the current task, including relevant libraries (WebExtensions API, FastAPI, google-genai), frameworks, and APIs.
- Use the `clear_thought` MCP servers for various problem-solving approaches:
    - `mentalmodel_clear_thought`: For applying structured problem-solving approaches (First Principles Thinking, Opportunity Cost Analysis, Error Propagation Understanding, Rubber Duck Debugging, Pareto Principle, Occam's Razor) during development, especially when tackling complex logic like content extraction or API integration.
    - `designpattern_clear_thought`: For applying software architecture and implementation patterns (Modular Architecture for backend/frontend, API Integration Patterns, State Management for settings, Asynchronous Processing for API calls, Scalability Considerations for backend, Security Best Practices for API key handling).
    - `programmingparadigm_clear_thought`: For applying different programming approaches (Imperative for scripting/setup, Procedural for simple sequences, Object-Oriented for structuring backend services or complex UI components, Functional for data transformations/prompts, Event-Driven for UI interactions and extension messaging).
    - `debuggingapproach_clear_thought`: For systematic debugging (Binary Search for isolating issues in data flow, Reverse Engineering for understanding unexpected API behavior, Divide and Conquer for breaking down complex bugs, Cause Elimination for browser-specific issues).
    - `collaborativereasoning_clear_thought`: For simulating expert collaboration, e.g., when designing UI/UX for settings or TTS, consider different user perspectives (accessibility, technical proficiency).
    - `decisionframework_clear_thought`: For structured decision analysis, e.g., choosing token estimation methods, selecting specific CSS utility classes, or evaluating error handling strategies.
    - `metacognitivemonitoring_clear_thought`: For tracking knowledge boundaries and reasoning quality, e.g., when unsure about a browser API's specific behavior or a Gemini model's limitations, explicitly state uncertainty and plan for verification.
    - `scientificmethod_clear_thought`: For applying formal scientific reasoning, e.g., when testing hypotheses about performance bottlenecks or effectiveness of different prompt structures.
    - `structuredargumentation_clear_thought`: For dialectical reasoning, e.g., weighing pros and cons of different storage solutions (`local` vs. `sync` for different types of data).
    - `visualreasoning_clear_thought`: For visual thinking, e.g., diagramming data flows between extension components and backend, or sketching UI layouts.
    - `sequentialthinking_clear_thought`: For breaking down complex features (like the full chat loop or history implementation) into manageable, ordered tasks.
- Use the date and time MCP server:
    - Use `getCurrentDateTime_node` tool to get the current date and time in UTC format.
    - Add last updated date and time in UTC format to the `README.md` file.
- Use the `websearch` tool to find information on the internet when needed (e.g., specific API documentation, browser compatibility details, troubleshooting common errors).

### System & Environment Considerations
- Target system for AI Code Assistant's generated commands: Windows 11 Home Single Language 23H2.
- Use semicolon (`;`) as the command separator in PowerShell commands, not `&&`.
- Use `New-Item -ItemType Directory -Path "path1", "path2", ... -Force` for creating directories in PowerShell.
- Use language-native path manipulation libraries (e.g., Node.js `path` for any build scripts, Python `os.path` or `pathlib` for backend) for robust path handling.
- Use package manager commands (e.g., `npm install`, `pip install`) via the `launch-process` tool to add dependencies; do not edit `package.json` or `requirements.txt` directly unless explicitly instructed for initial setup.

### Error Handling & Debugging by AI Code Assistant
- First attempt to resolve errors autonomously using available tools and reasoning (MCP servers).
- Perform systematic debugging: consult web resources (`websearch`), official documentation, modify code based on error messages, adjust configuration, retry operations.
- Report back to the user only if an insurmountable blocker persists after exhausting all self-correction efforts.

## Conclusion
This masterplan outlines the development of a Contextual Web Page Chat Assistant. By following this plan, leveraging the specified tools, and adhering to the development guidelines, we can create a valuable and robust product. The key focus will be on a seamless user experience, reliable backend processing with Gemini, and useful features like TTS and chat history.
```