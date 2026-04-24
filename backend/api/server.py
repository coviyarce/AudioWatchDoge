from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
import sys
import os
import asyncio
import numpy as np
import subprocess

# Add engine directory to path for the core engine
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "engine")))

from engine_core import AudioWatchDogeEngine
from subject_packs import get_pack_list, get_pack_subjects

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = AudioWatchDogeEngine()

@app.get("/packs")
async def list_packs():
    print("API: Fetching packs...")
    return get_pack_list()

@app.post("/select-pack")
async def select_pack(data: dict):
    pack_id = data.get('pack_id')
    print(f"API: Selecting pack {pack_id}")
    subjects = get_pack_subjects(pack_id)
    engine.update_subjects(subjects)
    return {"success": True, "subjects": subjects}

@app.get("/devices")
async def get_devices():
    return engine.get_devices()

@app.post("/select-device")
async def select_device(data: dict):
    success = engine.set_device(data['label'], data['device_name'])
    return {"success": success}

@app.post("/start-engine")
async def start_engine():
    try:
        # Adjusted paths to account for the new hardware folder
        proxy_mic = r"D:\IA - Proyectos\git\AudioWatchDoge\hardware\win_audio_proxy.py"
        proxy_sys = r"D:\IA - Proyectos\git\AudioWatchDoge\hardware\win_system_proxy.py"
        cmd_mic = f'cmd.exe /c start "" python "{proxy_mic}"'
        cmd_sys = f'cmd.exe /c start "" cmd /k python "{proxy_sys}"'
        subprocess.Popen(cmd_mic, shell=True)
        await asyncio.sleep(1)
        subprocess.Popen(cmd_sys, shell=True)
        return {"success": True}
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.websocket("/audio-stream/{label}")
async def audio_stream_endpoint(websocket: WebSocket, label: str):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_bytes()
            audio_data = np.frombuffer(data, dtype=np.float32)
            engine.push_audio(label, audio_data)
    except Exception as e:
        pass

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
