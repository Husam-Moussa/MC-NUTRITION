import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import ProductDetails from './ProductDetails';

const ProductDetailsRoute = () => {
  const location = useLocation();
  const product = location.state?.product;

  if (!product) {
    return <Navigate to="/shop" replace />;
  }

  return <ProductDetails product={product} />;
};

export default ProductDetailsRoute; 