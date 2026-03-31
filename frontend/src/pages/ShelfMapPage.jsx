import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  LinearProgress,
  Avatar,
  Paper,
  useTheme,
  Button
} from '@mui/material';
import {
  Store as StoreIcon,
  ShoppingCart as CartIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  LocalGroceryStore as ShelfIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Refresh as RefreshIcon,
  Egg as EggIcon,
  LocalDrink as DrinkIcon,
  Fastfood as FastfoodIcon,
  Apple as AppleIcon,
  BakeryDining as BreadIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import MetricCard from '../components/common/Cards/MetricCard';

// Mock product data
const aisles = [
  {
    id: 1,
    name: 'Dairy',
    icon: <DrinkIcon />,
    shelves: [
      { id: 1, position: 'Top', product: 'Milk 1L', stock: 85, sku: 'MILK001', status: 'good', price: 3.99 },
      { id: 2, position: 'Middle', product: 'Cheese', stock: 45, sku: 'CHS002', status: 'good', price: 5.49 },
      { id: 3, position: 'Bottom', product: 'Yogurt', stock: 12, sku: 'YGT003', status: 'low', price: 2.99 }
    ]
  },
  {
    id: 2,
    name: 'Bakery',
    icon: <BreadIcon />,
    shelves: [
      { id: 4, position: 'Top', product: 'White Bread', stock: 8, sku: 'BRD004', status: 'low', price: 2.49 },
      { id: 5, position: 'Middle', product: 'Croissant', stock: 0, sku: 'CRO005', status: 'empty', price: 1.99 },
      { id: 6, position: 'Bottom', product: 'Bagels', stock: 24, sku: 'BGL006', status: 'good', price: 3.49 }
    ]
  },
  {
    id: 3,
    name: 'Produce',
    icon: <AppleIcon />,
    shelves: [
      { id: 7, position: 'Top', product: 'Apples', stock: 56, sku: 'APL007', status: 'good', price: 0.99 },
      { id: 8, position: 'Middle', product: 'Bananas', stock: 23, sku: 'BAN008', status: 'good', price: 0.69 },
      { id: 9, position: 'Bottom', product: 'Oranges', stock: 3, sku: 'ORG009', status: 'critical', price: 1.29 }
    ]
  },
  {
    id: 4,
    name: 'Snacks',
    icon: <FastfoodIcon />,
    shelves: [
      { id: 10, position: 'Top', product: 'Potato Chips', stock: 34, sku: 'CHP010', status: 'good', price: 4.99 },
      { id: 11, position: 'Middle', product: 'Cookies', stock: 0, sku: 'COK011', status: 'empty', price: 3.49 },
      { id: 12, position: 'Bottom', product: 'Popcorn', stock: 18, sku: 'POP012', status: 'good', price: 2.99 }
    ]
  },
  {
    id: 5,
    name: 'Eggs & Dairy',
    icon: <EggIcon />,
    shelves: [
      { id: 13, position: 'Top', product: 'Eggs Dozen', stock: 42, sku: 'EGG013', status: 'good', price: 4.99 },
      { id: 14, position: 'Middle', product: 'Butter', stock: 7, sku: 'BTR014', status: 'low', price: 5.49 },
      { id: 15, position: 'Bottom', product: 'Cream Cheese', stock: 0, sku: 'CRM015', status: 'empty', price: 3.99 }
    ]
  }
];

const getStatusColor = (status) => {
  switch(status) {
    case 'good': return '#10B981';
    case 'low': return '#F59E0B';
    case 'critical': return '#F97316';
    case 'empty': return '#EF4444';
    default: return '#6B7280';
  }
};

const getStatusText = (status) => {
  switch(status) {
    case 'good': return 'In Stock';
    case 'low': return 'Low Stock';
    case 'critical': return 'Critical';
    case 'empty': return 'Out of Stock';
    default: return 'Unknown';
  }
};

const ShelfMapPage = () => {
  const theme = useTheme();
  const [selectedShelf, setSelectedShelf] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [hoveredAisle, setHoveredAisle] = useState(null);

  const handleShelfClick = (shelf) => {
    setSelectedShelf(shelf);
  };

  const handleCloseDialog = () => {
    setSelectedShelf(null);
  };

  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 0.1, 1.3));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 0.1, 0.8));
  };

  // Calculate store health metrics
  const totalProducts = aisles.reduce((acc, aisle) => acc + aisle.shelves.length, 0);
  const emptyProducts = aisles.reduce((acc, aisle) => 
    acc + aisle.shelves.filter(s => s.status === 'empty').length, 0);
  const lowProducts = aisles.reduce((acc, aisle) => 
    acc + aisle.shelves.filter(s => s.status === 'low').length, 0);
  const criticalProducts = aisles.reduce((acc, aisle) => 
    acc + aisle.shelves.filter(s => s.status === 'critical').length, 0);
  const healthyProducts = totalProducts - emptyProducts - lowProducts - criticalProducts;

  const storeHealth = Math.round((healthyProducts / totalProducts) * 100);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const aisleVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <Box component={motion.div} variants={containerVariants} initial="hidden" animate="visible" sx={{ pb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 6 }}>
        <Box>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 800, 
              mb: 1, 
              letterSpacing: '-0.03em',
              background: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' }
            }}
          >
            Interactive Shelf Map
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem' }}>
            Real-time visual inventory of your store floorspace.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, p: 1, borderRadius: '16px', bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <Tooltip title="Zoom In">
            <IconButton onClick={handleZoomIn} sx={{ color: 'primary.main', bgcolor: 'rgba(99, 102, 241, 0.1)', '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.2)' } }}>
              <ZoomInIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Zoom Out">
            <IconButton onClick={handleZoomOut} sx={{ color: 'primary.main', bgcolor: 'rgba(99, 102, 241, 0.1)', '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.2)' } }}>
              <ZoomOutIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Refresh">
            <IconButton sx={{ color: 'text.secondary', bgcolor: 'rgba(255,255,255,0.05)' }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Stats Cards Integration with MetricCard */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <MetricCard title="Health" value={`${storeHealth}%`} color="#6366F1" trend="Stable" />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <MetricCard title="In Stock" value={healthyProducts} color="#10B981" />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <MetricCard title="Low" value={lowProducts} color="#F59E0B" />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <MetricCard title="Critical" value={criticalProducts} color="#F97316" />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <MetricCard title="OOS" value={emptyProducts} color="#EF4444" />
        </Grid>
      </Grid>

      {/* Store Layout - Aisle Grid */}
      <Box
        sx={{
          transform: `scale(${zoom})`,
          transformOrigin: 'top center',
          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          perspective: '1000px'
        }}
      >
        <Grid container spacing={4}>
          {aisles.map((aisle) => (
            <Grid item xs={12} key={aisle.id} component={motion.div} variants={aisleVariants}>
              <Paper
                elevation={hoveredAisle === aisle.id ? 8 : 2}
                onMouseEnter={() => setHoveredAisle(aisle.id)}
                onMouseLeave={() => setHoveredAisle(null)}
                sx={{
                  borderRadius: 6,
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  background: 'rgba(30, 41, 59, 0.2)',
                  backdropFilter: 'blur(10px)',
                  border: hoveredAisle === aisle.id 
                    ? '1px solid rgba(99, 102, 241, 0.4)' 
                    : '1px solid rgba(255, 255, 255, 0.05)',
                  boxShadow: hoveredAisle === aisle.id 
                    ? '0 20px 40px -10px rgba(0,0,0,0.5)' 
                    : 'none'
                }}
              >
                {/* Aisle Header */}
                <Box
                  sx={{
                    p: 3,
                    display: 'flex',
                    alignItems: 'center',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    bgcolor: 'rgba(255, 255, 255, 0.02)'
                  }}
                >
                  <Avatar 
                    sx={{ 
                      bgcolor: 'rgba(99, 102, 241, 0.1)', 
                      color: 'primary.main',
                      mr: 2,
                      width: 48,
                      height: 48,
                      border: '1px solid rgba(99, 102, 241, 0.2)'
                    }}
                  >
                    {aisle.icon}
                  </Avatar>
                  <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
                    Aisle {aisle.id}: {aisle.name}
                  </Typography>
                </Box>

                {/* Shelves Grid */}
                <Grid container spacing={3} sx={{ p: 3 }}>
                  {aisle.shelves.map((shelf) => (
                    <Grid item xs={12} sm={6} md={4} key={shelf.id}>
                      <Card
                        onClick={() => handleShelfClick(shelf)}
                        sx={{
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          height: '100%',
                          background: 'rgba(17, 24, 39, 0.4)',
                          border: '1px solid rgba(255, 255, 255, 0.04)',
                          borderRadius: 4,
                          '&:hover': {
                            transform: 'translateY(-6px)',
                            background: 'rgba(17, 24, 39, 0.6)',
                            borderColor: 'rgba(255, 255, 255, 0.1)',
                            boxShadow: `0 12px 20px -10px ${getStatusColor(shelf.status)}40`
                          },
                          borderLeft: `6px solid ${getStatusColor(shelf.status)}`
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Box>
                              <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, lineHeight: 1.2 }}>
                                {shelf.product}
                              </Typography>
                              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                                SKU: {shelf.sku}
                              </Typography>
                            </Box>
                            <ShelfIcon sx={{ color: getStatusColor(shelf.status), fontSize: 28 }} />
                          </Box>

                          <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                            <Chip
                              size="small"
                              label={shelf.position}
                              sx={{ fontWeight: 700, fontSize: '0.65rem', borderRadius: '6px', bgcolor: 'rgba(255,255,255,0.05)' }}
                            />
                            <Chip
                              size="small"
                              label={getStatusText(shelf.status)}
                              sx={{ 
                                fontWeight: 800, 
                                fontSize: '0.65rem', 
                                borderRadius: '6px', 
                                bgcolor: `${getStatusColor(shelf.status)}20`, 
                                color: getStatusColor(shelf.status),
                                border: `1px solid ${getStatusColor(shelf.status)}40`
                              }}
                            />
                          </Box>

                          <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                                Stock: {shelf.stock} units
                              </Typography>
                              <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 800 }}>
                                ${shelf.price}
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={shelf.stock}
                              sx={{
                                height: 8,
                                borderRadius: 4,
                                bgcolor: 'rgba(255, 255, 255, 0.03)',
                                '& .MuiLinearProgress-bar': {
                                  bgcolor: getStatusColor(shelf.status),
                                  borderRadius: 4
                                }
                              }}
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Product Detail Dialog Refinement */}
      <Dialog 
        open={!!selectedShelf} 
        onClose={handleCloseDialog} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '24px',
            background: '#111827',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }
        }}
      >
        {selectedShelf && (
          <>
            <DialogTitle sx={{ 
              p: 3, 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              background: `linear-gradient(135deg, ${getStatusColor(selectedShelf.status)}20 0%, transparent 100%)`,
              borderBottom: '1px solid rgba(255,255,255,0.05)'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ p: 1, borderRadius: '10px', bgcolor: `${getStatusColor(selectedShelf.status)}20`, color: getStatusColor(selectedShelf.status) }}>
                  <ShelfIcon fontSize="small" />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>Shelf Inventory Details</Typography>
              </Box>
              <IconButton onClick={handleCloseDialog} sx={{ color: 'text.secondary' }}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 4 }}>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>{selectedShelf.product}</Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 600 }}>SKU Trace: {selectedShelf.sku}</Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Status</Typography>
                  <Typography variant="h5" sx={{ color: getStatusColor(selectedShelf.status), fontWeight: 800 }}>
                    {getStatusText(selectedShelf.status)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Stock Percentage</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800 }}>{selectedShelf.stock}%</Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Unit Price</Typography>
                  <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 800 }}>${selectedShelf.price}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Physical Path</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Aisle {selectedShelf.id}, {selectedShelf.position}</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <Button 
                      variant="contained" 
                      fullWidth
                      sx={{ 
                        borderRadius: '12px', 
                        py: 1.5, 
                        fontWeight: 700,
                        bgcolor: getStatusColor(selectedShelf.status),
                        '&:hover': { bgcolor: getStatusColor(selectedShelf.status), opacity: 0.9 }
                      }}
                    >
                      {selectedShelf.status === 'empty' ? 'Urgent Restock' : 'Order Stock'}
                    </Button>
                    <Button 
                      variant="outlined" 
                      fullWidth
                      sx={{ borderRadius: '12px', py: 1.5, fontWeight: 700, borderColor: 'rgba(255,255,255,0.1)', color: 'text.primary' }}
                    >
                      Move Location
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default ShelfMapPage;