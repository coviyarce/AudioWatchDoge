import React, { useState, useEffect, useRef } from 'react';
import { 
  Container, Typography, Box, Paper, LinearProgress, 
  Grid, Card, CardContent, Chip, Stack, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import { Mic, Speaker, History } from '@mui/icons-material';

interface Device {
  name: string;
  is_loopback: boolean;
  label: string;
}

function App() {
  const [levels, setLevels] = useState<Record<string, number>>({ MIC: 0, SYSTEM: 0 });
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedMic, setSelectedMic] = useState('');
  const [selectedSystem, setSelectedSystem] = useState('');
  const [transcripts, setTranscripts] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchDevices = () => {
      fetch('http://localhost:8000/devices')
        .then(res => res.json())
        .then(data => {
          setDevices(data);
          const micProxy = data.find((d: Device) => d.name.includes('9000'));
          const sysProxy = data.find((d: Device) => d.name.includes('9001'));
          if (micProxy) setSelectedMic(micProxy.name);
          if (sysProxy) setSelectedSystem(sysProxy.name);
        })
        .catch(err => console.error("Failed to fetch devices", err));
    };

    fetchDevices();

    const ws = new WebSocket('ws://localhost:8000/ws');
    ws.onmessage = (event: MessageEvent) => {
      const msg = event.data;
      if (typeof msg === 'string') {
        if (msg.startsWith('LEVEL:')) {
          const [, label, value] = msg.split(':');
          setLevels(prev => ({ ...prev, [label]: parseInt(value) || 0 }));
        } else {
          setTranscripts(prev => [...prev.slice(-50), msg]);
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

  const handleDeviceChange = (label: string, deviceName: string) => {
    if (label === 'MIC') setSelectedMic(deviceName);
    else setSelectedSystem(deviceName);

    fetch('http://localhost:8000/select-device', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label, device_name: deviceName })
    });
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#121212', py: 5, color: '#fff' }}>
      <Container maxWidth="lg">
        <Typography variant="h4" align="center" sx={{ fontWeight: 'bold', mb: 4 }}>
          🐶 AudioWatchDoge Live Studio
        </Typography>
        
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={3}>
              <DeviceCard 
                title="Microphone (Input)" 
                label="MIC" 
                level={levels.MIC} 
                devices={devices}
                selectedValue={selectedMic}
                onSelect={(val: string) => handleDeviceChange('MIC', val)}
                icon={<Mic sx={{ color: '#2196f3' }} />} 
              />
              <DeviceCard 
                title="System Audio (Loopback)" 
                label="SYSTEM" 
                level={levels.SYSTEM} 
                devices={devices}
                selectedValue={selectedSystem}
                onSelect={(val: string) => handleDeviceChange('SYSTEM', val)}
                icon={<Speaker sx={{ color: '#9c27b0' }} />} 
              />
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Card sx={{ bgcolor: '#1e1e1e', color: '#fff', border: '1px solid #333', height: '600px', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1, borderBottom: '1px solid #333' }}>
                <History sx={{ color: '#4caf50' }} />
                <Typography variant="h6">Live Transcription</Typography>
              </Box>
              <CardContent sx={{ flexGrow: 1, overflowY: 'auto', bgcolor: '#000', p: 0 }} ref={scrollRef}>
                <Box sx={{ p: 2 }}>
                  {transcripts.length === 0 && (
                    <Typography sx={{ color: '#444', fontStyle: 'italic' }}>Waiting for audio signal...</Typography>
                  )}
                  {transcripts.map((t, i) => (
                    <Typography key={i} sx={{ 
                      fontFamily: 'monospace', 
                      mb: 1, 
                      color: t.includes('[MIC]') ? '#00ff00' : '#00ccff',
                      fontSize: '0.9rem'
                    }}>
                      {t}
                    </Typography>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

const DeviceCard = ({ title, label, level, icon, devices, selectedValue, onSelect }: any) => (
  <Card sx={{ bgcolor: '#1e1e1e', color: '#fff', border: '1px solid #333' }}>
    <CardContent>
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 2 }}>
        {icon}
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{title}</Typography>
      </Stack>

      <FormControl fullWidth size="small" sx={{ mb: 3 }}>
        <InputLabel sx={{ color: '#888' }}>Source</InputLabel>
        <Select
          value={selectedValue}
          label="Source"
          onChange={(e) => onSelect(e.target.value)}
          sx={{ color: '#fff', bgcolor: '#222', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#444' } }}
        >
          {devices.map((d: Device) => (
            <MenuItem key={d.name} value={d.name}>{d.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      
      <Box sx={{ width: '100%', mb: 1 }}>
        <LinearProgress 
          variant="determinate" 
          value={level} 
          sx={{ 
            height: 10, 
            borderRadius: 5, 
            bgcolor: '#333',
            '& .MuiLinearProgress-bar': {
               bgcolor: level > 80 ? '#f44336' : '#4caf50'
            }
          }} 
        />
      </Box>
      <Typography variant="caption" align="right" sx={{ display: 'block', color: '#888' }}>{level}%</Typography>
    </CardContent>
  </Card>
);

export default App;
