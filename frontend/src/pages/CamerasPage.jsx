import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Grid, Card, CardContent, Button,
  Dialog, DialogTitle, DialogContent, TextField, IconButton,
  Chip, CircularProgress, Alert
} from '@mui/material';
import { Add as AddIcon, Videocam as CameraIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import api from '../services/api';

const CamerasPage = () => {
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
      const response = await api.get('/cameras');
      setCameras(response.data);
    } catch (error) {
      console.error('Failed to fetch cameras:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      await api.post('/cameras', formData);
      setOpenDialog(false);
      fetchCameras();
      setFormData({ name: '', location: '', stream_url: '', is_active: true });
    } catch (error) {
      setError('Failed to add camera');
    }
  };

  const handleDelete = async (cameraId) => {
    if (window.confirm('Delete this camera?')) {
      await api.delete(`/cameras/${cameraId}`);
      fetchCameras();
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ p: 3 }}>
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4" fontWeight="bold">📷 Camera Management</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenDialog(true)} sx={{ bgcolor: '#2563EB' }}>
            Add Camera
          </Button>
        </Box>

        <Grid container spacing={3}>
          {cameras.map((camera) => (
            <Grid item xs={12} md={6} lg={4} key={camera.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <CameraIcon sx={{ fontSize: 40, color: camera.status === 'online' ? '#10B981' : '#EF4444' }} />
                    <Box>
                      <IconButton onClick={() => handleDelete(camera.id)}><DeleteIcon sx={{ color: '#EF4444' }} /></IconButton>
                    </Box>
                  </Box>
                  <Typography variant="h6">{camera.name}</Typography>
                  <Typography color="textSecondary">{camera.location}</Typography>
                  <Chip label={camera.status} size="small" sx={{ mt: 1, bgcolor: camera.status === 'online' ? '#10B981' : '#EF4444', color: 'white' }} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Add New Camera</DialogTitle>
          <DialogContent>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <TextField fullWidth label="Camera Name" margin="normal" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            <TextField fullWidth label="Location" margin="normal" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
            <TextField fullWidth label="Stream URL" margin="normal" value={formData.stream_url} onChange={(e) => setFormData({ ...formData, stream_url: e.target.value })} />
            <Button fullWidth variant="contained" onClick={handleSubmit} sx={{ mt: 2, bgcolor: '#2563EB' }}>Add Camera</Button>
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  );
};

export default CamerasPage;