import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, TextField, Button, Chip, CircularProgress } from '@mui/material';
import api from '../services/api';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const response = await api.get('/products');
    setProducts(response.data);
    setLoading(false);
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ p: 3 }}>
      <Container maxWidth="xl">
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>📦 Product Catalog</Typography>
        
        <TextField fullWidth placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.sku}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography color="textSecondary">SKU: {product.sku}</Typography>
                  <Typography variant="h5" sx={{ color: '#2563EB', mt: 1 }}>${product.price}</Typography>
                  <Chip label={product.category} size="small" sx={{ mt: 1 }} />
                  <Chip label={`Stock: ${product.stock_level}`} size="small" sx={{ mt: 1, ml: 1, bgcolor: product.stock_level > 10 ? '#10B981' : '#F59E0B', color: 'white' }} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default ProductsPage;