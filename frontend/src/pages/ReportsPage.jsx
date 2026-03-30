import React, { useState } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Button, Select, MenuItem, FormControl, InputLabel, CircularProgress } from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';
import api from '../services/api';

const ReportsPage = () => {
  const [reportType, setReportType] = useState('stockout');
  const [loading, setLoading] = useState(false);

  const generateReport = async () => {
    setLoading(true);
    window.open(`${process.env.REACT_APP_API_URL}/reports/export/pdf?report_type=${reportType}`, '_blank');
    setLoading(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Container maxWidth="md">
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>📄 Reports</Typography>
        
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Generate Report</Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Report Type</InputLabel>
              <Select value={reportType} onChange={(e) => setReportType(e.target.value)} label="Report Type">
                <MenuItem value="stockout">Stockout Report</MenuItem>
                <MenuItem value="compliance">Compliance Report</MenuItem>
                <MenuItem value="inventory">Inventory Report</MenuItem>
              </Select>
            </FormControl>
            <Button fullWidth variant="contained" startIcon={<DownloadIcon />} onClick={generateReport} disabled={loading} sx={{ bgcolor: '#2563EB' }}>
              {loading ? <CircularProgress size={24} /> : 'Download PDF'}
            </Button>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default ReportsPage;