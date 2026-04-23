#!/bin/bash
# AudioWatchDoge WSL Audio Bridge Setup

echo "Starting PulseAudio..."
pulseaudio --start --exit-idle-time=-1
pacmd load-module module-native-protocol-unix auth-anonymous=1

# Verify if devices are visible
echo "Available recording devices in WSL:"
pactl list sources short

echo "Setup complete. Run: python3 main.py"
