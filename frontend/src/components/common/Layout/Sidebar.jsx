import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography, Divider, Box } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StoreIcon from '@mui/icons-material/Store';
import AssessmentIcon from '@mui/icons-material/Assessment';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Shelf Map', icon: <StoreIcon />, path: '/shelf-map' },
  { text: 'Alerts', icon: <NotificationsIcon />, path: '/alerts' },
  { text: 'Analytics', icon: <AssessmentIcon />, path: '/analytics' },
  { text: 'Planogram', icon: <ViewQuiltIcon />, path: '/planogram' },
  { text: 'Cameras', icon: <CameraAltIcon />, path: '/cameras' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
];

const Sidebar = ({ mobileOpen, onClose, onNavigate, onLogout }) => {
  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" sx={{ color: '#2563EB', fontWeight: 'bold' }}>
          Smart Retail
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem button key={item.text} onClick={() => { onNavigate(item.path); onClose?.(); }}>
            <ListItemIcon sx={{ color: '#2563EB' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem button onClick={onLogout}>
          <ListItemIcon sx={{ color: '#EF4444' }}><LogoutIcon /></ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box component="nav">
      <Drawer variant="temporary" open={mobileOpen} onClose={onClose} ModalProps={{ keepMounted: true }} sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { width: drawerWidth } }}>
        {drawer}
      </Drawer>
      <Drawer variant="permanent" sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { width: drawerWidth } }} open>
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;