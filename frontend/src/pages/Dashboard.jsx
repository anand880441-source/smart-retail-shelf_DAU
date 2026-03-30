import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StoreIcon from '@mui/icons-material/Store';
import AssessmentIcon from '@mui/icons-material/Assessment';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import AlertsPage from './AlertsPage';
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';

const drawerWidth = 240;

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Shelf Map', icon: <StoreIcon />, path: '/shelf-map' },
    { text: 'Alerts', icon: <NotificationsIcon />, path: '/alerts' },
    { text: 'Analytics', icon: <AssessmentIcon />, path: '/analytics' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
    { text: 'Analytics', icon: <AssessmentIcon />, path: '/analytics' },
    { text: 'Planogram', icon: <ViewQuiltIcon />, path: '/planogram' }
  ];

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
          <ListItem button key={item.text} onClick={() => navigate(item.path)}>
            <ListItemIcon sx={{ color: '#2563EB' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem button onClick={handleLogout}>
          <ListItemIcon sx={{ color: '#EF4444' }}><LogoutIcon /></ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: 1201, bgcolor: 'white', color: '#1F2937', boxShadow: 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', color: '#2563EB' }}>
            Smart Retail Shelf Intelligence
          </Typography>
          <IconButton onClick={handleMenuOpen}>
            <Avatar sx={{ bgcolor: '#2563EB' }}>
              {user?.name?.charAt(0) || 'U'}
            </Avatar>
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem disabled>
              <Typography variant="body2">{user?.name}</Typography>
            </MenuItem>
            <MenuItem disabled>
              <Typography variant="caption" color="textSecondary">{user?.email}</Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { width: drawerWidth } }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { width: drawerWidth } }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom>Welcome, {user?.name || 'User'}!</Typography>

          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6} lg={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>Store Health</Typography>
                  <Typography variant="h3" sx={{ color: '#10B981' }}>92%</Typography>
                  <Typography variant="body2">↑ 5% from last week</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6} lg={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>Active Stockouts</Typography>
                  <Typography variant="h3" sx={{ color: '#EF4444' }}>12</Typography>
                  <Typography variant="body2">Critical: 3 | Warning: 9</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6} lg={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>Revenue at Risk</Typography>
                  <Typography variant="h3" sx={{ color: '#F59E0B' }}>$4,231</Typography>
                  <Typography variant="body2">From current stockouts</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6} lg={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>Planogram Compliance</Typography>
                  <Typography variant="h3" sx={{ color: '#2563EB' }}>87%</Typography>
                  <Typography variant="body2">↑ 12% from last month</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Recent Alerts</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Real-time alerts will appear here once integrated.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;