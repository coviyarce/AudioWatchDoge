import { useState, useEffect, useRef } from 'react';
import { AudioApi } from '../api/AudioApi';
import { Highlight } from '../types';

/**
 * @hook useAudioEngine
 * @description Logic Place. Manages state, data streams, and intelligence packs.
 */
export function useAudioEngine() {
  const [levels, setLevels] = useState<Record<string, number>>({ MIC: 0, SYSTEM: 0 });
  const [transcripts, setTranscripts] = useState<string[]>([]);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [isMicRecording, setIsMicRecording] = useState(false);
  const [isSystemRecording, setIsSystemRecording] = useState(false);
  const [packs, setPacks] = useState<string[]>([]);
  const [selectedPack, setSelectedPack] = useState<string | null>(null);
  
  const micContextRef = useRef<AudioContext | null>(null);
  const systemContextRef = useRef<AudioContext | null>(null);
  const micWsRef = useRef<WebSocket | null>(null);
  const systemWsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // 1. Fetch available packs
    AudioApi.fetchPacks()
      .then(data => setPacks(Array.isArray(data) ? data : []))
      .catch(e => {
        console.error("API Offline");
        setPacks([]);
      });

    // 2. Init Main Socket
    const ws = new WebSocket('ws://localhost:8000/ws');
    ws.onmessage = (event: MessageEvent) => {
      const msg = event.data;
      if (typeof msg === 'string') {
        if (msg.startsWith('LEVEL:')) {
          const [, label, value] = msg.split(':');
          setLevels(prev => ({ ...prev, [label]: parseInt(value) || 0 }));
        } else if (msg.startsWith('HIGHLIGHT:')) {
          const parts = msg.split(':');
          const label = parts[1];
          const content = parts.slice(2).join(':');
          const [context, verbatim] = content.split('||');
          setHighlights(prev => [...prev.slice(-19), {
            label, context, verbatim, timestamp: new Date().toLocaleTimeString()
          }]);
        } else {
          setTranscripts(prev => [...prev.slice(-200), msg]);
        }
      }
    };
    return () => ws.close();
  }, []);

  const selectPack = async (packId: string) => {
    await AudioApi.selectPack(packId);
    setSelectedPack(packId);
  };

  const setupAudioStream = async (label: string, isSystem: boolean) => {
    try {
      const stream = isSystem 
        ? await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
        : await navigator.mediaDevices.getUserMedia({ audio: true });

      const audioContext = new AudioContext({ sampleRate: 16000 });
      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      const ws = new WebSocket(`ws://localhost:8000/audio-stream/${label}`);

      ws.onopen = () => {
        if (isSystem) {
          setIsSystemRecording(true);
          systemContextRef.current = audioContext;
          systemWsRef.current = ws;
        } else {
          setIsMicRecording(true);
          micContextRef.current = audioContext;
          micWsRef.current = ws;
        }
        source.connect(processor);
        processor.connect(audioContext.destination);
        processor.onaudioprocess = (e) => {
          if (ws.readyState === WebSocket.OPEN) {
            const inputData = e.inputBuffer.getChannelData(0);
            ws.send(inputData.buffer);
          }
        };
      };
      if (isSystem) stream.getVideoTracks()[0]?.stop();
    } catch (err) {
      console.error(`${label} Capture Failed:`, err);
    }
  };

  const stopStream = (label: string) => {
    if (label === 'MIC') {
      micContextRef.current?.close(); micWsRef.current?.close(); setIsMicRecording(false);
    } else {
      systemContextRef.current?.close(); systemWsRef.current?.close(); setIsSystemRecording(false);
    }
  };

  return {
    levels, transcripts, highlights,
    isMicRecording, isSystemRecording,
    packs, selectedPack, selectPack,
    setupAudioStream, stopStream, 
    startProxies: AudioApi.startProxies
  };
}
