#!/bin/bash
# GodeMode Audio Fix
export PULSE_SERVER=unix:/mnt/wslg/runtime-dir/pulse/native

echo "--- Checking PulseAudio ---"
if [ ! -S /mnt/wslg/runtime-dir/pulse/native ]; then
    echo "ERROR: WSLg socket not found at /mnt/wslg/runtime-dir/pulse/native"
    echo "Ensure you are using WSL2 with WSLg (Windows 11 or latest Win10)."
    exit 1
fi

echo "--- Current Sources ---"
pactl list sources short

echo "--- Testing Mic (RDPSource) ---"
timeout 2s parecord --device=RDPSource --channels=1 --format=s16le --rate=16000 /tmp/test.wav
if [ $? -eq 124 ] || [ $? -eq 0 ]; then
    echo "SUCCESS: Hardware signal received."
else
    echo "FAILED: No signal from RDPSource."
fi
