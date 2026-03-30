import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Container, Typography, Paper } from '@mui/material';

const NotFound = () => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h1" sx={{ fontSize: 80, color: '#2563EB' }}>404</Typography>
          <Typography variant="h5" gutterBottom>Page Not Found</Typography>
          <Typography color="textSecondary" sx={{ mb: 3 }}>
            The page you are looking for doesn't exist or has been moved.
          </Typography>
          <Button component={Link} to="/dashboard" variant="contained" sx={{ bgcolor: '#2563EB' }}>
            Go to Dashboard
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default NotFound;