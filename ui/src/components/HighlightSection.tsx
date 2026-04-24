import React, { useEffect, useRef } from 'react';
import { Card, Box, Typography, Chip } from '@mui/material';
import { FilterAlt } from '@mui/icons-material';
import { studioStyles } from '../styles/StudioStyles';
import { Highlight } from '../types';

interface HighlightSectionProps {
  highlights: Highlight[];
}

/**
 * @component HighlightSection
 * @description Displays the contextual matching results with auto-scroll persistence.
 * 
 * NEXT DEVELOPER: Implement a 'Copy' button for each highlight verbatim.
 */
export const HighlightSection = ({ highlights }: HighlightSectionProps) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [highlights]);

  return (
    <Card sx={studioStyles.highlightCard}>
      <Box sx={{ p: 1.5, borderBottom: '1px solid #333', display: 'flex', alignItems: 'center', gap: 1 }}>
        <FilterAlt sx={{ color: '#4caf50' }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Contextual Highlights</Typography>
      </Box>
      <Box sx={studioStyles.highlightContainer}>
        {highlights.length === 0 && (
          <Typography sx={{ color: '#444', fontStyle: 'italic' }}>No subject matches detected yet...</Typography>
        )}
        {highlights.map((h, i) => (
          <Box key={i} sx={{ mb: 2, p: 1.5, bgcolor: '#1a1a1a', borderRadius: 1, borderLeft: '4px solid #4caf50' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Chip label={h.label} size="small" color="success" sx={{ height: 18, fontSize: '9px' }} />
              <Typography variant="caption" sx={{ color: '#666' }}>{h.timestamp}</Typography>
            </Box>
            <Typography sx={{ color: '#aaa', fontSize: '0.8rem', fontStyle: 'italic' }}>
              ...{h.context}
            </Typography>
            <Typography sx={{ color: '#fff', fontWeight: 'bold' }}>
              "{h.verbatim}"
            </Typography>
          </Box>
        ))}
        <div ref={endRef} />
      </Box>
    </Card>
  );
};
