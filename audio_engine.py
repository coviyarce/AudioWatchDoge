import socket
import numpy as np
from faster_whisper import WhisperModel
import asyncio
import threading
import sys
from collections import deque
from filter_logic import RangeFilter

class AudioWatchDogeEngine:
    def __init__(self, model_size="tiny"):
        print("GodeMode: Initializing Senior Dev Engine (Gemma 4 logic)...")
        self.model = WhisperModel(model_size, device="cpu", compute_type="int8")
        self.queue = asyncio.Queue()
        self.loop = None
        
        # Audio Buffers (Samples)
        self.buffer = {"MIC": deque(maxlen=16000 * 5), "SYSTEM": deque(maxlen=16000 * 5)}
        # Range Filters (Optimized logic per source)
        self.filters = {"MIC": RangeFilter(), "SYSTEM": RangeFilter()}
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
        while True:
            try:
                with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                    s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
                    s.bind(('0.0.0.0', port))
                    s.listen(1)
                    print(f"GodeMode: Listening for {label} Proxy on port {port}...")
                    conn, addr = s.accept()
                    with conn:
                        while True:
                            raw_data = self._recv_all(conn, 1600 * 4)
                            if not raw_data: break
                            data = np.frombuffer(raw_data, dtype='float32')
                            with self.lock:
                                self.buffer[label].extend(data)
            except Exception as e:
                import time
                time.sleep(1)

    def _meter_worker(self):
        while True:
            try:
                with self.lock:
                    for label in ["MIC", "SYSTEM"]:
                        if len(self.buffer[label]) >= 1600:
                            chunk = np.array(list(self.buffer[label])[-1600:])
                            rms = np.sqrt(np.mean(chunk**2))
                            level = min(100, int(20 * np.log10(rms * 100 + 1e-6) + 120))
                            if level < 0: level = 0
                            if self.loop:
                                asyncio.run_coroutine_threadsafe(self.queue.put(f"LEVEL:{label}:{level}"), self.loop)
                import time
                time.sleep(0.1)
            except:
                pass

    def _transcription_worker(self):
        while True:
            try:
                for label in ["MIC", "SYSTEM"]:
                    data_to_process = None
                    with self.lock:
                        if len(self.buffer[label]) >= 16000 * 3:
                            data_to_process = np.array(list(self.buffer[label])[-48000:])
                    
                    if data_to_process is not None:
                        segments, _ = self.model.transcribe(data_to_process, beam_size=5)
                        for segment in segments:
                            verbatim = segment.text.strip()
                            if verbatim:
                                # Delegate to RangeFilter (High-Fidelity Subject Match)
                                context, match = self.filters[label].process_segment(verbatim)
                                if match:
                                    highlight_msg = f"HIGHLIGHT:{label}:{context}||{match}"
                                    if self.loop:
                                        asyncio.run_coroutine_threadsafe(self.queue.put(highlight_msg), self.loop)
                                
                                # Standard Live Log
                                if self.loop:
                                    asyncio.run_coroutine_threadsafe(self.queue.put(f"[{label}] {verbatim}"), self.loop)
                import time
                time.sleep(1)
            except:
                pass

    def update_subjects(self, subjects):
        for f in self.filters.values():
            f.update_subjects(subjects)

    def get_devices(self):
        return [
            {"name": "Windows Proxy (TCP:9000)", "is_loopback": False, "label": "MIC"},
            {"name": "Windows Proxy (TCP:9001)", "is_loopback": True, "label": "SYSTEM"}
        ]

    def push_audio(self, label, data):
        with self.lock:
            if label not in self.buffer: self.buffer[label] = deque(maxlen=16000 * 5)
            self.buffer[label].extend(data)

    def start(self):
        self.loop = asyncio.get_event_loop()
        threading.Thread(target=self._tcp_listener, args=("MIC", 9000), daemon=True).start()
        threading.Thread(target=self._tcp_listener, args=("SYSTEM", 9001), daemon=True).start()
        threading.Thread(target=self._meter_worker, daemon=True).start()
        threading.Thread(target=self._transcription_worker, daemon=True).start()

    async def get_transcripts(self):
        while True:
            yield await self.queue.get()
