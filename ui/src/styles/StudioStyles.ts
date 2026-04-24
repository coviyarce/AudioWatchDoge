import { SxProps, Theme } from '@mui/material';

/**
 * @file StudioStyles.ts
 * @description The 'CSS' place. Soft Dark & Pastel palette for premium UX.
 */

export const studioStyles = {
  appContainer: {
    height: '100vh',
    width: '100vw',
    bgcolor: '#1a1a1b',
    color: '#e2e2e2',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    fontFamily: '"Inter", "Roboto", sans-serif'
  } as SxProps<Theme>,

  header: {
    p: 2,
    borderBottom: '1px solid #2d2d2d',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    bgcolor: '#212122'
  } as SxProps<Theme>,

  selectionScreen: {
    height: '100vh',
    width: '100vw',
    bgcolor: '#1a1a1b',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    p: 3
  } as SxProps<Theme>,

  packCard: {
    p: 3,
    bgcolor: '#252526',
    border: '1px solid #333',
    borderRadius: 4,
    transition: 'all 0.2s ease-in-out',
    cursor: 'pointer',
    '&:hover': {
      borderColor: '#90caf9',
      transform: 'translateY(-4px)',
      bgcolor: '#2a2a2b'
    }
  } as SxProps<Theme>,

  mainStudio: {
    flexGrow: 1,
    p: 3,
    overflow: 'hidden'
  } as SxProps<Theme>,

  highlightCard: {
    flex: '0 0 42%',
    bgcolor: '#212122',
    color: '#e2e2e2',
    border: '1px solid #333',
    borderRadius: 3,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  } as SxProps<Theme>,

  highlightContainer: {
    flexGrow: 1,
    overflowY: 'auto',
    p: 2,
    bgcolor: '#252526'
  } as SxProps<Theme>,

  logCard: {
    flex: '1 1 58%',
    bgcolor: '#212122',
    color: '#e2e2e2',
    border: '1px solid #333',
    borderRadius: 3,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  } as SxProps<Theme>,

  logContainer: {
    flexGrow: 1,
    overflowY: 'auto',
    p: 2,
    bgcolor: '#161617',
    fontFamily: '"Fira Code", monospace'
  } as SxProps<Theme>,

  deviceCard: {
    bgcolor: '#212122',
    color: '#e2e2e2',
    border: '1px solid #333',
    borderRadius: 3,
    mb: 2
  } as SxProps<Theme>
};
