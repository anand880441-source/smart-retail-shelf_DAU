import React, { createContext, useContext, useState } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../theme';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // We've moved to a single "Premium Dark Mode" theme as approved.
  const [darkMode] = useState(true);

  return (
    <ThemeContext.Provider value={{ darkMode }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);