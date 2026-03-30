import React from 'react';
import { Card, CardContent, Typography, Chip, Box, IconButton } from '@mui/material';
import { CheckCircle as CheckCircleIcon, Warning as WarningIcon, Error as ErrorIcon, Info as InfoIcon } from '@mui/icons-material';

const getPriorityConfig = (priority) => {
  switch(priority) {
    case 'critical': return { color: '#EF4444', icon: <ErrorIcon />, label: 'CRITICAL' };
    case 'high': return { color: '#F97316', icon: <WarningIcon />, label: 'HIGH' };
    case 'medium': return { color: '#F59E0B', icon: <InfoIcon />, label: 'MEDIUM' };
    default: return { color: '#10B981', icon: <InfoIcon />, label: 'LOW' };
  }
};

const AlertCard = ({ alert, onResolve }) => {
  const config = getPriorityConfig(alert.priority);

  return (
    <Card sx={{ mb: 2, borderLeft: `4px solid ${config.color}` }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
            {config.icon}
            <Chip label={config.label} size="small" sx={{ bgcolor: config.color, color: 'white' }} />
          </Box>
          {onResolve && (
            <IconButton onClick={() => onResolve(alert.id)} size="small">
              <CheckCircleIcon sx={{ color: '#10B981' }} />
            </IconButton>
          )}
        </Box>
        <Typography variant="h6">{alert.title}</Typography>
        <Typography variant="body2" color="textSecondary">{alert.description}</Typography>
        <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
          📍 {alert.location} | 🕐 {new Date(alert.created_at).toLocaleString()}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default AlertCard;