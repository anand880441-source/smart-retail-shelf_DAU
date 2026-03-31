import React, { useState, useEffect } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';

const drawerWidth = 260;

const MainLayout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  // Auto-close sidebar when switching to mobile
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', position: 'relative', bgcolor: 'background.default' }}>
      <Box className="surface-noise" />
      <Sidebar 
        open={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        variant={isMobile ? 'temporary' : 'persistent'} 
      />
      
      <Box
        component="div"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          width: '100%',
          ml: sidebarOpen && !isMobile ? `${drawerWidth}px` : 0,
          transition: theme.transitions.create(['margin-left'], {
            easing: theme.transitions.easing.easeInOut,
            duration: 300,
          }),
        }}
      >
        <Header onMenuClick={toggleSidebar} />
        
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            p: { xs: 1.5, sm: 2, md: 3, lg: 4 },
            width: '100%',
            maxWidth: '1600px',
            mx: 'auto',
            overflow: 'hidden',
            background: 'radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.04) 0%, transparent 50%)',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
