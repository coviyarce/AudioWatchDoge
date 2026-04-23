# 🐶 AudioWatchDoge Studio v4.0

A universal, cross-platform audio intelligence studio for high-fidelity transcription, live signal monitoring, and contextual subject filtering. Built for the GodeMode AI Software Factory.

## 🚀 Overview
AudioWatchDoge transforms raw audio into actionable intelligence. It leverages **Faster-Whisper** for real-time transcription and a custom **RangeFilter** engine to identify specific subjects and phrases within a sliding 10-second contextual window.

### Key Capabilities:
- **Universal Capture**: Works via Browser-Native APIs (Web Audio / Display Media) or Local Windows Proxies.
- **Contextual Highlights**: Automatically flags keywords/phrases (UX/UI Lingo, Custom Handles) and presents the surrounding verbatim context.
- **Multi-Threaded Engine**: Isolated threads for audio ingestion, logarithmic metering, and CPU-intensive transcription.
- **Studio Interface**: A responsive, full-screen React dashboard with real-time level meters and terminal-style logs.

---

## 🛠 Architecture (The 'Places' Pattern)

The project is structured for maximum maintainability:

- **The JS Place (`ui/src/hooks/useAudioEngine.ts`)**: Pure logic, state, and WebSocket management.
- **The CSS Place (`ui/src/styles/StudioStyles.ts`)**: Centralized MUI styling manifest.
- **The HTML Place (`ui/src/App.tsx`)**: Modular layout and component orchestration.
- **The Intelligence Engine (`audio_engine.py` & `filter_logic.py`)**: Multi-threaded Python backend.

---

## ⚡ Setup Guide

### 1. Backend (WSL2 / Linux)
Requires Python 3.12+ and FFmpeg.
```bash
# Install dependencies
pip install fastapi uvicorn faster-whisper numpy soundcard

# Run the studio server
python3 main.py
```

### 2. Frontend (Windows / Mac / Linux)
Requires Node.js 18+.
```bash
cd ui
npm install
npm start
```

---

## 🎙 Usage Guide

### Option A: Browser-Native (Instant)
1. Open `http://localhost:3001`.
2. Click **MIC** to start recording from your browser microphone.
3. Click **SYSTEM AUDIO** to capture desktop sound (ensure you check "Share system audio" in the popup).

### Option B: Proxy Mode (Power User)
1. Click **PROXIES** in the UI to spawn local Windows terminals.
2. The UI will automatically connect to these high-fidelity TCP streams.
3. Useful for bypassing browser privacy restrictions or complex routing.

---

## 🔍 Contextual Filtering
The engine watches for a predefined list of phrases (e.g., "Design System", "Covi", "Accessibility"). When a match is found:
- The **Highlight** section updates with the verbatim match.
- The **Context** (preceding 10s of audio) is displayed for reference.

---

## 📜 Developer Notes
- **Fuzzy Matching**: Uses `difflib` to handle transcription typos.
- **Meters**: Logarithmic dB scaling for high sensitivity.
- **Git**: Primary branch is `main`.

---
*Created with ❤️ by the GodeMode AI Software Factory.*
