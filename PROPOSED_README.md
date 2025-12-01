# 🛡️ WebChat Secure RealTime Messaging Browser Extension

## 1. BLUF (Bottom Line Up Front)

This repository provides the source code for a high-performance, security-focused browser extension enabling real-time, end-to-end encrypted communication across any active webpage. Engineered using the late-2025 Apex Toolchain (TypeScript 6, Vite 7, WXT), it establishes a private chat layer over the public web.

## 2. Architectural Blueprint (FSD & Component Topology)

The project strictly adheres to Feature-Sliced Design (FSD) methodology for maximal maintainability and scalability, enforced by TypeScript strict mode.

mermaid
graph TD
    subgraph Browser Extension Layer
        UI[UI/Presentation Layer] --> S[Services/Logic Layer]
        S --> ST[State Management (Signals)]
    end
    subgraph Core Features
        S --> E2EE(E2E Encryption Module)
        S --> WS(WebSocket Transport Adapter)
    end
    E2EE -- Encrypt/Decrypt --> ST
    WS -- Connect/Listen --> E2EE
    UI -- Render --> ST

    style E2EE fill:#f9f,stroke:#333,stroke-width:2px
    style WS fill:#ccf,stroke:#333,stroke-width:2px

    classDef FSD fill:#e6f7ff,stroke:#1890ff
    class UI,S,ST FSD


## 3. Table of Contents

1.  [🛡️ WebChat Secure RealTime Messaging Browser Extension](#-webchat-secure-realtime-messaging-browser-extension)
2.  [BLUF (Bottom Line Up Front)](#-1-bluf-bottom-line-up-front)
3.  [Architectural Blueprint (FSD & Component Topology)](#2-architectural-blueprint-fsd-component-topology)
4.  [Table of Contents](#3-table-of-contents)
5.  [🚀 Apex Agent Directives (Internal AI Alignment)](#-4-apex-agent-directives-internal-ai-alignment)
6.  [🛠️ Development & Deployment Standards](#-5-development-deployment-standards)
7.  [📜 License](#-6-license)


## 4. 🤖 Apex Agent Directives (Internal AI Alignment)

<details>
<summary>Click to view Architect Configuration (AGENTS.md Alignment)</summary>

### **SYSTEM: APEX TECHNICAL AUTHORITY (DECEMBER 2025 BUILD)**

#### **1. IDENTITY & PRIME DIRECTIVE**
**Role:** Senior Principal Software Architect (40+ years experience). Enforcing FAANG-level standards. **Output Standard:** EXECUTION-ONLY.
**Philosophy:** "Zero-Defect, High-Velocity, Future-Proof."

#### **2. CONTEXT-AWARE APEX TECH STACKS (LATE 2025 STANDARDS)**
**Project Type Detected:** Web Extension / TypeScript Application.
**Applied Apex Toolchain:**
*   **Stack:** TypeScript 6.x (Strict), Vite 7, WXT (Web Extension Tooling).
*   **State:** Signals (Standardized).
*   **Lint/Test:** Biome (Format/Lint) + Vitest (Unit) + Playwright (E2E).

#### **3. CORE ARCHITECTURAL PRINCIPLES**
*   **SOLID Compliance:** Mandatory. Specific focus on **Dependency Inversion Principle (DIP)** for the WebSocket Transport Adapter.
*   **DRY Enforcement:** Abstract common UI components into the `features/shared/ui` slice.
*   **YAGNI Precaution:** Avoid speculative future features (e.g., advanced file sharing) unless directly required by the E2EE mandate.
*   **Security Focus (E2EE Layer):** All cryptographic operations MUST be audited against OWASP Top 10 for Extensions (2025/2026 refresh). Use proven, battle-tested libraries only.

#### **4. VERIFICATION & EXECUTION COMMANDS (LATEST STACK)**
*   **Environment Setup:** `npm install` (managed by `uv`-like dependency resolution via npm/pnpm).
*   **Lint & Format Check:** `npx @biomejs/biome check --apply --formatter-style=markdown .`
*   **Unit Testing:** `npx vitest test --coverage`
*   **E2E Testing:** `npx playwright test` (Ensure Playwright context simulates browser extension lifecycle).
*   **Build Extension Artifacts:** `npx vite build` (Targeting WXT manifest V3).

**Agent Directive:** Maintain absolute fidelity to the FSD structure defined in the architecture diagram. Any new feature must fit cleanly into an existing layer or create a new, logically scoped feature slice.

</details>

## 5. 🛠️ Development & Deployment Standards

### Setup
bash
git clone https://github.com/chirag127/WebChat-Secure-RealTime-Messaging-Browser-Extension.git
cd WebChat-Secure-RealTime-Messaging-Browser-Extension
npm install
# Or using pnpm/yarn if preferred, but npm is the default baseline


### Scripts
| Command | Description | Apex Standard | 
| :--- | :--- | :--- |
| `npm run dev` | Starts the Vite development server with HMR enabled for the extension manifest. | High-Velocity Dev Cycle |
| `npm run build` | Compiles the optimized production bundle via Vite/WXT. | Zero-Defect Release Candidate |
| `npm run lint` | Runs Biome for strict linting and formatting checks. | Static Analysis |
| `npm run test:unit` | Executes all Vitest unit tests with coverage reporting. | Code Confidence |
| `npm run test:e2e` | Runs end-to-end workflows via Playwright. | User Journey Verification |

### Core Principles Applied
*   **SOLID:** Ensuring abstraction boundaries between the client-side UI and the secure WebSocket service layer.
*   **DRY:** Reusing state hooks and utility functions across different feature slices.
*   **YAGNI:** Code must solve immediate, stated requirements. No speculative complexity added.


## 6. 📜 License

This project is licensed under the **Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)** License. See the [LICENSE](https://github.com/chirag127/WebChat-Secure-RealTime-Messaging-Browser-Extension/blob/main/LICENSE) file for details.

***



*Built by Chirag127 with the Apex Technical Authority framework.*