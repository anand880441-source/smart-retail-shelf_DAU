import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Container, Typography } from '@mui/material';

const NotFound = () => {
  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        bgcolor: '#0B0F1A',
        background: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.06) 0%, transparent 60%)',
      }}
    >
      <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
        <Typography 
          variant="h1" 
          sx={{ 
            fontSize: { xs: 100, md: 160 }, 
            fontWeight: 900, 
            letterSpacing: '-0.05em',
            background: 'linear-gradient(135deg, #6366F1 0%, #A855F7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1
          }}
        >
          404
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, color: 'text.primary' }}>
          Page Not Found
        </Typography>
        <Typography sx={{ color: 'text.secondary', mb: 5, fontSize: '1.1rem' }}>
          The page you are looking for doesn't exist or has been moved.
        </Typography>
        <Button 
          component={Link} 
          to="/dashboard" 
          variant="contained" 
          size="large"
          sx={{ 
            borderRadius: '14px', 
            px: 5, 
            py: 1.5,
            fontWeight: 700,
            background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
            boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.39)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px rgba(99, 102, 241, 0.5)',
            }
          }}
        >
          Go to Dashboard
        </Button>
      </Container>
    </Box>
  );
};

export default NotFound;