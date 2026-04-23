import { SxProps, Theme } from '@mui/material';

/**
 * @file StudioStyles.ts
 * @description The 'CSS' place. Centralized styling manifest for AudioWatchDoge Studio.
 * Uses MUI SxProps for theme-aware, maintainable layouts.
 * 
 * NEXT DEVELOPER: Add animation keyframes or custom variants here.
 */

export const studioStyles = {
  appContainer: {
    height: '100vh',
    width: '100vw',
    bgcolor: '#121212',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  } as SxProps<Theme>,

  header: {
    p: 2,
    borderBottom: '1px solid #333',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    bgcolor: '#1a1a1a'
  } as SxProps<Theme>,

  mainStudio: {
    flexGrow: 1,
    p: 2,
    overflow: 'hidden'
  } as SxProps<Theme>,

  highlightCard: {
    flex: '0 0 40%',
    bgcolor: '#1e1e1e',
    color: '#fff',
    border: '1px solid #4caf50',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  } as SxProps<Theme>,

  highlightContainer: {
    flexGrow: 1,
    overflowY: 'auto',
    p: 2,
    bgcolor: '#252525'
  } as SxProps<Theme>,

  logCard: {
    flex: '1 1 60%',
    bgcolor: '#1e1e1e',
    color: '#fff',
    border: '1px solid #333',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  } as SxProps<Theme>,

  logContainer: {
    flexGrow: 1,
    overflowY: 'auto',
    p: 2,
    bgcolor: '#000',
    fontFamily: 'monospace'
  } as SxProps<Theme>,

  deviceCard: {
    bgcolor: '#1e1e1e',
    color: '#fff',
    border: '1px solid #333'
  } as SxProps<Theme>
};
