import soundcard as sc
import socket
import numpy as np

# CONFIG
WSL_IP = "127.0.0.1"
PORT = 9000
SAMPLE_RATE = 16000

def start_proxy():
    print(f"🐶 DogeProxy: Initializing Windows Audio Capture...")
    mics = sc.all_microphones(include_loopback=True)
    
    for i, m in enumerate(mics):
        print(f"[{i}] {m.name}")
    
    idx = int(input("\nSelect Input Device Index: "))
    mic = mics[idx]
    
    print(f"🐶 DogeProxy: Streaming {mic.name} to WSL:{PORT}...")
    
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        try:
            s.connect((WSL_IP, PORT))
            with mic.recorder(samplerate=SAMPLE_RATE) as recorder:
                while True:
                    data = recorder.record(numframes=1600) # 100ms
                    if len(data.shape) > 1:
                        data = data.mean(axis=1)
                    
                    # Debug: Check if we actually have signal
                    peak = np.abs(data).max()
                    if peak > 0.01: # Only print if there's actual sound
                        print(f"Signal: {peak:.4f}", end="\r")
                    
                    s.sendall(data.astype('float32').tobytes())
        except Exception as e:
            print(f"\nDogeProxy Error: {e}")

if __name__ == "__main__":
    start_proxy()
