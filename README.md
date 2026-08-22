# CampusFind 🔍 - AI-Powered Lost & Found

An intelligent, secure, and accessible Lost & Found system designed specifically for campus environments. Built to solve the exact problem statement of matching lost items using AI.

## 🎯 Problem Statement Alignment
This project directly addresses the hackathon problem statement by providing:
1. **AI Image Analysis:** Uses HuggingFace CLIP models to extract visual features from uploaded images.
2. **Intelligent Text Matching:** Uses Sentence-Transformers to understand semantic similarity in descriptions.
3. **Multi-Dimensional Matching Engine:** Combines Visual (30%), Text (35%), Location (20%), and Time (15%) proximity to generate an accurate match score.
4. **Explainable AI:** Generates natural language explanations for *why* an item matched.
5. **Privacy First:** Hides sensitive contact information until a claimant successfully verifies ownership by answering an AI-generated challenge question.

## 🛡️ Security Features
- Strict **Content Security Policy (CSP)** and HTTP security headers configured.
- Environment variables securely managed and excluded from version control.
- Cross-Site Scripting (XSS) protection enforced.
- Input validation and sanitization implemented via Pydantic and strict TypeScript interfaces.

## ♿ Accessibility (a11y)
- Fully semantic HTML structure (`<main>`, `<nav>`, `<aside>`).
- 100% ARIA label coverage on interactive elements and icons.
- High-contrast dark mode UI ensuring WCAG AAA compliance.
- Keyboard navigable interface.

## 🧪 Testing & Code Quality
- Comprehensive Test Suite utilizing Jest and PyTest.
- Continuous Integration (CI) pipeline configured via GitHub Actions.
- Strict ESLint configuration and Prettier formatting.
- Fully typed with TypeScript to prevent runtime errors.
