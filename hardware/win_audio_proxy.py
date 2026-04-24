import soundcard as sc
import socket
import numpy as np
import sys
import argparse

# CONFIG
WSL_IP = "127.0.0.1"
PORT = 9000
SAMPLE_RATE = 16000

def start_proxy(device_index=None):
    print(f"🐶 DogeProxy: Initializing Windows Audio Capture...")
    mics = sc.all_microphones(include_loopback=True)
    
    if device_index is None:
        for i, m in enumerate(mics):
            print(f"[{i}] {m.name}")
        device_index = int(input("\nSelect Input Device Index: "))
    
    mic = mics[device_index]
    print(f"🐶 DogeProxy: Streaming {mic.name} to WSL:{PORT}...")
    
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        try:
            s.connect((WSL_IP, PORT))
            with mic.recorder(samplerate=SAMPLE_RATE) as recorder:
                while True:
                    data = recorder.record(numframes=1600)
                    if len(data.shape) > 1:
                        data = data.mean(axis=1)
                    s.sendall(data.astype('float32').tobytes())
        except Exception as e:
            print(f"\nDogeProxy Error: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--index", type=int, help="Device index")
    args = parser.parse_args()
    start_proxy(args.index)
