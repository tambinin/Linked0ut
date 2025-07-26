import { createTheme } from '@mui/material/styles';

// LinkedOut Color Palette - Specific Requirements
export const colors = {
  // Primary colors from requirements
  yellow: '#FCDC4B',    // Jaune principal
  blue: '#2F4F93',      // Bleu principal  
  white: '#FFFFFF',     // Blanc
  
  // Subtle greys for text and borders (minimal usage)
  greyLight: '#F8F9FA',
  greyMedium: '#E1E5E9',
  greyDark: '#666666',
  greyText: '#404040',
  
  // Status colors (minimal, match LinkedIn)
  success: '#057642',
  warning: '#F5C842', 
  error: '#CC1016',
};

// LinkedIn-inspired spacing and layout
export const spacing = {
  xs: '4px',
  sm: '8px', 
  md: '12px',
  lg: '16px',
  xl: '20px',
  xxl: '24px',
  xxxl: '32px',
};

export const breakpoints = {
  mobile: '768px',
  tablet: '1200px',
  desktop: '1200px',
};

// Material-UI Theme with LinkedOut colors
export const theme = createTheme({
  palette: {
    primary: {
      main: colors.blue,      // Blue for primary actions
      light: '#4F6FB8',
      dark: '#1E3A6F',
      contrastText: colors.white,
    },
    secondary: {
      main: colors.yellow,    // Yellow for accents and highlights
      light: '#FCEC7B', 
      dark: '#E8C442',
      contrastText: colors.greyText,
    },
    background: {
      default: colors.greyLight,
      paper: colors.white,
    },
    text: {
      primary: colors.greyText,
      secondary: colors.greyDark,
    },
    success: {
      main: colors.success,
    },
    warning: {
      main: colors.warning,
    },
    error: {
      main: colors.error,
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.125rem',
      fontWeight: 600,
      lineHeight: 1.2,
      color: colors.greyText,
    },
    h2: {
      fontSize: '1.5rem', 
      fontWeight: 600,
      lineHeight: 1.3,
      color: colors.greyText,
    },
    h3: {
      fontSize: '1.25rem',
      fontWeight: 600, 
      lineHeight: 1.4,
      color: colors.greyText,
    },
    h4: {
      fontSize: '1.125rem',
      fontWeight: 500,
      lineHeight: 1.4,
      color: colors.greyText,
    },
    body1: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: colors.greyText,
    },
    body2: {
      fontSize: '0.75rem',
      lineHeight: 1.4,
      color: colors.greyDark,
    },
  },
  shape: {
    borderRadius: 8,  // LinkedIn-style border radius
  },
  shadows: [
    'none',
    '0 2px 8px rgba(0,0,0,0.08)',  // Subtle card shadow like LinkedIn
    '0 4px 12px rgba(0,0,0,0.12)',
    '0 8px 24px rgba(0,0,0,0.15)',
    // ... other shadows
  ],
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: colors.white,
          border: `1px solid ${colors.greyMedium}`,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          borderRadius: '8px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '24px', // LinkedIn button style
          fontWeight: 600,
          fontSize: '0.875rem',
        },
        contained: {
          backgroundColor: colors.blue,
          color: colors.white,
          '&:hover': {
            backgroundColor: '#1E3A6F',
          },
        },
        outlined: {
          borderColor: colors.blue,
          color: colors.blue,
          '&:hover': {
            backgroundColor: 'rgba(47, 79, 147, 0.04)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: colors.white,
          color: colors.greyText,
          boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
          borderBottom: `1px solid ${colors.greyMedium}`,
        },
      },
    },
  },
});

export default theme;