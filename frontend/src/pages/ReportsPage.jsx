import React, { useState } from 'react';
import { 
  Box, Typography, Grid, Card, CardContent, Button, 
  Select, MenuItem, FormControl, InputLabel, 
  CircularProgress, useTheme, useMediaQuery, 
  Paper, Divider
} from '@mui/material';
import { 
  Download as DownloadIcon,
  Description as ReportIcon,
  PieChart as DataIcon,
  PictureAsPdf as PdfIcon,
  CheckCircle as SuccessIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const ReportsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [reportType, setReportType] = useState('stockout');
  const [loading, setLoading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const generateReport = async () => {
    setLoading(true);
    setDownloaded(false);
    
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    const reportUrl = `${apiUrl}/reports/export/pdf?report_type=${reportType}`;
    
    // Simulate a delay for premium feel
    setTimeout(() => {
      window.open(reportUrl, '_blank');
      setLoading(false);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 5000);
    }, 1500);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const reportOptions = [
    { value: 'stockout', label: 'Stockout Analysis', description: 'Detailed breakdown of missing SKUs and lost revenue projections.' },
    { value: 'compliance', label: 'Compliance Report', description: 'Overview of shelf layout accuracy against target planograms.' },
    { value: 'inventory', label: 'Inventory Audit', description: 'Full snapshot of current stock levels across all aisles.' },
  ];

  return (
    <Box component={motion.div} variants={containerVariants} initial="hidden" animate="visible" sx={{ pb: 4 }}>
      <Box sx={{ mb: { xs: 4, md: 6 } }}>
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
          Intelligence Reports
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: { xs: '0.9rem', sm: '1.1rem' } }}>
          Generate enterprise-grade PDF exports for offline review and audits.
        </Typography>
      </Box>

      <Grid container justifyContent="center">
        <Grid item xs={12} md={8} lg={6} component={motion.div} variants={itemVariants}>
          <Paper 
            sx={{ 
              p: { xs: 3, md: 5 },
              borderRadius: '28px',
              background: 'rgba(30, 41, 59, 0.3)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: 'rgba(99, 102, 241, 0.1)', color: 'primary.main' }}>
                <ReportIcon />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>Export Configuration</Typography>
            </Box>

            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, fontWeight: 600 }}>
              Select the data intelligence module you wish to export as a formatted PDF document.
            </Typography>

            <FormControl fullWidth sx={{ mb: 4 }}>
              <InputLabel sx={{ color: 'text.secondary' }}>Module Type</InputLabel>
              <Select 
                value={reportType} 
                onChange={(e) => setReportType(e.target.value)} 
                label="Module Type"
                sx={{ 
                  borderRadius: '16px',
                  bgcolor: 'rgba(255,255,255,0.03)',
                  fontWeight: 700,
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' }
                }}
              >
                {reportOptions.map(opt => (
                  <MenuItem key={opt.value} value={opt.value} sx={{ py: 2 }}>
                    <Box>
                      <Typography sx={{ fontWeight: 700 }}>{opt.label}</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>{opt.description}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Divider sx={{ mb: 4, borderColor: 'rgba(255,255,255,0.05)' }} />

            <Box sx={{ p: 3, borderRadius: '20px', bgcolor: 'rgba(255,255,255,0.02)', mb: 4, border: '1px solid rgba(255,255,255,0.03)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <PdfIcon sx={{ color: '#EF4444' }} />
                <Typography variant="body2" sx={{ fontWeight: 700 }}>High Resolution PDF Export</Typography>
              </Box>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Includes all charts, tables, and AI-generated summaries from your active session.
              </Typography>
            </Box>

            <Button 
              fullWidth 
              variant="contained" 
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : downloaded ? <SuccessIcon /> : <DownloadIcon />}
              onClick={generateReport} 
              disabled={loading}
              sx={{ 
                py: 2, 
                borderRadius: '16px', 
                fontWeight: 800,
                fontSize: '1rem',
                background: downloaded 
                  ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                  : 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                boxShadow: downloaded
                  ? '0 8px 20px -4px rgba(16, 185, 129, 0.4)'
                  : '0 8px 20px -4px rgba(99, 102, 241, 0.4)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                }
              }}
            >
              {loading ? 'Preparing Intelligence...' : downloaded ? 'Exported Successfully' : 'Download Executive Report'}
            </Button>
            
            {downloaded && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', marginTop: '16px' }}>
                <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 700 }}>
                  Your download has started in a new tab.
                </Typography>
              </motion.div>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReportsPage;