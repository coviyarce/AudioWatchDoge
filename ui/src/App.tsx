import React from 'react';
import { Box, Typography, Button, Paper, Fade, Chip, Container } from '@mui/material';
import { Mic, Speaker, ScreenShare, PlayArrow, Hub, DesignServices, Architecture, Public } from '@mui/icons-material';

// Styles
import { studioStyles, M2 } from './styles/StudioStyles';
// Hooks
import { useAudioEngine } from './hooks/useAudioEngine';
// Components
import { DeviceCard } from './components/DeviceCard';
import { HighlightSection } from './components/HighlightSection';
import { TranscriptionLog } from './components/TranscriptionLog';

function App() {
  const {
    levels, transcripts, highlights,
    isMicRecording, isSystemRecording,
    packs, selectedPack, selectPack,
    setupAudioStream, stopStream, startProxies
  } = useAudioEngine();

  const getPackMeta = (p: string) => {
    switch(p) {
      case 'UX_UI': return { icon: <DesignServices />, color: M2.primary, desc: 'Focus on Design Thinking, Figma, and A11y.' };
      case 'ARCHITECT': return { icon: <Architecture />, color: M2.secondary, desc: 'Focus on Clean Architecture and CI/CD.' };
      default: return { icon: <Public />, color: '#a5d6a7', desc: 'General alerts, keywords, and identity.' };
    }
  };

  // 1. INTELLIGENCE DOMAIN SELECTION
  if (!selectedPack) {
    return (
      <Box sx={studioStyles.selectionScreen}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Hub sx={{ fontSize: 60, color: M2.primary, mb: 2 }} />
            <Typography variant="h3" sx={{ fontWeight: 800, color: M2.onBackground, mb: 1 }}>Initialize Studio</Typography>
            <Typography variant="h6" sx={{ color: M2.mediumEmphasis }}>Select your intelligence domain to begin live matching.</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
            {packs.map(p => {
              const meta = getPackMeta(p);
              return (
                <Box key={p} sx={{ flex: '1 1 280px', maxWidth: '320px' }}>
                  <Paper sx={studioStyles.packCard} onClick={() => selectPack(p)}>
                    <Box sx={{ color: meta.color, mb: 2 }}>{meta.icon}</Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: M2.onSurface }}>{p.replace('_', ' ')}</Typography>
                    <Typography variant="body2" sx={{ color: M2.mediumEmphasis, lineHeight: 1.6 }}>{meta.desc}</Typography>
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
            <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: -0.5, color: M2.primary }}>🐶 AudioWatchDoge</Typography>
            <Chip label={selectedPack} sx={{ bgcolor: M2.background, color: M2.secondary, fontWeight: 'bold', borderColor: 'rgba(255,255,255,0.12)' }} size="small" variant="outlined" />
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" size="small" sx={{ bgcolor: isMicRecording ? M2.error : M2.primary, color: '#000', fontWeight: 'bold', '&:hover': { opacity: 0.9 } }} startIcon={<Mic />} onClick={() => isMicRecording ? stopStream('MIC') : setupAudioStream('MIC', false)}>MIC</Button>
            <Button variant="contained" size="small" sx={{ bgcolor: isSystemRecording ? M2.error : M2.secondary, color: '#000', fontWeight: 'bold', '&:hover': { opacity: 0.9 } }} startIcon={<ScreenShare />} onClick={() => isSystemRecording ? stopStream('SYSTEM') : setupAudioStream('SYSTEM', true)}>SYSTEM</Button>
            <Button variant="outlined" size="small" sx={{ borderColor: M2.secondary, color: M2.secondary, fontWeight: 'bold' }} startIcon={<PlayArrow />} onClick={startProxies}>PROXIES</Button>
            <Button size="small" sx={{ color: M2.mediumEmphasis }} onClick={() => window.location.reload()}>RESET</Button>
          </Box>
        </Box>

        {/* WORKSPACE SECTION */}
        <Box sx={studioStyles.mainStudio}>
          <Box sx={{ display: 'flex', gap: 3, height: '100%' }}>
            {/* SIDEBAR */}
            <Box sx={{ width: '280px', flexShrink: 0 }}>
              <DeviceCard title="Live Mic" label="MIC" level={levels.MIC} icon={<Mic sx={{ color: M2.primary }} />} status={isMicRecording ? "LIVE" : "OFF"} />
              <DeviceCard title="Desktop Audio" label="SYSTEM" level={levels.SYSTEM} icon={<Speaker sx={{ color: M2.secondary }} />} status={isSystemRecording ? "LIVE" : "OFF"} />
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
