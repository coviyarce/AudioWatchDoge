import React from 'react';
import { Box, Typography, Button, Paper, Fade, Chip, Container } from '@mui/material';
import { Mic, Speaker, ScreenShare, PlayArrow, Hub, DesignServices, Architecture, Public } from '@mui/icons-material';

// Styles
import { studioStyles } from './styles/StudioStyles';
// Hooks
import { useAudioEngine } from './hooks/useAudioEngine';
// Components
import { DeviceCard } from './components/DeviceCard';
import { HighlightSection } from './components/HighlightSection';
import { TranscriptionLog } from './components/TranscriptionLog';

/**
 * @file App.tsx
 * @description The 'HTML' place. Pure layout structure.
 * Switched to Pure Flexbox to avoid MUI Grid prop versioning conflicts.
 */
function App() {
  const {
    levels, transcripts, highlights,
    isMicRecording, isSystemRecording,
    packs, selectedPack, selectPack,
    setupAudioStream, stopStream, startProxies
  } = useAudioEngine();

  const getPackMeta = (p: string) => {
    switch(p) {
      case 'UX_UI': return { icon: <DesignServices />, color: '#ce93d8', desc: 'Focus on Design Thinking, Figma, and A11y.' };
      case 'ARCHITECT': return { icon: <Architecture />, color: '#90caf9', desc: 'Focus on Clean Architecture and CI/CD.' };
      default: return { icon: <Public />, color: '#a5d6a7', desc: 'General alerts, keywords, and identity.' };
    }
  };

  // 1. INTELLIGENCE DOMAIN SELECTION (Flexbox Layout)
  if (!selectedPack) {
    return (
      <Box sx={studioStyles.selectionScreen}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Hub sx={{ fontSize: 60, color: '#90caf9', mb: 2 }} />
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#fff', mb: 1 }}>Initialize Studio</Typography>
            <Typography variant="h6" sx={{ color: '#888' }}>Select your intelligence domain to begin live matching.</Typography>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 3, 
            justifyContent: 'center' 
          }}>
            {packs.map(p => {
              const meta = getPackMeta(p);
              return (
                <Box key={p} sx={{ flex: '1 1 280px', maxWidth: '320px' }}>
                  <Paper sx={studioStyles.packCard} onClick={() => selectPack(p)}>
                    <Box sx={{ color: meta.color, mb: 2 }}>{meta.icon}</Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>{p.replace('_', ' ')}</Typography>
                    <Typography variant="body2" sx={{ color: '#999', lineHeight: 1.6 }}>{meta.desc}</Typography>
                  </Paper>
                </Box>
              );
            })}
          </Box>
        </Container>
      </Box>
    );
  }

  // 2. MAIN STUDIO INTERFACE
  return (
    <Fade in={true} timeout={800}>
      <Box sx={studioStyles.appContainer}>
        
        {/* HEADER SECTION */}
        <Box sx={studioStyles.header}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>🐶 AudioWatchDoge</Typography>
            <Chip label={selectedPack} sx={{ bgcolor: '#333', color: '#90caf9', fontWeight: 'bold' }} size="small" />
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" size="small" sx={{ bgcolor: isMicRecording ? '#ef9a9a' : '#90caf9', color: '#111', fontWeight: 'bold' }} startIcon={<Mic />} onClick={() => isMicRecording ? stopStream('MIC') : setupAudioStream('MIC', false)}>MIC</Button>
            <Button variant="contained" size="small" sx={{ bgcolor: isSystemRecording ? '#ef9a9a' : '#ce93d8', color: '#111', fontWeight: 'bold' }} startIcon={<ScreenShare />} onClick={() => isSystemRecording ? stopStream('SYSTEM') : setupAudioStream('SYSTEM', true)}>SYSTEM</Button>
            <Button variant="outlined" size="small" sx={{ borderColor: '#a5d6a7', color: '#a5d6a7', fontWeight: 'bold' }} startIcon={<PlayArrow />} onClick={startProxies}>PROXIES</Button>
            <Button size="small" sx={{ color: '#555' }} onClick={() => window.location.reload()}>RESET</Button>
          </Box>
        </Box>

        {/* WORKSPACE SECTION */}
        <Box sx={studioStyles.mainStudio}>
          <Box sx={{ display: 'flex', gap: 3, height: '100%' }}>
            {/* SIDEBAR */}
            <Box sx={{ width: '280px', flexShrink: 0 }}>
              <DeviceCard title="Live Mic" label="MIC" level={levels.MIC} icon={<Mic sx={{ color: '#90caf9' }} />} status={isMicRecording ? "LIVE" : "OFF"} />
              <DeviceCard title="Desktop Audio" label="SYSTEM" level={levels.SYSTEM} icon={<Speaker sx={{ color: '#ce93d8' }} />} status={isSystemRecording ? "LIVE" : "OFF"} />
            </Box>
            {/* MAIN CONTENT */}
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 3, overflow: 'hidden' }}>
              <HighlightSection highlights={highlights} />
              <TranscriptionLog transcripts={transcripts} />
            </Box>
          </Box>
        </Box>

      </Box>
    </Fade>
  );
}

export default App;
