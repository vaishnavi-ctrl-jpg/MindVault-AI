# 🧠 MindVault AI: Secure Personal Gemini Journal & Reflection Studio

> **APAC Gen AI Academy Cohort 3 - Ideathon Challenge Submission**  
> **Built with**: Google AI Studio, Google Gemini API, Firebase Auth, Cloud Firestore, Google Cloud Secret Manager, React, TypeScript, Chart.js  

---

## 🌟 Executive Summary

Most AI-generated apps fall short in production due to hardcoded API keys, missing authorization boundaries, and shared database tables without user isolation. 

**MindVault AI** solves this by establishing an enterprise **Google AI Studio Security Constitution** *before writing a single line of code*. The result is a production-grade, zero-trust authenticated journaling & reflection web application where each user signs in, brainstorms with Gemini in multi-turn conversations, receives automated cognitive summaries, and stores their reflections in strictly isolated database subcollections.

---

## 🚀 Key Features & Phase Breakdown

### Phase 1: Google AI Studio Security Directives & Constitution
- 📄 **`AI_STUDIO_SECURITY_CONSTITUTION.md`**: Custom system directives baking in **STRIDE threat modeling**, zero-trust client rules, database isolation constraints, and mandatory secret management.

### Phase 2: Core Enterprise Requirements
1. 🔐 **User Authentication**: Integrated Firebase Auth supporting Google Sign-In, Email/Password, and an instant **Guest Sandbox Mode** for immediate evaluator testing.
2. 💬 **Multi-Turn AI Interaction**: Real-time conversational journaling powered by **Gemini 2.5 Flash** with 4 distinct AI personas (*Empathetic Reflector, Strategic Planner, Creative Ideator, Stoic Mindset Coach*).
3. 🛡️ **Isolated Data Storage**: Strict Cloud Firestore subcollection rules (`/users/{userId}/journals/{journalId}`) enforcing `request.auth.uid == userId` to guarantee **zero cross-user data leakage**.
4. 🗝️ **Secure Key Management**: Server-side proxy (`server/index.js`) accessing API keys dynamically via **Google Cloud Secret Manager** (`@google-cloud/secret-manager`), ensuring zero API keys are exposed to client browser bundles.

### Phase 3: Original Feature Enhancements (Beyond Specs)
- 📊 **Feature 1: Mood & Cognitive Spectrum Analytics**: Interactive Chart.js radar & line graphs tracking Positivity, Clarity, Energy, and Anxiety metrics extracted from Gemini's emotional sentiment analysis.
- 🎙️ **Feature 2: Audio/Voice AI Journaling**: Real-time Web Speech API voice recorder with live waveform visualization, automatic speech-to-text, and direct prompt transfer.
- 🧠 **Feature 3: Cognitive Pattern & Reflection Insights Engine**: Synthetic memory analyzer that scans historical entries, highlights recurring themes, and suggests tailored reflection prompts.
- 🔒 **Feature 4: Zero-Knowledge Encrypted Vault Export**: Client-side AES-256 encrypted export of all journals to Markdown (`.md`), JSON (`.json`), or encrypted `.mindvault` files.

---

## 🛠️ Quick Start & Running Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Secrets (Optional)
Create `.env` or set environment variables:
```env
GCP_PROJECT_ID=phrasal-alpha-493811-m4
GCP_SECRET_NAME=projects/phrasal-alpha-493811-m4/secrets/GEMINI_API_KEY/versions/latest
USE_SECRET_MANAGER=true
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Launch Development Application
Run both frontend and backend server:
```bash
# Terminal 1: Launch Backend Secret Manager Proxy
npm run server

# Terminal 2: Launch Frontend Web App
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

---

## 🛡️ Security Verification Matrix

| Vulnerability Vector | Defense Mechanism Implemented | Verification Status |
| :--- | :--- | :--- |
| **API Key Exposure** | GCP Secret Manager server-side retrieval (`@google-cloud/secret-manager`) | ✅ VERIFIED (Zero client key leak) |
| **Cross-User Data Leakage** | Firestore subcollection scoping (`/users/{userId}/journals/`) | ✅ VERIFIED (`request.auth.uid == userId`) |
| **Unauthenticated Access** | Firebase Auth token validation & Guest Sandbox boundary | ✅ VERIFIED |
| **XSS & Code Injection** | DOMPurify output sanitization & strict prompt boundaries | ✅ VERIFIED |

---

## 🏆 Ideathon Submission Deliverables Checklist
- [x] Configured Google AI Studio setup with custom security directives (`AI_STUDIO_SECURITY_CONSTITUTION.md`).
- [x] Working Personal Gemini Journal app meeting all 4 core Phase 2 requirements.
- [x] 4 Unique Original Feature Enhancements (Mood Analytics, Voice Journaling, AI Insights, Encrypted Vault Export).
