import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Drawer, List, ListItemButton, ListItemIcon, ListItemText, 
  Toolbar, Typography, Divider, Box, useTheme, useMediaQuery 
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StoreIcon from '@mui/icons-material/Store';
import AssessmentIcon from '@mui/icons-material/Assessment';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import InventoryIcon from '@mui/icons-material/Inventory';
import TimelineIcon from '@mui/icons-material/Timeline';
import DescriptionIcon from '@mui/icons-material/Description';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../../context/AuthContext';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Shelf Map', icon: <StoreIcon />, path: '/shelf-map' },
  { text: 'Alerts', icon: <NotificationsIcon />, path: '/alerts' },
  { text: 'Analytics', icon: <AssessmentIcon />, path: '/analytics' },
  { text: 'Planogram', icon: <ViewQuiltIcon />, path: '/planogram' },
  { text: 'Cameras', icon: <CameraAltIcon />, path: '/cameras' },
  { text: 'Products', icon: <InventoryIcon />, path: '/products' },
  { text: 'Forecasting', icon: <TimelineIcon />, path: '/forecasting' },
  { text: 'Reports', icon: <DescriptionIcon />, path: '/reports' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
];

const Sidebar = ({ open, onClose, variant }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const theme = useTheme();

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
          Smart Retail
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItemButton 
              key={item.text} 
              onClick={() => { navigate(item.path); onClose?.(); }}
              selected={isActive}
              sx={{
                '&.Mui-selected': {
                  bgcolor: 'primary.light',
                  color: 'primary.contrastText',
                  '& .MuiListItemIcon-root': {
                    color: 'primary.contrastText',
                  },
                },
                '&:hover': {
                  bgcolor: 'rgba(37, 99, 235, 0.08)',
                },
              }}
            >
              <ListItemIcon sx={{ color: isActive ? 'inherit' : 'primary.main' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          );
        })}
      </List>
      <Divider />
      <List>
        <ListItemButton onClick={logout} sx={{ color: 'error.main' }}>
          <ListItemIcon sx={{ color: 'error.main' }}><LogoutIcon /></ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: '1px solid #E5E7EB',
          bgcolor: 'background.paper',
        },
      }}
    >
      {drawer}
    </Drawer>
  );
};

export default Sidebar;