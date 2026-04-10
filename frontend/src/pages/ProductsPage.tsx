import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Grid, Card, CardContent, TextField, 
  Chip, CircularProgress, useTheme, useMediaQuery, 
  InputAdornment, Avatar, Divider
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Inventory as ProductIcon,
  Label as TagIcon,
  TrendingUp as TrendIcon,
  LocalOffer as PriceIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const ProductsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Fallback data for immediate UI visual
      try {
        const response = await api.get('/products');
        setProducts(response.data);
      } catch (e) {
        setProducts([
          { sku: 'DX-100', name: 'Premium Milk 1L', price: 4.50, category: 'Dairy', stock_level: 45 },
          { sku: 'BX-200', name: 'Fresh Croissants', price: 2.99, category: 'Bakery', stock_level: 8 },
          { sku: 'CX-300', name: 'Organic Apples (6pk)', price: 5.49, category: 'Produce', stock_level: 22 },
          { sku: 'SX-400', name: 'Sea Salt Crackers', price: 3.25, category: 'Snacks', stock_level: 0 },
          { sku: 'DX-101', name: 'Greek Yogurt 500g', price: 6.99, category: 'Dairy', stock_level: 15 },
        ]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.sku.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (loading && products.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress thickness={5} size={60} sx={{ color: 'primary.main' }} />
      </Box>
    );
  }

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
          Product Catalog
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: { xs: '0.9rem', sm: '1.1rem' } }}>
          Manage your complete inventory and stock information.
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <TextField 
          fullWidth 
          placeholder="Search items by name, SKU, or category..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'primary.main' }} />
              </InputAdornment>
            ),
            sx: { 
              borderRadius: '20px', 
              bgcolor: 'rgba(30, 41, 59, 0.4)', 
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              px: 1,
              '&:hover': {
                bgcolor: 'rgba(30, 41, 59, 0.6)',
                borderColor: 'rgba(99, 102, 241, 0.3)'
              }
            }
          }}
        />
      </Box>
      
      <Grid container spacing={3}>
        <AnimatePresence>
          {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={product.sku} component={motion.div} variants={itemVariants} layout transition={{ duration: 0.2 }}>
              <Card 
                sx={{ 
                  height: '100%',
                  borderRadius: 5,
                  background: 'rgba(17, 24, 39, 0.4)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    borderColor: 'rgba(99, 102, 241, 0.4)',
                    background: 'rgba(17, 24, 39, 0.6)',
                    boxShadow: '0 15px 35px -10px rgba(0,0,0,0.5)'
                  }
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar 
                      variant="rounded"
                      sx={{ 
                        width: 48, 
                        height: 48, 
                        borderRadius: '12px',
                        bgcolor: 'rgba(99, 102, 241, 0.1)', 
                        color: 'primary.main',
                        border: '1px solid rgba(99, 102, 241, 0.2)'
                      }}
                    >
                      <ProductIcon />
                    </Avatar>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="body1" noWrap sx={{ fontWeight: 800, color: 'text.primary', display: 'block' }}>
                        {product.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                        {product.sku}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.03)' }} />

                  <Box sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <PriceIcon sx={{ fontSize: '0.9rem', color: 'text.secondary' }} />
                        <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main' }}>
                          ${product.price?.toFixed(2)}
                        </Typography>
                      </Box>
                      <Chip 
                        label={product.category} 
                        size="small" 
                        sx={{ 
                          fontWeight: 700, 
                          fontSize: '0.65rem', 
                          borderRadius: '8px',
                          bgcolor: 'rgba(255,255,255,0.05)',
                          color: 'text.secondary'
                        }} 
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: product.stock_level > 10 ? '#10B981' : product.stock_level > 0 ? '#F59E0B' : '#EF4444' }}>
                        <TrendIcon sx={{ fontSize: '1rem' }} />
                        <Typography variant="caption" sx={{ fontWeight: 800 }}>
                          {product.stock_level > 0 ? `${product.stock_level} IN STOCK` : 'OUT OF STOCK'}
                        </Typography>
                      </Box>
                    </Box>
                    
                    {/* Visual stock bar */}
                    <Box 
                      sx={{ 
                        mt: 1.5, 
                        height: 4, 
                        width: '100%', 
                        bgcolor: 'rgba(255,255,254,0.03)', 
                        borderRadius: 2,
                        overflow: 'hidden'
                      }}
                    >
                      <Box 
                        sx={{ 
                          height: '100%', 
                          width: `${Math.min(product.stock_level * 2, 100)}%`, 
                          bgcolor: product.stock_level > 10 ? '#10B981' : product.stock_level > 0 ? '#F59E0B' : '#EF4444',
                        }} 
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </AnimatePresence>
      </Grid>
      
      {filteredProducts.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <Typography variant="h6" sx={{ color: 'text.secondary', opacity: 0.6 }}>
            No products match your search query.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ProductsPage;