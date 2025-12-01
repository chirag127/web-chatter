# 🚀 Pull Request Template

**Important:** Please ensure all automated checks and tests pass before submitting your Pull Request.

## PR Checklist

- [ ] **Self-Review:** I have thoroughly reviewed my own changes.
- [ ] **Branch Cleanliness:** My branch is up-to-date with the latest changes from the main branch (`main` or `master`).
- [ ] **Meaningful Commit Messages:** My commits are clear, concise, and follow the Conventional Commits specification.
- [ ] **Atomic Commits:** Changes are broken down into logical, self-contained commits.
- [ ] **Testing:** All relevant tests (unit, integration, E2E) have been written or updated and are passing.
- [ ] **Linting & Formatting:** Code adheres to the project's linting and formatting standards (e.g., Biome, Ruff).
- [ ] **Documentation:** All new or modified features are adequately documented in the relevant files (e.g., README.md, source code comments).
- [ ] **Security:** No new security vulnerabilities have been introduced.
- [ ] **Performance:** Changes do not negatively impact application performance.
- [ ] **Deprecation:** No deprecated libraries or patterns have been used unless absolutely necessary and with proper justification.

## Related Issue(s)

*Closes #<issue-number>*
*Fixes #<issue-number>*
*Related to #<issue-number>*

## Description

Provide a concise and clear description of the changes introduced in this Pull Request. What problem does it solve? What feature does it add? What architectural decision was made?

## Type of Change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Refactoring / Code style update
- [ ] Performance improvement
- [ ] Other (please specify):

## How Has This Been Tested?

Describe the tests that you ran to verify your changes. Provide instructions, if necessary, so we can reproduce them.

- **Local Testing:** (e.g., `npm run test:unit`, `npm run test:e2e`)
- **CI/CD Pipeline:** All checks in the GitHub Actions workflow should pass.
- **Manual Verification:** Steps to manually verify the changes.

## Screenshots / Visual Changes (If Applicable)

If your changes include UI modifications, please provide screenshots or screen recordings to demonstrate the visual impact.

## Notes for Reviewers

Add any specific areas you'd like reviewers to focus on, potential concerns, or context that might be helpful for understanding your changes.