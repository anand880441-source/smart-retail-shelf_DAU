import React from 'react';
import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const MetricCard = ({ title, value, icon, color, subtitle, trend }) => {
  const theme = useTheme();

  return (
    <Card 
      sx={{ 
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        background: 'rgba(17, 24, 39, 0.7)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 4, // 16px
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 12px 24px -10px ${color}40`,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          width: '100px',
          height: '100px',
          background: `radial-gradient(circle at 100% 0%, ${color}20 0%, transparent 70%)`,
          zIndex: 0
        }
      }}
    >
      <CardContent sx={{ position: 'relative', zIndex: 1, p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: 44,
              height: 44,
              borderRadius: '12px',
              bgcolor: `${color}15`,
              color: color,
              boxShadow: `0 4px 12px ${color}20`
            }}
          >
            {icon || <TrendingUpIcon />}
          </Box>
          {trend && (
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 0.5,
                bgcolor: 'success.main',
                color: 'white',
                px: 1,
                py: 0.2,
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 700
              }}
            >
              {trend}
            </Box>
          )}
        </Box>
        
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem' }}>
          {title}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <Typography variant="h3" sx={{ fontWeight: 800, color: 'text.primary', fontSize: '1.75rem' }}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default MetricCard;