import React, { useState } from 'react';
import {
  Box,
  Container,
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
  Paper
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
  BakeryDining as BreadIcon
} from '@mui/icons-material';

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
    setZoom(Math.min(zoom + 0.1, 1.5));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 0.1, 0.7));
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

  return (
    <Box sx={{ p: 3 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight="bold" sx={{ color: '#1F2937' }}>
            🗺️ Interactive Shelf Map
          </Typography>
          <Box>
            <Tooltip title="Zoom In">
              <IconButton onClick={handleZoomIn} sx={{ bgcolor: '#2563EB', color: 'white', mr: 1 }}>
                <ZoomInIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Zoom Out">
              <IconButton onClick={handleZoomOut} sx={{ bgcolor: '#2563EB', color: 'white', mr: 1 }}>
                <ZoomOutIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Refresh">
              <IconButton sx={{ bgcolor: '#6B7280', color: 'white' }}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ bgcolor: '#2563EB', color: 'white' }}>
              <CardContent>
                <Typography variant="h3">{storeHealth}%</Typography>
                <Typography variant="body2">Store Health</Typography>
                <LinearProgress variant="determinate" value={storeHealth} sx={{ bgcolor: 'rgba(255,255,255,0.3)', '& .MuiLinearProgress-bar': { bgcolor: 'white' }, mt: 1 }} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ bgcolor: '#10B981', color: 'white' }}>
              <CardContent>
                <Typography variant="h3">{healthyProducts}</Typography>
                <Typography variant="body2">In Stock SKUs</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ bgcolor: '#F59E0B', color: 'white' }}>
              <CardContent>
                <Typography variant="h3">{lowProducts}</Typography>
                <Typography variant="body2">Low Stock</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ bgcolor: '#F97316', color: 'white' }}>
              <CardContent>
                <Typography variant="h3">{criticalProducts}</Typography>
                <Typography variant="body2">Critical</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ bgcolor: '#EF4444', color: 'white' }}>
              <CardContent>
                <Typography variant="h3">{emptyProducts}</Typography>
                <Typography variant="body2">Out of Stock</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Store Layout - Aisle Grid */}
        <Box
          sx={{
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
            transition: 'transform 0.3s ease'
          }}
        >
          <Grid container spacing={2}>
            {aisles.map((aisle) => (
              <Grid item xs={12} key={aisle.id}>
                <Paper
                  elevation={hoveredAisle === aisle.id ? 6 : 2}
                  onMouseEnter={() => setHoveredAisle(aisle.id)}
                  onMouseLeave={() => setHoveredAisle(null)}
                  sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    border: hoveredAisle === aisle.id ? '2px solid #2563EB' : '1px solid #E5E7EB'
                  }}
                >
                  {/* Aisle Header */}
                  <Box
                    sx={{
                      bgcolor: '#F3F4F6',
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      borderBottom: '2px solid #E5E7EB'
                    }}
                  >
                    <Avatar sx={{ bgcolor: '#2563EB', mr: 2 }}>
                      {aisle.icon}
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold">
                      Aisle {aisle.id}: {aisle.name}
                    </Typography>
                  </Box>

                  {/* Shelves Grid */}
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    {aisle.shelves.map((shelf) => (
                      <Grid item xs={12} sm={6} md={4} key={shelf.id}>
                        <Card
                          onClick={() => handleShelfClick(shelf)}
                          sx={{
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: 6
                            },
                            borderLeft: `4px solid ${getStatusColor(shelf.status)}`
                          }}
                        >
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <Box>
                                <Typography variant="subtitle1" fontWeight="bold">
                                  {shelf.product}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                  SKU: {shelf.sku}
                                </Typography>
                                <Box sx={{ mt: 1 }}>
                                  <Chip
                                    size="small"
                                    label={shelf.position}
                                    sx={{ mr: 1, bgcolor: '#E5E7EB' }}
                                  />
                                  <Chip
                                    size="small"
                                    label={getStatusText(shelf.status)}
                                    sx={{ bgcolor: getStatusColor(shelf.status), color: 'white' }}
                                  />
                                </Box>
                              </Box>
                              <ShelfIcon sx={{ color: getStatusColor(shelf.status) }} />
                            </Box>
                            <Box sx={{ mt: 2 }}>
                              <Typography variant="body2" color="textSecondary">
                                Stock Level: {shelf.stock} units
                              </Typography>
                              <LinearProgress
                                variant="determinate"
                                value={shelf.stock}
                                sx={{
                                  mt: 1,
                                  height: 8,
                                  borderRadius: 4,
                                  bgcolor: '#E5E7EB',
                                  '& .MuiLinearProgress-bar': {
                                    bgcolor: getStatusColor(shelf.status),
                                    borderRadius: 4
                                  }
                                }}
                              />
                              <Typography variant="h6" sx={{ mt: 1, color: '#2563EB' }}>
                                ${shelf.price}
                              </Typography>
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

        {/* Product Detail Dialog */}
        <Dialog open={!!selectedShelf} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          {selectedShelf && (
            <>
              <DialogTitle sx={{ bgcolor: getStatusColor(selectedShelf.status), color: 'white' }}>
                Product Details
              </DialogTitle>
              <DialogContent sx={{ p: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h5" fontWeight="bold">{selectedShelf.product}</Typography>
                    <Typography variant="body2" color="textSecondary">SKU: {selectedShelf.sku}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">Status</Typography>
                    <Typography variant="h6" sx={{ color: getStatusColor(selectedShelf.status) }}>
                      {getStatusText(selectedShelf.status)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">Current Stock</Typography>
                    <Typography variant="h6">{selectedShelf.stock} units</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">Price</Typography>
                    <Typography variant="h6" sx={{ color: '#2563EB' }}>${selectedShelf.price}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">Location</Typography>
                    <Typography variant="h6">Aisle {selectedShelf.id}, {selectedShelf.position}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                      <Chip 
                        icon={<WarningIcon />} 
                        label={selectedShelf.status === 'empty' ? 'Immediate Replenishment Required' : 'Schedule Replenishment'} 
                        sx={{ bgcolor: getStatusColor(selectedShelf.status), color: 'white' }}
                      />
                      <Chip 
                        icon={<CheckCircleIcon />} 
                        label="Add to Restock List" 
                        sx={{ bgcolor: '#2563EB', color: 'white' }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </DialogContent>
            </>
          )}
        </Dialog>
      </Container>
    </Box>
  );
};

export default ShelfMapPage;