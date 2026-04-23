import React from 'react';
import { Card, CardContent, Box, Typography, Chip, LinearProgress } from '@mui/material';
import { studioStyles } from '../styles/StudioStyles';

interface DeviceCardProps {
  title: string;
  label: string;
  level: number;
  icon: React.ReactNode;
  status: string;
}

/**
 * @component DeviceCard
 * @description Renders a signal meter and status indicator for a specific audio source.
 * 
 * NEXT DEVELOPER: Add a 'gain' slider to adjust signal sensitivity per device.
 */
export const DeviceCard = ({ title, label, level, icon, status }: DeviceCardProps) => (
  <Card sx={studioStyles.deviceCard}>
    <CardContent sx={{ p: '16px !important' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
        {icon}
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{title}</Typography>
        <Chip 
          label={status} 
          color={status === "LIVE" ? "success" : "default"} 
          sx={{ height: 16, fontSize: '8px' }} 
        />
      </Box>
      <LinearProgress 
        variant="determinate" 
        value={level} 
        sx={{ 
          height: 8, 
          borderRadius: 4, 
          bgcolor: '#333', 
          '& .MuiLinearProgress-bar': { 
            bgcolor: level > 80 ? '#f44336' : '#4caf50' 
          } 
        }} 
      />
      <Typography variant="caption" align="right" sx={{ display: 'block', mt: 0.5, fontSize: '10px' }}>
        {level}%
      </Typography>
    </CardContent>
  </Card>
);
