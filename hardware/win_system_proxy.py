import soundcard as sc
import socket
import numpy as np
import sys
import argparse

# CONFIG
WSL_IP = "127.0.0.1"
PORT = 9001
SAMPLE_RATE = 16000

def start_proxy(device_index=None):
    print(f"🐶 DogeProxy: Initializing Windows System Audio Capture...")
    mics = sc.all_microphones(include_loopback=True)
    loopbacks = [m for m in mics if m.isloopback]
    
    if not loopbacks:
        print("ERROR: No Loopback devices found.")
        return

    if device_index is None:
        for i, m in enumerate(loopbacks):
            print(f"[{i}] {m.name}")
        device_index = int(input("\nSelect System Device Index: "))
    
    mic = loopbacks[device_index]
    print(f"🐶 DogeProxy: Streaming SYSTEM -> WSL:{PORT}...")
    
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
            print(f"DogeProxy Error: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--index", type=int, help="Device index")
    args = parser.parse_args()
    start_proxy(args.index)
