# Changelog

All notable changes to the WebPage Chatter project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-05-17

### Added

- Initial release of WebPage Chatter
- Browser extension for Chrome, Firefox, and Edge
  - Multiple activation methods (toolbar icon, context menu, keyboard shortcut)
  - Responsive chat sidebar interface
  - Content extraction using Readability.js
  - Real-time communication with backend API
- FastAPI backend for Gemini API integration
  - Secure API key management
  - Intelligent model switching between "gemini 2.5 flash preview 04-17" and "gemini 2.0 flash lite"
  - Token estimation for optimal model selection
  - Error handling and graceful fallbacks
- Advanced features
  - Text-to-speech functionality with customizable voice settings
  - Chat history saving and management
  - Settings page for API key and TTS configuration
  - Automatic fallback to lighter Gemini model for large content
- Comprehensive documentation
  - Installation guides for both extension and backend
  - API documentation
  - User manual

### Security

- Secure handling of API keys via environment variables
- No storage of sensitive data in plaintext
- Content security policies implemented in extension

## [0.9.0] - 2025-05-10

### Added

- Beta release for internal testing
- Core functionality implementation
- Basic UI components

### Fixed

- Initial performance issues with large web pages
- Token estimation accuracy
- Cross-browser compatibility issues
