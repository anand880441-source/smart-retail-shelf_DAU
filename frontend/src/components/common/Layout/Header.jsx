import React from 'react';
import { 
  AppBar, Toolbar, Typography, IconButton, Avatar, 
  Box, Badge, Tooltip, useMediaQuery, useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import { useAuth } from '../../../context/AuthContext';
import { useAlerts } from '../../../context/AlertContext';

const Header = ({ onMenuClick }) => {
  const { user } = useAuth();
  const { alerts } = useAlerts();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const activeAlertsCount = alerts?.length || 0;

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        bgcolor: 'rgba(11, 15, 26, 0.8)', 
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        color: 'text.primary', 
        boxShadow: 'none',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        zIndex: (theme) => theme.zIndex.appBar,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: { xs: 56, md: 64 }, px: { xs: 1, sm: 2, md: 3 } }}>
        {/* Left side */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton 
            onClick={onMenuClick} 
            sx={{ 
              color: 'text.secondary',
              '&:hover': { color: 'primary.main', bgcolor: 'rgba(99, 102, 241, 0.08)' }
            }}
          >
            {isMobile ? <MenuIcon /> : <MenuOpenIcon />}
          </IconButton>
          
          <Typography 
            variant="h6" 
            noWrap
            sx={{ 
              fontWeight: 800, 
              fontSize: { xs: '0.95rem', sm: '1.1rem' },
              letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, #6366F1 0%, #A855F7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            SMART RETAIL
          </Typography>
        </Box>
        
        {/* Right side */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1.5 } }}>
          <IconButton 
            color="inherit" 
            sx={{ 
              display: { xs: 'none', sm: 'flex' }, 
              color: 'text.secondary',
              '&:hover': { color: 'text.primary' }
            }}
          >
            <SearchIcon fontSize="small" />
          </IconButton>

          <Tooltip title="Notifications">
            <IconButton 
              color="inherit" 
              sx={{ 
                color: 'text.secondary',
                '&:hover': { color: 'text.primary', bgcolor: 'rgba(99, 102, 241, 0.08)' }
              }}
            >
              <Badge 
                badgeContent={activeAlertsCount} 
                color="primary" 
                sx={{ '& .MuiBadge-badge': { fontWeight: 700, fontSize: '0.65rem' } }}
              >
                <NotificationsIcon fontSize="small" />
              </Badge>
            </IconButton>
          </Tooltip>
          
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              bgcolor: 'rgba(255,255,255,0.03)',
              py: 0.5,
              px: { xs: 0.5, sm: 1.5 },
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.05)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.06)',
                borderColor: 'rgba(99, 102, 241, 0.15)'
              }
            }}
          >
            <Box sx={{ textAlign: 'right', display: { xs: 'none', md: 'block' } }}>
              <Typography variant="body2" noWrap sx={{ fontWeight: 700, color: 'text.primary', lineHeight: 1.2, fontSize: '0.8rem' }}>
                {user?.name || 'User'}
              </Typography>
              <Typography variant="caption" noWrap sx={{ color: 'text.secondary', fontWeight: 500, fontSize: '0.65rem' }}>
                Store Associate
              </Typography>
            </Box>
            <Avatar 
              sx={{ 
                background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                width: 32, 
                height: 32, 
                fontSize: '0.8rem',
                fontWeight: 700,
              }}
            >
              {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </Avatar>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;