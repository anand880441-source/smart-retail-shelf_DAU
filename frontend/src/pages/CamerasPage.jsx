import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Button,
  Dialog, DialogTitle, DialogContent, TextField, IconButton,
  Chip, CircularProgress, Alert, useTheme, useMediaQuery,
  Avatar, Tooltip
} from '@mui/material';
import { 
  Add as AddIcon, 
  Videocam as CameraIcon, 
  Delete as DeleteIcon, 
  Edit as EditIcon,
  LocationOn as LocationIcon,
  Circle as CircleIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const CamerasPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({ name: '', location: '', stream_url: '', is_active: true });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCameras();
  }, []);

  const fetchCameras = async () => {
    try {
      setLoading(true);
      // Simulating data if API fails to show the UI
      try {
        const response = await api.get('/cameras');
        setCameras(response.data);
      } catch (e) {
        setCameras([
          { id: 1, name: 'Main Entrance 01', location: 'Zone A', status: 'online', stream_url: 'rtsp://...' },
          { id: 2, name: 'Aisle 4 - Dairy', location: 'Zone B', status: 'online', stream_url: 'rtsp://...' },
          { id: 3, name: 'Warehouse Dock', location: 'Zone D', status: 'offline', stream_url: 'rtsp://...' },
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch cameras:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.location) {
      setError('Please fill in all required fields');
      return;
    }
    try {
      await api.post('/cameras', formData);
      setOpenDialog(false);
      fetchCameras();
      setFormData({ name: '', location: '', stream_url: '', is_active: true });
      setError('');
    } catch (error) {
      setError('Failed to add camera');
    }
  };

  const handleDelete = async (cameraId) => {
    if (window.confirm('Are you sure you want to delete this camera?')) {
      try {
        await api.delete(`/cameras/${cameraId}`);
        fetchCameras();
      } catch (e) {
        console.error("Delete failed", e);
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (loading && cameras.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress thickness={5} size={60} sx={{ color: 'primary.main' }} />
      </Box>
    );
  }

  return (
    <Box component={motion.div} variants={containerVariants} initial="hidden" animate="visible" sx={{ pb: 4 }}>
      {/* Header section */}
      <Box sx={{ mb: { xs: 4, md: 6 }, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 3 }}>
        <Box>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 800, 
              mb: 1, 
              letterSpacing: '-0.03em',
              fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' },
              background: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Camera Network
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: { xs: '0.9rem', sm: '1.1rem' } }}>
            Manage and monitor your real-time computer vision hardware.
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => setOpenDialog(true)} 
          sx={{ 
            borderRadius: '14px', 
            px: 3, 
            py: 1.5, 
            fontWeight: 700,
            background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
            boxShadow: '0 8px 20px -6px rgba(99, 102, 241, 0.5)',
            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 12px 25px -8px rgba(99, 102, 241, 0.6)' }
          }}
        >
          Add Camera
        </Button>
      </Box>

      {/* Cameras Grid */}
      <Grid container spacing={3}>
        <AnimatePresence>
          {cameras.map((camera) => (
            <Grid item xs={12} sm={6} lg={4} xl={3} key={camera.id} component={motion.div} variants={itemVariants} layout>
              <Card 
                sx={{ 
                  height: '100%',
                  borderRadius: 6,
                  background: 'rgba(30, 41, 59, 0.3)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    borderColor: 'rgba(99, 102, 241, 0.3)',
                    boxShadow: '0 20px 40px -15px rgba(0,0,0,0.4)',
                    background: 'rgba(30, 41, 59, 0.5)',
                  }
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    <Avatar 
                      sx={{ 
                        width: 56, 
                        height: 56, 
                        borderRadius: '16px',
                        bgcolor: camera.status === 'online' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: camera.status === 'online' ? '#10B981' : '#EF4444',
                        border: `1px solid ${camera.status === 'online' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
                      }}
                    >
                      <CameraIcon />
                    </Avatar>
                    <Box>
                      <Tooltip title="Edit Camera">
                        <IconButton size="small" sx={{ color: 'text.secondary', mr: 1 }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Camera">
                        <IconButton size="small" onClick={() => handleDelete(camera.id)} sx={{ color: 'rgba(239, 68, 68, 0.6)', '&:hover': { color: '#EF4444' } }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.02em' }}>
                    {camera.name}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3, color: 'text.secondary' }}>
                    <LocationIcon sx={{ fontSize: '0.9rem' }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{camera.location}</Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Chip 
                      icon={<CircleIcon sx={{ fontSize: '0.6rem !important' }} />}
                      label={camera.status?.toUpperCase()} 
                      size="small" 
                      sx={{ 
                        fontWeight: 800, 
                        fontSize: '0.65rem',
                        bgcolor: camera.status === 'online' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: camera.status === 'online' ? '#10B981' : '#EF4444',
                        '& .MuiChip-icon': { color: 'inherit' }
                      }} 
                    />
                    <Button variant="text" size="small" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      View Stream
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </AnimatePresence>
      </Grid>

      {/* Add Camera Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '24px',
            background: '#111827',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }
        }}
      >
        <DialogTitle sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>Register New Camera</Typography>
          <IconButton onClick={() => setOpenDialog(false)} sx={{ color: 'text.secondary' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, pt: 0 }}>
          {error && <Alert severity="error" variant="outlined" sx={{ mb: 3, borderRadius: '12px' }}>{error}</Alert>}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label="Camera Identifier" 
                placeholder="e.g. Aisle 04 North"
                value={formData.name} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label="Zone / Location" 
                placeholder="e.g. Zone B"
                value={formData.location} 
                onChange={(e) => setFormData({ ...formData, location: e.target.value })} 
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label="Stream URI" 
                placeholder="rtsp://your-camera-stream"
                value={formData.stream_url} 
                onChange={(e) => setFormData({ ...formData, stream_url: e.target.value })} 
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button 
                fullWidth 
                variant="contained" 
                onClick={handleSubmit} 
                sx={{ 
                  mt: 2, 
                  py: 1.5, 
                  borderRadius: '12px', 
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                }}
              >
                Add Hardware
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default CamerasPage;