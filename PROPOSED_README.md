# WebChat: Secure Real-Time Messaging Browser Extension

<p align="center">
  <a href="#webchat-secure-real-time-messaging-browser-extension">
    <img src="https://raw.githubusercontent.com/chirag127/chirag127/main/assets/repository_specific/WebChat-Secure-RealTime-Messaging-Browser-Extension/WebChat-Hero-Banner.png" alt="WebChat Hero Banner"/>
  </a>
</p>

<p align="center">
    A secure, real-time messaging platform as a browser extension. Empowers seamless, private communication on any webpage, engineered for privacy, speed, and collaborative efficiency.
</p>

<p align="center">
    <a href="https://github.com/chirag127/WebChat-Secure-RealTime-Messaging-Browser-Extension/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/chirag127/WebChat-Secure-RealTime-Messaging-Browser-Extension/ci.yml?branch=main&style=flat-square&logo=githubactions&logoColor=white&label=Build" alt="Build Status"></a>
    <a href="https://codecov.io/gh/chirag127/WebChat-Secure-RealTime-Messaging-Browser-Extension"><img src="https://img.shields.io/codecov/c/github/chirag127/WebChat-Secure-RealTime-Messaging-Browser-Extension?style=flat-square&logo=codecov&logoColor=white&token=YOUR_CODECOV_TOKEN" alt="Code Coverage"></a>
    <a href="#"><img src="https://img.shields.io/badge/Tech-React%20%7C%20Vite%20%7C%20TS-blue?style=flat-square&logo=react" alt="Tech Stack"></a>
    <a href="#"><img src="https://img.shields.io/badge/Lint-Biome-orange?style=flat-square&logo=biome" alt="Linting & Formatting"></a>
    <a href="https://github.com/chirag127/WebChat-Secure-RealTime-Messaging-Browser-Extension/blob/main/LICENSE"><img src="https://img.shields.io/github/license/chirag127/WebChat-Secure-RealTime-Messaging-Browser-Extension?style=flat-square&color=blueviolet" alt="License"></a>
    <a href="https://github.com/chirag127/WebChat-Secure-RealTime-Messaging-Browser-Extension/stargazers"><img src="https://img.shields.io/github/stars/chirag127/WebChat-Secure-RealTime-Messaging-Browser-Extension?style=flat-square&logo=github&logoColor=white&label=Stars" alt="GitHub Stars"></a>
</p>

<p align="center">
  <a href="https://github.com/chirag127/WebChat-Secure-RealTime-Messaging-Browser-Extension/stargazers"><strong>Star ⭐ this Repo</strong></a> to support its development!
</p>

---

## 🚀 The Mission

WebChat provides a secure and ephemeral communication layer directly within your browser. It injects a high-performance chat interface onto any webpage, allowing for real-time, end-to-end encrypted conversations without ever leaving your current context.

This project is engineered using a modern, type-safe stack (Vite, React, TypeScript) and follows the **Feature-Sliced Design (FSD)** architecture for maximum scalability and maintainability, ensuring a robust and developer-friendly codebase.

## 🏛️ Architecture: Feature-Sliced Design (FSD)

The codebase is structured for scalability and clear separation of concerns. FSD organizes code by business-domain slices, making features modular, independent, and easy to manage.

sh
src/
├── app/                 # App-wide setup, providers, routing
├── processes/           # Complex multi-page scenarios (e.g., auth flow)
├── pages/               # Compositional layer for pages
├── features/            # Business logic features (e.g., send-message, user-profile)
├── entities/            # Business entities (e.g., User, Message)
├── widgets/             # Compositional UI blocks (e.g., ChatWindow, Header)
└── shared/              # Reusable modules, UI-kit, libs, APIs
    ├── api/             # API client instances and requests
    ├── config/          # Global configuration
    ├── lib/             # Helper functions and hooks
    └── ui/              # Generic UI components (Button, Input)


## 📜 Table of Contents

- [🚀 The Mission](#-the-mission)
- [🏛️ Architecture: Feature-Sliced Design (FSD)](#️-architecture-feature-sliced-design-fsd)
- [🤖 AI Agent Directives](#-ai-agent-directives)
- [🛠️ Development & Setup](#️-development--setup)
- [📦 Scripts](#-scripts)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)


## 🤖 AI Agent Directives

<details>
<summary><strong>SYSTEM: APEX TECHNICAL AUTHORITY (DECEMBER 2025) - Click to Expand</strong></summary>

### 1. IDENTITY & PRIME DIRECTIVE
**Role:** You are a Senior Principal Software Architect operating under 2026 standards.
**Context:** Current Date is **December 2025**.
**Philosophy:** "Zero-Defect, High-Velocity, Future-Proof."

### 2. CONTEXT-AWARE APEX TECH STACK (WEB EXTENSION)
*   **Stack:** **TypeScript 6.x** (Strict), **Vite 7** (Rolldown), **React 20** (with Signals).
*   **Framework:** **WXT** (Web Extensions Toolkit) for robust, cross-browser extension development.
*   **State Management:** Standardized **Signals** for granular and performant state updates.
*   **Styling:** **Tailwind CSS v4** for utility-first styling.
*   **Lint/Test/Format:** **Biome** (Unified Toolchain) + **Vitest** (Unit/Integration) + **Playwright** (E2E).

### 3. RECURSIVE PERFECTION LOOP (THE "ZERO-ERROR" MANDATE)
**The Loop:**
1.  **Analyze:** Scan the codebase (`src/`).
2.  **Fix:** Apply architectural patterns (SOLID, FSD).
3.  **Lint/Format:** Run `npm run lint` (`biome check --apply`).
4.  **Test:** Run the test suite (`npm test` -> `vitest run`).
5.  **DECISION GATE:**
    *   **IF** Errors/Warnings exist -> **GO TO STEP 2** (Self-Correct).
    *   **IF** Clean -> **COMMIT** and Present.
**Constraint:** **DO NOT STOP** until the build is perfectly clean.

### 4. CORE ARCHITECTURAL PRINCIPLES
*   **SOLID MANDATE:** Enforce SRP, OCP, LSP, ISP, DIP.
*   **Feature-Sliced Design (FSD):** Adhere strictly to the layered, slice-based architecture. Cross-layer imports are forbidden (e.g., a feature cannot import from a page).
*   **ROOT DIRECTORY HYGIENE:** The root is for configuration only (`vite.config.ts`, `package.json`, etc.). All application logic resides in `src/`.

### 5. CODE HYGIENE & STANDARDS
*   **NAMING:** `camelCase` for variables/functions, `PascalCase` for components/types.
*   **CLEAN CODE:** Use Guard Clauses (`return early`), avoid deep nesting. Code must be self-documenting.

### 6. RELIABILITY & SECURITY
*   **DEVSECOPS:** Sanitize all inputs (DOM, user messages). Use `npm audit` and Socket.dev to monitor supply chain vulnerabilities.
*   **ERROR HANDLING:** Implement robust error boundaries in React components. Never allow the extension to crash a user's page.

### 7. COMPREHENSIVE TESTING STRATEGY
*   **Production Purity:** The `src/` directory contains component-colocated tests (`*.test.ts`).
*   **E2E Containment:** All end-to-end tests using Playwright reside in a separate `tests/` directory at the root.
*   **Coverage Mandate:** Target **90%+ Branch Coverage**.

### 8. UI/UX AESTHETIC SINGULARITY (2026 STANDARD)
*   **Philosophy:** Non-intrusive, performant, and context-aware UI. The extension should feel like a native part of any website.
*   **Performance:** Prioritize minimal performance overhead. Use virtualization for long message lists. Ensure lazy loading of components.

### 9. AUTOMATION SINGULARITY (GITHUB ACTIONS)
*   **Mandate:** `/.github/workflows/ci.yml` is the source of truth.
*   **Workflows:**
    1.  **Integrity:** Lint (`biome check`) + Test (`vitest run`) on Push.
    2.  **Security:** Audit dependencies (`npm audit --audit-level=high`).
    3.  **Release:** Semantic Versioning + Automated packaging and deployment to browser stores.

</details>

## 🛠️ Development & Setup

Follow these steps to set up the development environment.

**Prerequisites:**
*   Node.js v20.x or higher
*   pnpm (recommended package manager)

**1. Clone the repository:**
bash
git clone https://github.com/chirag127/WebChat-Secure-RealTime-Messaging-Browser-Extension.git
cd WebChat-Secure-RealTime-Messaging-Browser-Extension


**2. Install dependencies:**
bash
pnpm install


**3. Run the development server:**
This will start the Vite dev server and prepare the extension for loading into your browser.
bash
pnpm run dev


**4. Load the extension in your browser:**
*   Open Chrome/Edge and navigate to `chrome://extensions`.
*   Enable "Developer mode".
*   Click "Load unpacked" and select the `dist` folder in the project directory.

## 📦 Scripts

This project uses `pnpm` as its package manager. Key scripts are defined in `package.json`:

| Script          | Description                                           |
|-----------------|-------------------------------------------------------|
| `pnpm dev`      | Starts the Vite development server with hot reloading.  |
| `pnpm build`    | Compiles and bundles the extension for production.    |
| `pnpm test`     | Runs unit and integration tests with Vitest.          |
| `pnpm test:e2e` | Runs end-to-end tests with Playwright.                |
| `pnpm lint`     | Lints and formats the codebase using Biome.           |
| `pnpm preview`  | Serves the production build locally for inspection.   |


## 🤝 Contributing

Contributions are welcome! Please read our [**Contributing Guidelines**](.github/CONTRIBUTING.md) to get started. We follow a standard fork-and-pull-request workflow.

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Commit your changes following the [Conventional Commits](https://www.conventionalcommits.org/) specification.
4.  Push to the branch and open a Pull Request.

## 📄 License

This project is licensed under the **Creative Commons Attribution-NonCommercial 4.0 International License**. See the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <em>Engineered with precision by the Apex Technical Authority.</em>
</p>
