import React from 'react';
import { Card, CardContent, Typography, Chip, Box, IconButton, useTheme } from '@mui/material';
import { CheckCircle as CheckCircleIcon, Warning as WarningIcon, Error as ErrorIcon, Info as InfoIcon, LocationOn as LocationOnIcon, AccessTime as AccessTimeIcon } from '@mui/icons-material';

const getPriorityConfig = (priority) => {
  switch(priority) {
    case 'critical': return { color: '#EF4444', icon: <ErrorIcon fontSize="small" />, label: 'CRITICAL' };
    case 'high': return { color: '#F97316', icon: <WarningIcon fontSize="small" />, label: 'HIGH' };
    case 'medium': return { color: '#F59E0B', icon: <InfoIcon fontSize="small" />, label: 'MEDIUM' };
    default: return { color: '#10B981', icon: <InfoIcon fontSize="small" />, label: 'LOW' };
  }
};

const AlertCard = ({ alert, onResolve }) => {
  const config = getPriorityConfig(alert.priority);
  const theme = useTheme();

  return (
    <Card 
      sx={{ 
        mb: 2, 
        borderLeft: `4px solid ${config.color}`,
        background: 'rgba(17, 24, 39, 0.4)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: 3,
        transition: 'all 0.2s ease',
        '&:hover': {
          background: 'rgba(17, 24, 39, 0.6)',
          transform: 'translateX(4px)',
          borderColor: 'rgba(255, 255, 255, 0.1)'
        }
      }}
    >
      <CardContent sx={{ p: '16px !important' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Box 
              sx={{ 
                display: 'flex', 
                p: 0.5, 
                borderRadius: '8px', 
                bgcolor: `${config.color}20`, 
                color: config.color 
              }}
            >
              {config.icon}
            </Box>
            <Typography 
              variant="caption" 
              sx={{ 
                fontWeight: 800, 
                color: config.color,
                letterSpacing: '0.05em'
              }}
            >
              {config.label}
            </Typography>
          </Box>
          {onResolve && (
            <IconButton 
              onClick={() => onResolve(alert.id)} 
              size="small"
              sx={{ 
                bgcolor: 'rgba(16, 185, 129, 0.1)', 
                color: '#10B981',
                '&:hover': { bgcolor: 'rgba(16, 185, 129, 0.2)' }
              }}
            >
              <CheckCircleIcon fontSize="small" />
            </IconButton>
          )}
        </Box>

        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, fontSize: '1rem' }}>
          {alert.title}
        </Typography>
        
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, fontSize: '0.875rem' }}>
          {alert.description}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <LocationOnIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
              {alert.location}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <AccessTimeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
              {new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AlertCard;