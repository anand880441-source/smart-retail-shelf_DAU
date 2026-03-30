import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Avatar, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const Header = ({ onMenuClick, user }) => {
  return (
    <AppBar position="fixed" sx={{ zIndex: 1201, bgcolor: 'white', color: '#1F2937', boxShadow: 1 }}>
      <Toolbar>
        <IconButton edge="start" onClick={onMenuClick} sx={{ mr: 2, display: { sm: 'none' } }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', color: '#2563EB' }}>
          Smart Retail Shelf Intelligence
        </Typography>
        <Avatar sx={{ bgcolor: '#2563EB' }}>
          {user?.name?.charAt(0) || 'U'}
        </Avatar>
      </Toolbar>
    </AppBar>
  );
};

export default Header;