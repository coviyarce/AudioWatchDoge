import React, { useEffect, useRef } from 'react';
import { Card, Box, Typography } from '@mui/material';
import { studioStyles } from '../styles/StudioStyles';

interface TranscriptionLogProps {
  transcripts: string[];
}

/**
 * @component TranscriptionLog
 * @description The live transcript feed. Visualized as a black terminal with auto-scroll.
 * 
 * NEXT DEVELOPER: Add a toggle to filter by specific source (MIC only / SYSTEM only).
 */
export const TranscriptionLog = ({ transcripts }: TranscriptionLogProps) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcripts]);

  return (
    <Card sx={studioStyles.logCard}>
      <Box sx={{ p: 1.5, borderBottom: '1px solid #333' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Live Transcription</Typography>
      </Box>
      <Box sx={studioStyles.logContainer}>
        {transcripts.map((t, i) => (
          <Typography 
            key={i} 
            sx={{ 
              color: t.includes('[MIC]') ? '#00ff00' : '#00ccff', 
              mb: 0.5, 
              fontSize: '0.85rem' 
            }}
          >
            {t}
          </Typography>
        ))}
        <div ref={endRef} />
      </Box>
    </Card>
  );
};
