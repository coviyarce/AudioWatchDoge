import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Mic, Speaker, ScreenShare, PlayArrow } from '@mui/icons-material';

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
 * @description The 'HTML' place. Pure layout structure for the AudioWatchDoge Studio.
 * Grid replaced with Box Flex for absolute compatibility.
 */
function App() {
  const {
    levels, transcripts, highlights,
    isMicRecording, isSystemRecording,
    setupAudioStream, stopStream, startProxies
  } = useAudioEngine();

  return (
    <Box sx={studioStyles.appContainer}>
      
      {/* HEADER SECTION */}
      <Box sx={studioStyles.header}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>🐶 AudioWatchDoge Studio</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          
          <Button 
            variant="contained" 
            size="small" 
            color={isMicRecording ? "error" : "primary"} 
            onClick={() => isMicRecording ? stopStream('MIC') : setupAudioStream('MIC', false)}
          >
            MIC
          </Button>

          <Button 
            variant="contained" 
            size="small" 
            color={isSystemRecording ? "error" : "secondary"} 
            onClick={() => isSystemRecording ? stopStream('SYSTEM') : setupAudioStream('SYSTEM', true)}
          >
            SYSTEM
          </Button>

          <Button 
            variant="outlined" 
            size="small" 
            color="success" 
            onClick={startProxies}
          >
            PROXIES
          </Button>

        </Box>
      </Box>

      {/* MAIN STUDIO CONTENT AREA (FLEX LAYOUT) */}
      <Box sx={{ flexGrow: 1, display: 'flex', overflow: 'hidden', p: 2, gap: 2 }}>
        
        {/* SIDEBAR (approx 25% width) */}
        <Box sx={{ width: '300px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <DeviceCard 
            title="Microphone" 
            label="MIC" 
            level={levels.MIC} 
            icon={<Mic sx={{ color: '#2196f3' }} />} 
            status={isMicRecording ? "LIVE" : "OFF"} 
          />
          <DeviceCard 
            title="System Audio" 
            label="SYSTEM" 
            level={levels.SYSTEM} 
            icon={<Speaker sx={{ color: '#9c27b0' }} />} 
            status={isSystemRecording ? "LIVE" : "OFF"} 
          />
        </Box>

        {/* MAIN CONTENT (approx 75% width) */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2, overflow: 'hidden' }}>
          
          {/* TOP: Highlights Section */}
          <HighlightSection highlights={highlights} />

          {/* BOTTOM: Transcription Log Section */}
          <TranscriptionLog transcripts={transcripts} />

        </Box>

      </Box>
    </Box>
  );
}

export default App;
