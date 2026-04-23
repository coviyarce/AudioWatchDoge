import { useState, useEffect, useRef } from 'react';

/**
 * @typedef Highlight
 * @property {string} label - MIC or SYSTEM
 * @property {string} context - Sliding window context
 * @property {string} verbatim - Specific matched text
 * @property {string} timestamp - Occurence time
 */
export interface Highlight {
  label: string;
  context: string;
  verbatim: string;
  timestamp: string;
}

/**
 * @hook useAudioEngine
 * @description The 'JS' place. Manages the AudioWatchDoge processing lifecycle.
 * Handles WebSockets for levels/transcripts/highlights and Web Audio API for capture.
 * 
 * NEXT DEVELOPER: Implement reconnect logic with exponential backoff if WS fails.
 */
export function useAudioEngine() {
  const [levels, setLevels] = useState<Record<string, number>>({ MIC: 0, SYSTEM: 0 });
  const [transcripts, setTranscripts] = useState<string[]>([]);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [isMicRecording, setIsMicRecording] = useState(false);
  const [isSystemRecording, setIsSystemRecording] = useState(false);
  
  const micContextRef = useRef<AudioContext | null>(null);
  const systemContextRef = useRef<AudioContext | null>(null);
  const micWsRef = useRef<WebSocket | null>(null);
  const systemWsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    /** @function initMainSocket - Listens for level and highlight updates from the engine. */
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

  /**
   * @function setupAudioStream
   * @description Initializes Browser-Native capture (Mic or System Audio).
   * @param {string} label - The source identifier (MIC/SYSTEM).
   * @param {boolean} isSystem - Whether to use Display Media API for system sound.
   */
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

  /** @function stopStream - Cleanup function to close context and sockets. */
  const stopStream = (label: string) => {
    if (label === 'MIC') {
      micContextRef.current?.close(); micWsRef.current?.close(); setIsMicRecording(false);
    } else {
      systemContextRef.current?.close(); systemWsRef.current?.close(); setIsSystemRecording(false);
    }
  };

  /** @function startProxies - Triggers the backend to spawn local Windows Python proxies. */
  const startProxies = () => fetch('http://localhost:8000/start-engine', { method: 'POST' });

  return {
    levels, transcripts, highlights,
    isMicRecording, isSystemRecording,
    setupAudioStream, stopStream, startProxies
  };
}
