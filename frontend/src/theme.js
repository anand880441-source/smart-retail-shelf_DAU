import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366F1', // Indigo Vibrant
      light: '#818CF8',
      dark: '#4F46E5',
      contrastText: '#fff',
    },
    secondary: {
      main: '#10B981', // Emerald Vibrant
      light: '#34D399',
      dark: '#059669',
      contrastText: '#fff',
    },
    background: {
      default: '#0B0F1A', // Deep Slate
      paper: '#111827',   // Slightly Lighter
    },
    text: {
      primary: '#F9FAFB',
      secondary: '#9CA3AF',
    },
    divider: 'rgba(255, 255, 255, 0.08)',
  },
  typography: {
    fontFamily: [
      'Outfit',
      'Inter',
      'sans-serif',
    ].join(','),
    h1: { fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em' },
    h2: { fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.01em' },
    h3: { fontSize: '1.5rem', fontWeight: 700 },
    h4: { fontSize: '1.25rem', fontWeight: 600 },
    body1: { fontSize: '1rem', color: '#9CA3AF' },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '10px 24px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': { transform: 'translateY(-2px)' },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
          boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.39)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(17, 24, 39, 0.7)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
          transition: 'transform 0.2s ease',
          '&:hover': { transform: 'translateY(-4px)' },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

export default theme;
