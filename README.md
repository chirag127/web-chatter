# WebChat-Secure-RealTime-Messaging-Browser-Extension

[![Build Status](https://img.shields.io/github/actions/workflow/status/chirag127/WebChat-Secure-RealTime-Messaging-Browser-Extension/ci.yml?style=flat-square)](https://github.com/chirag127/WebChat-Secure-RealTime-Messaging-Browser-Extension/actions/workflows/ci.yml)
[![Coverage](https://img.shields.io/codecov/c/github/chirag127/WebChat-Secure-RealTime-Messaging-Browser-Extension?style=flat-square)](https://codecov.io/github/chirag127/WebChat-Secure-RealTime-Messaging-Browser-Extension)
[![Tech Stack](https://img.shields.io/badge/TS%7CVite%7CTailwindCSS-brightgreen?style=flat-square)](https://github.com/chirag127/WebChat-Secure-RealTime-Messaging-Browser-Extension)
[![Linting](https://img.shields.io/badge/Biome-5639CA?style=flat-square)](https://biomejs.dev/)
[![License](https://img.shields.io/badge/License-CC%20BY--NC%204.0-orange?style=flat-square)](https://github.com/chirag127/WebChat-Secure-RealTime-Messaging-Browser-Extension/blob/main/LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/chirag127/WebChat-Secure-RealTime-Messaging-Browser-Extension?style=flat-square)](https://github.com/chirag127/WebChat-Secure-RealTime-Messaging-Browser-Extension)

A secure, real-time messaging browser extension for seamless, private communication on any webpage. Engineered for speed and privacy with React, Vite, and TypeScript, it provides the ultimate chat layer for the modern web.

## ⭐ Star ⭐ This Repo

If you find this project valuable, please consider starring it on GitHub!

---

## 🚀 Project Overview

**WebChat-Secure-RealTime-Messaging-Browser-Extension** enhances web browsing by enabling secure, end-to-end encrypted, real-time messaging directly within your browser. Communicate privately on any webpage without context switching, leveraging a robust architecture built for performance and privacy.

## 🏛️ Architecture

mermaid
graph TD
    A[Browser Environment]
    B(Content Script)
    C(Background Script)
    D(UI Popup/Overlay)
    E(Web Extension API)
    F(WebSocket Server)
    G(End-to-End Encryption Module)

    A --> B
    B --> D
    B --> E
    C --> E
    E --> C
    E --> B
    D --> E
    C --> F
    B --> G
    G --> B
    F --> G


## 🧭 Table of Contents

*   [🚀 Project Overview](#-project-overview)
*   [🏛️ Architecture](#️-architecture)
*   [📦 Key Features](#-key-features)
*   [🛠️ Tech Stack](#️-tech-stack)
*   [💡 AI Agent Directives](#-ai-agent-directives)
*   [🔧 Development Setup](#-development-setup)
*   [📜 Scripts](#-scripts)
*   [🛡️ Principles](#-principles)
*   [🤝 Contributing](#-contributing)
*   [⚖️ License](#️-license)

---

## 📦 Key Features

*   **Secure Real-Time Messaging:** End-to-end encrypted communication using WebSockets.
*   **Cross-Webpage Integration:** Seamlessly chat without leaving your current tab.
*   **Privacy-Focused Design:** Minimal data collection, maximum user privacy.
*   **Modern Tech Stack:** Built with TypeScript, Vite, and React for optimal performance.
*   **Cross-Browser Compatibility:** Supports Chrome and Firefox.

---

## 🛠️ Tech Stack

*   **Core:** TypeScript 6.x, Vite 7 (Rolldown), React 20
*   **Styling:** TailwindCSS v4
*   **Extension Framework:** WXT (Web Extension Toolkit)
*   **State Management:** Signals
*   **Linting & Formatting:** Biome
*   **Testing:** Vitest (Unit), Playwright (E2E)
*   **Architecture:** Feature-Sliced Design (FSD)

---

## 🤖 AI Agent Directives

<details>
<summary>Click to expand AI Agent Directives</summary>

## 1. IDENTITY & PRIME DIRECTIVE (DECEMBER 2025 EDITION)

*   **Role:** Senior Principal Software Architect, Master Technical Copywriter.
*   **Experience:** 40+ years, FAANG-level standards.
*   **Context:** Current Date: December 2025. Building for 2026.
*   **Output Standard:** EXECUTION-ONLY.
*   **Philosophy:** "Zero-Defect, High-Velocity, Future-Proof."

## 2. INPUT PROCESSING & COGNITION

*   **Speech-to-Text Interpretation:** Strictly forbidden from executing literal typos. Infer technical intent semantically.
*   **SSOT:** `README.md` is the Single Source of Truth.
*   **MCP Instrumentation:** Use `linkup`/`brave` for research, `docfork` for API validation, `clear-thought-two` for complex flows.

## 3. CONTEXT-AWARE APEX TECH STACKS (LATE 2025 STANDARDS)

*   **SCENARIO A: WEB / APP / EXTENSION (TypeScript)**
    *   **Stack:** TypeScript 6.x, Vite 7 (Rolldown), Tauri v2.x (Native), **WXT** (Extensions).
    *   **State:** Signals (Standardized).
    *   **Lint/Test:** Biome (Speed), Vitest (Unit), Playwright (E2E).

## 4. AI ORCHESTRATION & GEMINI PROTOCOL (DECEMBER 2025)

*   **Fallback Cascade:** `gemini-3-pro` -> `gemini-2.5-pro` -> `gemini-2.5-flash` -> `gemini-2.5-flash-lite`.
*   **Circuit Breaker:** Trigger "Cool-Off" and fallback on 429/500 errors.
*   **Local AI Emulation:** Utilize Mock AI APIs.

**Specifics for WebChat-Secure-RealTime-Messaging-Browser-Extension:**

*   **Tech Stack Adherence:** Strictly use the specified TypeScript, Vite, WXT, Biome, Vitest, and Playwright toolchain.
*   **Testing:** All new code must include comprehensive unit tests (Vitest) and end-to-end tests (Playwright).
*   **Linting:** All code must pass Biome checks.
*   **AI Integration:** If AI features are implemented, adhere to the Gemini Protocol for API calls.

</details>

---

## 🔧 Development Setup

1.  **Clone the repository:**
    bash
    git clone https://github.com/chirag127/WebChat-Secure-RealTime-Messaging-Browser-Extension
    cd WebChat-Secure-RealTime-Messaging-Browser-Extension
    

2.  **Install dependencies:**
    bash
    # Using uv (Python package manager, if applicable for build tools)
    # For Node.js dependencies, npm/yarn/pnpm are typically used by Vite/WXT
    # This example assumes Node.js dependencies managed by Vite/WXT
    npm install
    

3.  **Run development server:**
    bash
    npm run dev
    

4.  **Load extension in browser:** Follow instructions for your browser (Chrome/Firefox) to load the unpacked extension from the `dist` directory.

---

## 📜 Scripts

| Script         | Description                                                    |
| -------------- | -------------------------------------------------------------- |
| `dev`          | Run the development server and watch for changes.              |
| `build`        | Build the extension for production.                            |
| `lint`         | Run Biome to lint and format the codebase.                     |
| `test:unit`    | Run Vitest for unit tests.                                     |
| `test:e2e`     | Run Playwright for end-to-end tests.                           |
| `test`         | Run all tests (unit and e2e).                                  |

---

## 🛡️ Principles

*   **SOLID:** Ensure high cohesion and low coupling.
*   **DRY:** Don't Repeat Yourself. Abstract common logic.
*   **YAGNI:** You Ain't Gonna Need It. Implement only necessary features.
*   **Privacy-First:** Every design decision prioritizes user data protection.
*   **Performance:** Optimize for speed and resource efficiency.

---

## 🤝 Contributing

Contributions are welcome! Please refer to the [CONTRIBUTING.md](https://github.com/chirag127/WebChat-Secure-RealTime-Messaging-Browser-Extension/blob/main/.github/CONTRIBUTING.md) file for guidelines on how to submit pull requests and report issues.

## ⚖️ License

This project is licensed under the **Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)** license. See the [LICENSE](https://github.com/chirag127/WebChat-Secure-RealTime-Messaging-Browser-Extension/blob/main/LICENSE) file for details.
