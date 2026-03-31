import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Drawer, List, ListItemButton, ListItemIcon, ListItemText, 
  Toolbar, Typography, Divider, Box, useTheme
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

const drawerWidth = 260;

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
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 2 }}>
      <Box sx={{ px: 2, py: 3, mb: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box 
          sx={{ 
            width: 32, 
            height: 32, 
            borderRadius: '8px', 
            background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
          }}
        >
          <StoreIcon sx={{ color: 'white', fontSize: 20 }} />
        </Box>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 800, 
            letterSpacing: '-0.02em',
            color: 'text.primary',
            fontSize: '1.2rem'
          }}
        >
          Smart Shelf
        </Typography>
      </Box>

      <List sx={{ flexGrow: 1, px: 0 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItemButton 
              key={item.text} 
              onClick={() => { navigate(item.path); onClose?.(); }}
              sx={{
                mb: 0.5,
                borderRadius: '12px',
                transition: 'all 0.2s ease',
                position: 'relative',
                color: isActive ? 'primary.main' : 'text.secondary',
                bgcolor: isActive ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.03)',
                  color: 'primary.main',
                  '& .MuiListItemIcon-root': { color: 'primary.main' }
                },
                ...(isActive && {
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: '20%',
                    height: '60%',
                    width: '4px',
                    bgcolor: 'primary.main',
                    borderRadius: '0 4px 4px 0',
                    boxShadow: '0 0 12px #6366F1'
                  }
                })
              }}
            >
              <ListItemIcon 
                sx={{ 
                  minWidth: 40,
                  color: isActive ? 'primary.main' : 'text.secondary',
                  transition: 'color 0.2s ease'
                }}
              >
                {React.cloneElement(item.icon, { fontSize: 'small' })}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ 
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.9rem'
                }} 
              />
            </ListItemButton>
          );
        })}
      </List>

      <Box sx={{ mt: 'auto', pt: 2 }}>
        <ListItemButton 
          onClick={logout} 
          sx={{ 
            borderRadius: '12px',
            color: 'error.main',
            '&:hover': {
              bgcolor: 'rgba(239, 68, 68, 0.08)'
            }
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: 'error.main' }}>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText 
            primary="Logout" 
            primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }} 
          />
        </ListItemButton>
      </Box>
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
          borderRight: '1px solid rgba(255, 255, 255, 0.06)',
          bgcolor: '#0B0F1A',
          backgroundImage: 'none',
          overflowX: 'hidden',
          top: 0,
          height: '100vh',
        },
      }}
    >
      {drawer}
    </Drawer>
  );
};

export default Sidebar;