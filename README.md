# 🐶 AudioWatchDoge Studio v4.0

A universal, cross-platform audio intelligence studio for high-fidelity transcription, live signal monitoring, and contextual subject filtering. Built for the GodeMode AI Software Factory.

## 🚀 Overview
AudioWatchDoge transforms raw audio into actionable intelligence. It leverages **Faster-Whisper** for real-time transcription and a custom **RangeFilter** engine to identify specific subjects and phrases within a sliding 10-second contextual window.

### Key Capabilities:
- **Universal Capture**: Works via Browser-Native APIs or Local Windows Proxies.
- **Contextual Highlights**: Automatically flags keywords/phrases and presents the surrounding context.
- **Multi-Threaded Engine**: Isolated threads for ingestion, metering, and transcription.

---

## ⚙️ Configuration (Customization)

The Studio is designed to be personalized. You can modify the environment to suit your needs:

### 1. Server Port
- **Backend**: In `main.py`, modify the `uvicorn.run` call at the bottom. Default is `8000`.
- **Frontend**: If you change the backend port, update the URLs in `ui/src/hooks/useAudioEngine.ts` and `ui/src/App.tsx`.
- **UI Port**: By default, the React app runs on `3001` (set in `ui/.env`).

### 2. Reserved Words (Subjects)
You can customize which words trigger the **Contextual Highlights**:
- **Option A (Static)**: Modify the list in `filter_logic.py` inside the `RangeFilter.__init__` method.
- **Option B (Dynamic)**: Use the API to update words in real-time:
  ```bash
  curl -X POST http://localhost:8000/update-subjects -H "Content-Type: application/json" -d '{"subjects": ["new", "keywords", "here"]}'
  ```

---

## 🎙 Usage Guide

### Option A: Browser-Native (Instant)
1. Open `http://localhost:3001`.
2. Click **MIC** to start recording from your browser microphone.
3. Click **SYSTEM AUDIO** to capture desktop sound (ensure you check "Share system audio" in the popup).

### Option B: Proxy Mode (Power User)
1. Click **PROXIES** in the UI to spawn local Windows terminals.
2. Useful for OS-level routing or bypassing browser privacy locks.

---

## 🛠 Architecture (The 'Places' Pattern)

- **The JS Place (`ui/src/hooks/useAudioEngine.ts`)**: Pure logic and state.
- **The CSS Place (`ui/src/styles/StudioStyles.ts`)**: MUI styling manifest.
- **The HTML Place (`ui/src/App.tsx`)**: Modular layout structure.

---
*Created with ❤️ by the GodeMode AI Software Factory.*
