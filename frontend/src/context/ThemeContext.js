import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';

const ThemeContext = createContext();

const lightTheme = createTheme({
  palette: { mode: 'light', primary: { main: '#2563EB' } }
});

const darkTheme = createTheme({
  palette: { mode: 'dark', primary: { main: '#3B82F6' }, background: { default: '#1F2937', paper: '#374151' } }
});

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('dark_mode') === 'true');

  useEffect(() => {
    localStorage.setItem('dark_mode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <MuiThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);