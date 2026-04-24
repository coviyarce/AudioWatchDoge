import { SxProps, Theme } from '@mui/material';

/**
 * @file StudioStyles.ts
 * @description Material Design 2 (M2) Dark Theme Manifest.
 * Strictly follows https://m2.material.io/design/color/dark-theme.html
 */

const M2 = {
  background: '#121212',
  surface01dp: '#1e1e1e',
  surface02dp: '#222222',
  surface03dp: '#242424',
  surface04dp: '#272727',
  primary: '#BB86FC',    // Pastel Purple
  secondary: '#03DAC6',  // Teal
  error: '#CF6679',      // Pink-Red
  onBackground: 'rgba(255, 255, 255, 0.87)',
  onSurface: 'rgba(255, 255, 255, 0.87)',
  mediumEmphasis: 'rgba(255, 255, 255, 0.60)',
  disabled: 'rgba(255, 255, 255, 0.38)',
};

export const studioStyles = {
  appContainer: {
    height: '100vh',
    width: '100vw',
    bgcolor: M2.background,
    color: M2.onBackground,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    fontFamily: '"Roboto", "Inter", sans-serif'
  } as SxProps<Theme>,

  header: {
    p: 2,
    borderBottom: '1px solid rgba(255,255,255,0.12)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    bgcolor: M2.surface04dp,
    boxShadow: '0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.2)'
  } as SxProps<Theme>,

  selectionScreen: {
    height: '100vh',
    width: '100vw',
    bgcolor: M2.background,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    p: 3
  } as SxProps<Theme>,

  packCard: {
    p: 3,
    bgcolor: M2.surface01dp,
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 1,
    transition: 'background-color 0.2s',
    cursor: 'pointer',
    '&:hover': {
      bgcolor: M2.surface04dp,
      borderColor: M2.primary
    }
  } as SxProps<Theme>,

  mainStudio: {
    flexGrow: 1,
    p: 3,
    overflow: 'hidden'
  } as SxProps<Theme>,

  highlightCard: {
    flex: '0 0 42%',
    bgcolor: M2.surface01dp,
    color: M2.onSurface,
    borderRadius: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxShadow: '0 2px 4px rgba(0,0,0,0.5)'
  } as SxProps<Theme>,

  highlightContainer: {
    flexGrow: 1,
    overflowY: 'auto',
    p: 2,
    bgcolor: '#1a1a1a'
  } as SxProps<Theme>,

  logCard: {
    flex: '1 1 58%',
    bgcolor: M2.surface01dp,
    color: M2.onSurface,
    borderRadius: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxShadow: '0 2px 4px rgba(0,0,0,0.5)'
  } as SxProps<Theme>,

  logContainer: {
    flexGrow: 1,
    overflowY: 'auto',
    p: 2,
    bgcolor: '#000000',
    fontFamily: '"Fira Code", monospace'
  } as SxProps<Theme>,

  deviceCard: {
    bgcolor: M2.surface01dp,
    color: M2.onSurface,
    borderRadius: 1,
    mb: 2,
    border: '1px solid rgba(255,255,255,0.05)'
  } as SxProps<Theme>
};

export { M2 };
