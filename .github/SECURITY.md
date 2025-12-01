# Security Policy for WebChat-Secure-RealTime-Messaging-Browser-Extension

As an Apex-level project, **WebChat-Secure-RealTime-Messaging-Browser-Extension** prioritizes security above all else. This repository adheres to rigorous, future-proof standards (2026 specifications) for vulnerability disclosure and management, ensuring maximum defense-in-depth for secure, private communication.

## 🛡️ Commitment to Security

We treat all reported vulnerabilities with the highest level of urgency. Our architecture is designed around minimizing attack surfaces, especially concerning cryptographic operations inherent in E2EE messaging.

## 📢 Supported Versions

| Version | Status | Notes |
| :--- | :--- | :--- |
| Latest Release | Supported | Critical vulnerabilities patched immediately. |
| Previous Release | Maintained | Patches for Critical/High vulnerabilities only. |
| Older Versions | Unsupported | Users must upgrade immediately. |

## 🚨 Reporting a Vulnerability

We follow a strict, coordinated disclosure policy. **DO NOT** disclose vulnerabilities publicly (e.g., open a public Issue or Pull Request) before coordination is complete.

### 1. Private Disclosure

Please report any potential security vulnerabilities privately to the maintainer:

*   **Primary Contact:** `chirag127@users.noreply.github.com` (Security contact via GitHub email)
*   **Alternative:** Use GitHub's [Security Advisories](https://github.com/chirag127/WebChat-Secure-RealTime-Messaging-Browser-Extension/security/advisories/new) feature to create a draft private report.

### 2. Disclosure Timeline

Upon receiving a report, we commit to the following timeline for remediation and public disclosure:

1.  **Acknowledgement (within 24 hours):** Confirmation that the report has been received and validated.
2.  **Triage & Fix Development (within 14 days):** Development of a zero-defect patch.
3.  **Release Candidate:** Internal testing, followed by deployment to a limited beta channel.
4.  **Public Disclosure:** The vulnerability details, fix version, and remediation steps will be published **7 days** after the patch is released to the stable channel, allowing users time to upgrade.

*Exception: This timeline may be adjusted for extremely complex or critical vulnerabilities (e.g., supply chain attacks), but you will be kept informed.*

## ✅ Remediation Standards (Apex Mandates)

All patches deployed for security vulnerabilities must meet the following architectural requirements:

1.  **Immutability & Verifiability:** All cryptographic operations must use verified, non-backdoored libraries. For this project, standard Node.js crypto modules or audited third-party implementations are preferred.
2.  **Linting Enforcement:** The fix must pass all Biome formatting and linting checks (`npm run lint`).
3.  **Test Coverage:** The fix must include a specific, reproducible regression test case written using **Playwright** (for E2E flows) or **Vitest** (for logic validation) that fails *before* the fix and passes *after* the fix.
4.  **Principle Adherence:** The patch must uphold **SOLID, DRY, and YAGNI** principles.

## 🔑 Security Audits and Dependencies

We leverage automated tools to maintain dependency security:

*   **Dependabot:** Configured to monitor all direct and transitive dependencies for known CVEs.
*   **Supply Chain Integrity:** All CI workflows defined in `.github/workflows/ci.yml` utilize reproducible build environments to mitigate injection risks.
*   **Code Scanning:** Static Application Security Testing (SAST) is integrated into the primary CI pipeline.

--- 

*This security policy is subject to evolution in line with emerging 2026 security threats and best practices.*