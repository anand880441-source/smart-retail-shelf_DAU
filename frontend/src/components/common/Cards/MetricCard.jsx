import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const MetricCard = ({ title, value, icon, color, subtitle }) => {
  return (
    <Card sx={{ bgcolor: color, color: 'white' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2">{title}</Typography>
          {icon}
        </Box>
        <Typography variant="h3">{value}</Typography>
        {subtitle && <Typography variant="body2">{subtitle}</Typography>}
      </CardContent>
    </Card>
  );
};

export default MetricCard;