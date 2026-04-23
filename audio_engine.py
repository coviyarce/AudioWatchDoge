import socket
import numpy as np
from faster_whisper import WhisperModel
import asyncio
import threading
import sys
from collections import deque

class AudioWatchDogeEngine:
    def __init__(self, model_size="tiny"):
        print("GodeMode: Initializing Senior Dev Engine (Gemma 4 logic)...")
        # Initialize Whisper
        self.model = WhisperModel(model_size, device="cpu", compute_type="int8")
        
        # Communication channels
        self.queue = asyncio.Queue() # UI (WS)
        self.loop = None
        
        # Internal Shared Buffers (Rolling windows of audio)
        # 16000 samples per second. 5 seconds max buffer.
        self.buffer = {
            "MIC": deque(maxlen=16000 * 5),
            "SYSTEM": deque(maxlen=16000 * 5)
        }
        self.lock = threading.Lock()

    def _recv_all(self, conn, n):
        data = bytearray()
        while len(data) < n:
            try:
                packet = conn.recv(n - len(data))
                if not packet: return None
                data.extend(packet)
            except:
                return None
        return data

    def _tcp_listener(self, label, port):
        """Low-level ingestion. Zero logic, just raw byte pulling."""
        while True:
            try:
                with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                    s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
                    s.bind(('0.0.0.0', port))
                    s.listen(1)
                    print(f"GodeMode: Port {port} Listening for {label} Proxy...")
                    conn, addr = s.accept()
                    with conn:
                        print(f"GodeMode: {label} Proxy Connected ({addr})")
                        while True:
                            # 1600 samples * 4 bytes (float32)
                            raw_data = self._recv_all(conn, 1600 * 4)
                            if not raw_data: break
                            
                            data = np.frombuffer(raw_data, dtype='float32')
                            
                            with self.lock:
                                self.buffer[label].extend(data)
                                
            except Exception as e:
                import time
                time.sleep(1)

    def _meter_worker(self):
        """High-frequency thread for UI meters (10Hz)."""
        while True:
            try:
                with self.lock:
                    for label in ["MIC", "SYSTEM"]:
                        if len(self.buffer[label]) >= 1600:
                            # Take latest 100ms for meter
                            chunk = np.array(list(self.buffer[label])[-1600:])
                            rms = np.sqrt(np.mean(chunk**2))
                            # Senior Dev mapping: High sensitivity logarithmic
                            level = min(100, int(20 * np.log10(rms * 100 + 1e-6) + 120))
                            if level < 0: level = 0
                            
                            if self.loop:
                                asyncio.run_coroutine_threadsafe(self.queue.put(f"LEVEL:{label}:{level}"), self.loop)
                
                import time
                time.sleep(0.1) # 100ms update rate
            except:
                pass

    def _transcription_worker(self):
        """CPU-heavy transcription logic (Isolated)."""
        while True:
            try:
                for label in ["MIC", "SYSTEM"]:
                    data_to_process = None
                    with self.lock:
                        if len(self.buffer[label]) >= 16000 * 3: # 3 seconds window
                            data_to_process = np.array(list(self.buffer[label])[-48000:]) # Use last 3s
                    
                    if data_to_process is not None:
                        segments, _ = self.model.transcribe(data_to_process, beam_size=5)
                        for segment in segments:
                            if segment.text.strip():
                                text = f"[{label}] {segment.text.strip()}"
                                if self.loop:
                                    asyncio.run_coroutine_threadsafe(self.queue.put(text), self.loop)
                
                import time
                time.sleep(1) # Run every 1s
            except:
                pass

    def get_devices(self):
        return [
            {"name": "Windows Proxy (TCP:9000)", "is_loopback": False, "label": "MIC"},
            {"name": "Windows Proxy (TCP:9001)", "is_loopback": True, "label": "SYSTEM"}
        ]

    def set_device(self, label, device_name):
        return True

    def start(self):
        self.loop = asyncio.get_event_loop()
        # Thread 1: Mic Ingestion
        threading.Thread(target=self._tcp_listener, args=("MIC", 9000), daemon=True).start()
        # Thread 2: System Ingestion
        threading.Thread(target=self._tcp_listener, args=("SYSTEM", 9001), daemon=True).start()
        # Thread 3: Meter Calculation
        threading.Thread(target=self._meter_worker, daemon=True).start()
        # Thread 4: Transcription Worker
        threading.Thread(target=self._transcription_worker, daemon=True).start()

    async def get_transcripts(self):
        while True:
            yield await self.queue.get()
