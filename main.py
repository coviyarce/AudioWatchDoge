from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from audio_engine import AudioWatchDogeEngine
import asyncio
import numpy as np

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = AudioWatchDogeEngine()

html = """
<!DOCTYPE html>
<html>
    <head>
        <title>AudioWatchDoge Live</title>
        <style>
            body { background: #121212; color: #00ff00; font-family: monospace; padding: 20px; }
            #log { height: 80vh; overflow-y: scroll; border: 1px solid #333; padding: 10px; background: #000; }
            .mic { color: #00ff00; }
            .sys { color: #00ccff; }
        </style>
    </head>
    <body>
        <h1>🐶 AudioWatchDoge Live Transcription</h1>
        <div id="log"></div>
        <script>
            var ws = new WebSocket("ws://localhost:8000/ws");
            ws.onmessage = function(event) {
                var log = document.getElementById('log');
                var item = document.createElement('div');
                item.textContent = event.data;
                if (event.data.includes("[MIC]")) item.className = 'mic';
                if (event.data.includes("[SYSTEM]")) item.className = 'sys';
                log.appendChild(item);
                log.scrollTop = log.scrollHeight;
            };
        </script>
    </body>
</html>
"""

@app.get("/")
async def get():
    return HTMLResponse(html)

@app.get("/devices")
async def get_devices():
    return engine.get_devices()

@app.post("/select-device")
async def select_device(data: dict):
    success = engine.set_device(data['label'], data['device_name'])
    return {"success": success}

import subprocess

@app.post("/start-engine")
async def start_engine():
    try:
        proxy_mic = r"D:\IA - Proyectos\git\AudioWatchDoge\win_audio_proxy.py"
        proxy_sys = r"D:\IA - Proyectos\git\AudioWatchDoge\win_system_proxy.py"
        
        # Command for Mic
        cmd_mic = f'cmd.exe /c start "" python "{proxy_mic}"'
        # Command for System with /k to keep window open on error
        cmd_sys = f'cmd.exe /c start "" cmd /k python "{proxy_sys}"'
        
        subprocess.Popen(cmd_mic, shell=True)
        import time
        time.sleep(1) # Small delay to prevent CMD collisions
        subprocess.Popen(cmd_sys, shell=True)
        return {"success": True}
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.websocket("/audio-stream/{label}")
async def audio_stream_endpoint(websocket: WebSocket, label: str):
    await websocket.accept()
    print(f"Browser: Audio stream started for [{label}]")
    try:
        while True:
            # Receive binary frame (float32 PCM)
            data = await websocket.receive_bytes()
            audio_data = np.frombuffer(data, dtype=np.float32)
            engine.push_audio(label, audio_data)
    except Exception as e:
        print(f"Browser: Audio stream [{label}] stopped: {e}")

@app.post("/update-subjects")
async def update_subjects(data: dict):
    engine.update_subjects(data['subjects'])
    return {"success": True}

@app.on_event("startup")
async def startup_event():
    engine.start()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    async for text in engine.get_transcripts():
        await websocket.send_text(text)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
