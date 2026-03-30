import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Chip,
  LinearProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  Upload as UploadIcon,
  Compare as CompareIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Close as CloseIcon,
  Add as AddIcon
} from '@mui/icons-material';
import api from '../services/api';

const PlanogramPage = () => {
  const [planograms, setPlanograms] = useState([]);
  const [selectedPlanogram, setSelectedPlanogram] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [complianceResult, setComplianceResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [newPlanogram, setNewPlanogram] = useState({
    name: '',
    store_id: 'store_001',
    aisle: '',
    products: []
  });

  useEffect(() => {
    fetchPlanograms();
  }, []);

  const fetchPlanograms = async () => {
    try {
      const response = await api.get('/planogram');
      setPlanograms(response.data);
    } catch (error) {
      console.error('Failed to fetch planograms:', error);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/planogram/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploadedImage({
        file: URL.createObjectURL(file),
        detections: response.data.detected_products
      });
      
      if (selectedPlanogram) {
        const compareResponse = await api.post(`/planogram/${selectedPlanogram}/compare`, response.data.detected_products);
        setComplianceResult(compareResponse.data);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompare = async () => {
    if (!selectedPlanogram || !uploadedImage) return;
    
    setLoading(true);
    try {
      const response = await api.post(`/planogram/${selectedPlanogram}/compare`, uploadedImage.detections);
      setComplianceResult(response.data);
    } catch (error) {
      console.error('Comparison failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Container maxWidth="xl">
        <Typography variant="h4" fontWeight="bold" sx={{ color: '#1F2937', mb: 3 }}>
          📐 Planogram Compliance
        </Typography>

        <Grid container spacing={3}>
          {/* Left Column - Controls */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Select Planogram</Typography>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Planogram</InputLabel>
                  <Select
                    value={selectedPlanogram}
                    onChange={(e) => setSelectedPlanogram(e.target.value)}
                    label="Planogram"
                  >
                    {planograms.map((p) => (
                      <MenuItem key={p._id} value={p._id}>{p.name} - {p.aisle}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenDialog(true)}
                  sx={{ mb: 2 }}
                >
                  Create New Planogram
                </Button>

                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Upload Shelf Image</Typography>
                <Button
                  fullWidth
                  variant="contained"
                  component="label"
                  startIcon={<UploadIcon />}
                  sx={{ mb: 2, bgcolor: '#2563EB' }}
                >
                  Upload Image
                  <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                </Button>

                {uploadedImage && (
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<CompareIcon />}
                    onClick={handleCompare}
                    disabled={!selectedPlanogram}
                    sx={{ bgcolor: '#10B981' }}
                  >
                    Compare with Planogram
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column - Results */}
          <Grid item xs={12} md={8}>
            {complianceResult && (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Compliance Results</Typography>
                  
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Typography variant="h2" sx={{ color: getScoreColor(complianceResult.compliance_score) }}>
                      {complianceResult.compliance_score}%
                    </Typography>
                    <Typography color="textSecondary">Compliance Score</Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={complianceResult.compliance_score} 
                      sx={{ mt: 1, height: 10, borderRadius: 5 }}
                    />
                  </Box>

                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={6}>
                      <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#F3F4F6' }}>
                        <Typography variant="h4">{complianceResult.correct_placements}</Typography>
                        <Typography>Correct Placements</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6}>
                      <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#FEE2E2' }}>
                        <Typography variant="h4">{complianceResult.violations?.length || 0}</Typography>
                        <Typography>Violations</Typography>
                      </Paper>
                    </Grid>
                  </Grid>

                  {complianceResult.violations?.length > 0 && (
                    <>
                      <Typography variant="h6" gutterBottom>Violations Detected</Typography>
                      <TableContainer component={Paper}>
                        <Table>
                          <TableHead>
                            <TableRow sx={{ bgcolor: '#FEE2E2' }}>
                              <TableCell>Product</TableCell>
                              <TableCell>Issue</TableCell>
                              <TableCell>Severity</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {complianceResult.violations.map((v, idx) => (
                              <TableRow key={idx}>
                                <TableCell>{v.product_name}</TableCell>
                                <TableCell>{v.issue}</TableCell>
                                <TableCell>
                                  <Chip 
                                    label={v.severity.toUpperCase()} 
                                    size="small"
                                    sx={{ 
                                      bgcolor: v.severity === 'high' ? '#EF4444' : '#F59E0B',
                                      color: 'white'
                                    }}
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {uploadedImage && !complianceResult && (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Uploaded Image</Typography>
                  <img src={uploadedImage.file} alt="Shelf" style={{ width: '100%', borderRadius: 8 }} />
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    Detected {uploadedImage.detections?.length || 0} products
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>

        {/* Create Planogram Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>Create New Planogram</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Planogram Name"
              margin="normal"
              value={newPlanogram.name}
              onChange={(e) => setNewPlanogram({ ...newPlanogram, name: e.target.value })}
            />
            <TextField
              fullWidth
              label="Aisle"
              margin="normal"
              value={newPlanogram.aisle}
              onChange={(e) => setNewPlanogram({ ...newPlanogram, aisle: e.target.value })}
            />
            <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
              Note: Product placements will be configured in the next version
            </Typography>
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  );
};

export default PlanogramPage;