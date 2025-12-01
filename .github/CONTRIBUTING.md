# Contributing to WebChat Secure Messenger

First and foremost, thank you for considering contributing to WebChat. This project adheres to the highest engineering standards to ensure it remains secure, performant, and maintainable. To maintain this quality, we require all contributors to follow these guidelines strictly.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Prerequisites](#prerequisites)
- [Development Setup](#development-setup)
- [Architectural & Coding Standards](#architectural--coding-standards)
- [Testing Protocol](#testing-protocol)
- [Commit Message Convention](#commit-message-convention)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs & Suggesting Features](#reporting-bugs--suggesting-features)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior.

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS version)
- [pnpm](https://pnpm.io/) (for package management)

## Development Setup

1.  **Fork the repository:**
    - Create a fork of `chirag127/WebChat-Secure-RealTime-Messaging-Browser-Extension`.

2.  **Clone your fork locally:**
    bash
    git clone https://github.com/YOUR-USERNAME/WebChat-Secure-RealTime-Messaging-Browser-Extension.git
    cd WebChat-Secure-RealTime-Messaging-Browser-Extension
    

3.  **Install dependencies:**
    - This project uses `pnpm` for efficient dependency management.
    bash
    pnpm install
    

4.  **Run the development environment:**
    bash
    pnpm dev
    
    This command will start the Vite development server and prepare the extension for loading into your browser.

## Architectural & Coding Standards

### Core Architecture: Feature-Sliced Design (FSD)

This project strictly follows the **Feature-Sliced Design (FSD)** methodology. This layered architecture ensures scalability, decouples modules, and provides clear boundaries. All new code **must** conform to FSD principles. Please familiarize yourself with its concepts before contributing.

- **/app**: Application-wide setup, routing, and global styles.
- **/pages**: Application pages, composed of features and widgets.
- **/widgets**: Compositional blocks of UI, combining multiple features and entities.
- **/features**: Business-level user interactions (e.g., `sendMessage`, `editProfile`).
- **/entities**: Business entities (e.g., `user`, `message`).
- **/shared**: Reusable, framework-agnostic code (UI components, APIs, config).

### Language & Formatting: TypeScript & Biome

- **TypeScript (Strict Mode):** All code must be written in TypeScript with `strict` mode enabled. The use of `any` is strictly prohibited unless absolutely unavoidable and justified.
- **Linter & Formatter (Biome):** We use Biome for linting and formatting. All code must be free of Biome errors and warnings before a Pull Request is submitted. Run the check command:
  bash
  pnpm lint:check
  
  To automatically fix issues, run:
  bash
  pnpm lint:fix
  

## Testing Protocol

A comprehensive test suite is non-negotiable for ensuring application stability and security.

- **Unit/Component Tests (Vitest):** All new features, entities, and complex shared logic must be covered by unit tests.
- **End-to-End Tests (Playwright):** Critical user flows (e.g., login, sending a message, creating a chat) must have E2E tests.

To run the entire test suite:
bash
pnpm test


## Commit Message Convention

We enforce the **Conventional Commits** specification. This convention leads to more readable commit histories and enables automated changelog generation.

Each commit message consists of a **header**, a **body**, and a **footer**.


<type>(<scope>): <short summary>
│       │             │
│       │             └─> Summary in present tense. Not capitalized. No period at the end.
│       │
│       └─> Optional scope of this change (e.g., `auth`, `chat`, `vite`)
│
└─> Type: feat | fix | build | chore | ci | docs | perf | refactor | revert | style | test


**Example:**
`feat(chat): implement real-time message delivery status`

## Pull Request Process

1.  Ensure your fork is up-to-date with the `main` branch of the original repository.
2.  Create a new branch from `main` in your fork. Use a descriptive name (e.g., `feat/user-profile-widget`, `fix/login-csrf-vulnerability`).
3.  Make your changes, adhering to all architectural and testing standards.
4.  Ensure all checks pass locally: `pnpm lint:check` and `pnpm test`.
5.  Push your branch to your fork and open a Pull Request against the `chirag127/WebChat-Secure-RealTime-Messaging-Browser-Extension:main` branch.
6.  Fill out the PR template with a clear description of your changes, the problem they solve, and how to test them.
7.  The core team will review your PR. Address any requested changes promptly.

## Reporting Bugs & Suggesting Features

Use the GitHub Issues tab to report bugs or suggest features. Please use the provided templates (`Bug Report` or `Feature Request`) to ensure you provide all the necessary information for us to act on your submission.
