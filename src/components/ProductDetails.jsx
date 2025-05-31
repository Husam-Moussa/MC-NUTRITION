import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

// Animated Rating Stars Component
const RatingStars = ({ rating, reviews }) => (
  <motion.div 
    className="flex items-center gap-2"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 }}
  >
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <motion.span
          key={i}
          className={i < Math.floor(rating) ? 'text-yellow-500' : 'text-gray-500'}
          initial={{ opacity: 0, rotate: -180 }}
          animate={{ 
            opacity: 1, 
            rotate: 0,
            scale: i < Math.floor(rating) ? [1, 1.2, 1] : 1
          }}
          transition={{ 
            delay: 0.5 + (i * 0.1),
            duration: 0.5,
            repeat: i < Math.floor(rating) ? Infinity : 0,
            repeatType: "reverse",
            repeatDelay: 2
          }}
        >
          ★
        </motion.span>
      ))}
    </div>
    <span className="text-gray-400">({reviews} reviews)</span>
  </motion.div>
);

// Animated Tab Content Component
const TabContent = ({ activeTab, product }) => (
  <AnimatePresence mode="wait">
    {activeTab === 'details' && (
      <motion.div
        key="details"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        <div className="grid grid-cols-2 gap-4">
          <motion.div 
            className="bg-black/50 p-4 rounded-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <h3 className="text-lime-500 font-semibold mb-2">Category</h3>
            <p className="text-white">{product.category}</p>
          </motion.div>
          <motion.div 
            className="bg-black/50 p-4 rounded-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <h3 className="text-lime-500 font-semibold mb-2">Stock</h3>
            <p className="text-white">{product.stock} units</p>
          </motion.div>
        </div>
        {product.certifications && (
          <motion.div 
            className="bg-black/50 p-4 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lime-500 font-semibold mb-2">Certifications</h3>
            <div className="flex flex-wrap gap-2">
              {product.certifications.map((cert, index) => (
                <motion.span
                  key={cert}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + (index * 0.1) }}
                  className="bg-lime-500/10 text-lime-500 px-2 py-1 rounded text-sm"
                >
                  {cert}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    )}

    {activeTab === 'nutrition' && (
      <motion.div
        key="nutrition"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-2 gap-4"
      >
        {Object.entries(product.nutrition).map(([key, value], index) => (
          <motion.div
            key={key}
            className="bg-black/50 p-4 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="text-lime-500 font-semibold mb-2">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </h3>
            <p className="text-white text-lg font-bold">{value}</p>
          </motion.div>
        ))}
      </motion.div>
    )}

    {activeTab === 'benefits' && (
      <motion.div
        key="benefits"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        {(product.benefits || [
          'Enhances Muscle Growth',
          'Improves Recovery Time',
          'Increases Strength',
          'Supports Lean Mass'
        ]).map((benefit, index) => (
          <motion.div
            key={benefit}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, x: 10 }}
            className="flex items-center gap-3 bg-black/50 p-4 rounded-lg group"
          >
            <motion.svg
              className="w-6 h-6 text-lime-500 flex-shrink-0"
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 360] }}
              transition={{ delay: index * 0.1 + 0.3 }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </motion.svg>
            <span className="text-white group-hover:text-lime-500 transition-colors">{benefit}</span>
          </motion.div>
        ))}
      </motion.div>
    )}
  </AnimatePresence>
);

const ProductDetails = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedFlavor, setSelectedFlavor] = useState(product?.flavors?.[0]);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0]);
  const [activeTab, setActiveTab] = useState('details');
  const [isImageHovered, setIsImageHovered] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-black/95 p-4 flex items-center justify-center">
        <p className="text-white">Product not found</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      ...product,
      flavor: selectedFlavor,
      size: selectedSize
    });
    // Show success message or toast
  };

  return (
    <div className="min-h-screen bg-black/95">
      {/* Back Button */}
      <motion.button
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 z-50 bg-black/50 backdrop-blur p-2 rounded-full"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </motion.button>

      {/* Product Image */}
      <motion.div 
        className="relative w-full aspect-square overflow-hidden"
        onHoverStart={() => setIsImageHovered(true)}
        onHoverEnd={() => setIsImageHovered(false)}
      >
        <motion.img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ 
            opacity: 1, 
            scale: isImageHovered ? 1.1 : 1,
            rotate: isImageHovered ? -1 : 0
          }}
          transition={{ duration: 0.4 }}
        />
        <motion.div
          className="absolute top-4 right-4 bg-black/70 backdrop-blur px-3 py-1 rounded-full"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.span 
            className="text-lime-500 font-bold"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, -5, 5, 0]
            }}
            transition={{ 
              duration: 0.5,
              repeat: Infinity,
              repeatDelay: 3
            }}
          >
            ${product.price}
          </motion.span>
        </motion.div>
      </motion.div>

      {/* Product Info */}
      <motion.div 
        className="p-4 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div>
          <motion.h1 
            className="text-2xl font-bold text-white mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {product.name}
          </motion.h1>
          <motion.p 
            className="text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {product.description}
          </motion.p>
        </div>

        {/* Rating and Stock */}
        <div className="flex justify-between items-center">
          <RatingStars rating={product.rating} reviews={product.reviews} />
          <motion.span 
            className={`font-medium ${
              product.stock < 10 ? 'text-red-500' :
              product.stock < 20 ? 'text-yellow-500' :
              'text-green-500'
            }`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            {product.stock} in stock
          </motion.span>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-800">
          <div className="flex gap-4">
            {['details', 'nutrition', 'benefits'].map((tab) => (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-semibold transition-colors relative ${
                  activeTab === tab
                    ? 'text-lime-500'
                    : 'text-gray-400'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-lime-500"
                    layoutId="activeTab"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[200px]">
          <TabContent activeTab={activeTab} product={product} />
        </div>

        {/* Product Options */}
        {product.flavors && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-white font-semibold mb-2">Flavor</h3>
            <div className="flex flex-wrap gap-2">
              {product.flavors.map((flavor, index) => (
                <motion.button
                  key={flavor}
                  onClick={() => setSelectedFlavor(flavor)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                    selectedFlavor === flavor
                      ? 'bg-lime-500 text-black'
                      : 'bg-black/50 text-gray-300 border border-lime-500/20'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + (index * 0.1) }}
                >
                  {flavor}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {product.sizes && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h3 className="text-white font-semibold mb-2">Size</h3>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size, index) => (
                <motion.button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                    selectedSize === size
                      ? 'bg-lime-500 text-black'
                      : 'bg-black/50 text-gray-300 border border-lime-500/20'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + (index * 0.1) }}
                >
                  {size}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Add to Cart Button */}
        <motion.button
          onClick={handleAddToCart}
          className="relative w-full bg-lime-500 text-black py-4 rounded-lg font-semibold text-lg mt-6 overflow-hidden"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <motion.div
            className="absolute inset-0 bg-lime-400"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.5 }}
          />
          <span className="relative z-10">
            Add to Cart - ${product.price}
            {selectedSize && <span className="text-sm ml-2">/ {selectedSize}</span>}
          </span>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default ProductDetails; 