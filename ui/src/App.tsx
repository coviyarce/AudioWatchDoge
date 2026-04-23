import React, { useState, useEffect, useRef } from 'react';
import { 
  Container, Typography, Box, Paper, LinearProgress, 
  Grid, Card, CardContent, Chip, Button
} from '@mui/material';
import { Mic, Speaker, Stop, ScreenShare, PlayArrow } from '@mui/icons-material';

function App() {
  const [levels, setLevels] = useState<Record<string, number>>({ MIC: 0, SYSTEM: 0 });
  const [transcripts, setTranscripts] = useState<string[]>([]);
  const [isMicRecording, setIsMicRecording] = useState(false);
  const [isSystemRecording, setIsSystemRecording] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const micContextRef = useRef<AudioContext | null>(null);
  const systemContextRef = useRef<AudioContext | null>(null);
  const micWsRef = useRef<WebSocket | null>(null);
  const systemWsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/ws');
    ws.onmessage = (event: MessageEvent) => {
      const msg = event.data;
      if (typeof msg === 'string') {
        if (msg.startsWith('LEVEL:')) {
          const [, label, value] = msg.split(':');
          setLevels(prev => ({ ...prev, [label]: parseInt(value) || 0 }));
        } else {
          setTranscripts(prev => [...prev.slice(-100), msg]);
        }
      }
    };
    return () => ws.close();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcripts]);

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
      micContextRef.current?.close();
      micWsRef.current?.close();
      setIsMicRecording(false);
    } else {
      systemContextRef.current?.close();
      systemWsRef.current?.close();
      setIsSystemRecording(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#121212', py: 5, color: '#fff' }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>🐶 AudioWatchDoge Studio</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="contained" 
              color={isMicRecording ? "error" : "primary"}
              startIcon={isMicRecording ? <Stop /> : <Mic />}
              onClick={() => isMicRecording ? stopStream('MIC') : setupAudioStream('MIC', false)}
            >
              MIC
            </Button>
            <Button 
              variant="contained" 
              color={isSystemRecording ? "error" : "secondary"}
              startIcon={isSystemRecording ? <Stop /> : <ScreenShare />}
              onClick={() => isSystemRecording ? stopStream('SYSTEM') : setupAudioStream('SYSTEM', true)}
            >
              SYSTEM AUDIO
            </Button>
            <Button variant="outlined" color="success" startIcon={<PlayArrow />} onClick={() => fetch('http://localhost:8000/start-engine', {method: 'POST'})}>
              PROXIES
            </Button>
          </Box>
        </Box>
        
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <DeviceCard title="Microphone" label="MIC" level={levels.MIC} icon={<Mic sx={{ color: '#2196f3' }} />} status={isMicRecording ? "LIVE" : "OFF"} />
              <DeviceCard title="System Audio" label="SYSTEM" level={levels.SYSTEM} icon={<Speaker sx={{ color: '#9c27b0' }} />} status={isSystemRecording ? "LIVE" : "OFF"} />
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <Card sx={{ bgcolor: '#1e1e1e', color: '#fff', height: '600px', display: 'flex', flexDirection: 'column', border: '1px solid #333' }}>
              <Box sx={{ p: 2, borderBottom: '1px solid #333' }}><Typography variant="h6">Live Transcription</Typography></Box>
              <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2, bgcolor: '#000', fontFamily: 'monospace' }}>
                {transcripts.map((t, i) => (
                  <Typography key={i} sx={{ color: t.includes('[MIC]') ? '#00ff00' : '#00ccff', mb: 1, fontSize: '0.9rem' }}>
                    {t}
                  </Typography>
                ))}
                <div ref={scrollRef} />
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

const DeviceCard = ({ title, label, level, icon, status }: any) => (
  <Card sx={{ bgcolor: '#1e1e1e', color: '#fff', border: '1px solid #333' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        {icon}
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{title}</Typography>
        <Chip label={status} color={status === "LIVE" ? "success" : "default"} size="small" sx={{ fontSize: '10px' }} />
      </Box>
      <LinearProgress variant="determinate" value={level} sx={{ height: 10, borderRadius: 5, bgcolor: '#333', '& .MuiLinearProgress-bar': { bgcolor: level > 80 ? '#f44336' : '#4caf50' } }} />
      <Typography variant="caption" align="right" sx={{ display: 'block', mt: 1 }}>{level}%</Typography>
    </CardContent>
  </Card>
);

export default App;
