import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import Loader from './Loader';
import Footer from './Footer';
import { staticProducts } from '../data/staticProducts';
import { useNavigate } from 'react-router-dom';

// Add new Particle component
const Particle = ({ delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, 1, 0],
        y: [0, -100],
        x: [0, Math.random() * 100 - 50]
      }}
      transition={{
        duration: 5,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="absolute w-2 h-2 bg-lime-500/20 rounded-full"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`
      }}
    />
  );
};

// Update the FloatingIcon component
const FloatingIcon = ({ children, delay }) => {
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: [-20, 20, -20] }}
      transition={{
        duration: 4,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="absolute"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`
      }}
    >
      {children}
    </motion.div>
  );
};

// Add new FilterButton component
const FilterButton = ({ isOpen, onClick }) => (
  <motion.button
    onClick={onClick}
    className="bg-black/50 backdrop-blur border border-lime-500/20 rounded-xl p-3 text-lime-500 hover:bg-lime-500/10"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <motion.div
      animate={{ rotate: isOpen ? 180 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    </motion.div>
  </motion.button>
);

// Update SearchBar component to restore previous design
const SearchBar = ({
  value,
  onChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  isFiltersOpen,
  onToggleFilters,
  products
}) => {
  // Get unique categories from products
  const categories = ['all', ...new Set(products.map(product => product.category))];

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative max-w-7xl mx-auto mb-12"
    >
      <div className="flex gap-4 items-start">
        {/* Search Input */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-black/50 backdrop-blur border border-lime-500/20 rounded-xl px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-lime-500 pr-12"
          />
          <motion.div 
            className="absolute right-4 top-1/2 -translate-y-1/2 text-lime-500"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 10, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </motion.div>
        </div>

        {/* Filter Toggle Button */}
        <FilterButton isOpen={isFiltersOpen} onClick={onToggleFilters} />
      </div>

      {/* Animated Filters Panel */}
      <AnimatePresence>
        {isFiltersOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 bg-black/50 backdrop-blur border border-lime-500/20 rounded-xl p-6 overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Categories */}
              <div>
                <h3 className="text-white font-semibold mb-4">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <motion.button
                      key={category}
                      onClick={() => onCategoryChange(category)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                        selectedCategory === category
                          ? 'bg-lime-500 text-black'
                          : 'bg-black/50 text-gray-300 hover:text-lime-500 border border-lime-500/20'
                      }`}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <h3 className="text-white font-semibold mb-4">Sort By</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'featured', label: 'Featured' },
                    { value: 'price-low', label: 'Price: Low to High' },
                    { value: 'price-high', label: 'Price: High to Low' },
                    { value: 'rating', label: 'Top Rated' }
                  ].map((option) => (
                    <motion.button
                      key={option.value}
                      onClick={() => onSortChange(option.value)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                        sortBy === option.value
                          ? 'bg-lime-500 text-black'
                          : 'bg-black/50 text-gray-300 hover:text-lime-500 border border-lime-500/20'
                      }`}
                    >
                      {option.label}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Add these new components after the existing imports
const StockIndicator = ({ stock }) => {
  const stockLevel = stock < 10 ? 'low' : stock < 20 ? 'medium' : 'high';
  const width = stock < 10 ? '30%' : stock < 20 ? '60%' : '90%';
  
  return (
    <motion.div className="relative h-1 bg-gray-200 rounded-full overflow-hidden">
      <motion.div
        className={`absolute h-full rounded-full ${
          stockLevel === 'low' ? 'bg-red-500' :
          stockLevel === 'medium' ? 'bg-yellow-500' :
          'bg-green-500'
        }`}
        initial={{ width: 0 }}
        animate={{ width }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </motion.div>
  );
};

const SaleBadge = ({ discount }) => (
  <motion.div
    initial={{ scale: 0, rotate: -180 }}
    animate={{ scale: 1, rotate: 0 }}
    className="absolute top-0 right-0 z-10 m-2"
  >
    <motion.div
      className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full"
      animate={{
        scale: [1, 1.2, 1],
        rotate: [0, 5, -5, 0]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse"
      }}
    >
      {discount}% OFF
    </motion.div>
  </motion.div>
);

const NutritionInfo = ({ nutrition }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="absolute inset-0 bg-black/90 p-4 flex flex-col justify-center items-center text-white"
  >
    <h4 className="text-lime-500 font-bold mb-2">Nutrition Facts</h4>
    <div className="grid grid-cols-2 gap-2 w-full">
      {Object.entries(nutrition).map(([key, value]) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-center"
        >
          <div className="text-gray-400 text-xs">{key.replace('_', ' ')}</div>
          <div className="text-lime-500 font-bold">{value}</div>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

const ProductBenefits = ({ benefits }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="absolute inset-0 bg-black/90 p-4 flex flex-col justify-center items-center text-white"
  >
    <h4 className="text-lime-500 font-bold mb-4">Key Benefits</h4>
    <div className="space-y-2">
      {benefits.map((benefit, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center gap-2"
        >
          <motion.svg
            className="w-4 h-4 text-lime-500 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 0, 360]
            }}
            transition={{
              duration: 1,
              delay: index * 0.1,
              ease: "easeInOut"
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </motion.svg>
          <span className="text-sm">{benefit}</span>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

const TrainingTypeIndicator = ({ types }) => (
  <motion.div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
    {types.map((type, index) => (
      <motion.div
        key={type}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-black/70 backdrop-blur px-2 py-1 rounded text-xs font-medium flex items-center gap-1"
      >
        {type === 'Strength' && (
          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        )}
        {type === 'Muscle Gain' && (
          <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        )}
        {type === 'Endurance' && (
          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        )}
        {type === 'Recovery' && (
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        )}
        <span className="text-white">{type}</span>
      </motion.div>
    ))}
  </motion.div>
);

const FlavorSelector = ({ flavors, selectedFlavor, onSelect }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 to-transparent"
  >
    <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-hide">
      {flavors.map((flavor, index) => (
        <motion.button
          key={flavor}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(flavor);
          }}
          className={`flex-shrink-0 px-2 py-1 rounded-full text-xs font-medium transition-all ${
            selectedFlavor === flavor
              ? 'bg-lime-500 text-black'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          {flavor}
        </motion.button>
      ))}
    </div>
  </motion.div>
);

const AchievementBadge = ({ achievement }) => (
  <motion.div
    initial={{ scale: 0, rotate: -180 }}
    animate={{ scale: 1, rotate: 0 }}
    className="absolute top-2 right-2 z-10"
  >
    <motion.div
      className="relative"
      animate={{
        rotate: [0, 5, -5, 0]
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        repeatType: "reverse"
      }}
    >
      <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
        <motion.div
          className="w-10 h-10 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center"
          animate={{
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          {achievement === 'Best Seller' && '🏆'}
          {achievement === 'New' && '🆕'}
          {achievement === 'Premium' && '⭐'}
          {achievement === 'Limited' && '⚡'}
        </motion.div>
      </div>
      <motion.div
        className="absolute -inset-1 bg-yellow-400/20 rounded-full blur-sm"
        animate={{
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
    </motion.div>
  </motion.div>
);

const ProductIcons = ({ category, rating, stock }) => {
  const getCategoryIcon = () => {
    switch (category.toLowerCase()) {
      case 'mass gainer':
        return (
          <motion.div
            className="bg-purple-500/20 p-2 rounded-full"
            whileHover={{ scale: 1.2 }}
          >
            <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </motion.div>
        );
      case 'whey protein':
        return (
          <motion.div
            className="bg-blue-500/20 p-2 rounded-full"
            whileHover={{ scale: 1.2 }}
          >
            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </motion.div>
        );
      case 'creatine':
        return (
          <motion.div
            className="bg-red-500/20 p-2 rounded-full"
            whileHover={{ scale: 1.2 }}
          >
            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </motion.div>
        );
      default:
        return (
          <motion.div
            className="bg-lime-500/20 p-2 rounded-full"
            whileHover={{ scale: 1.2 }}
          >
            <svg className="w-4 h-4 text-lime-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </motion.div>
        );
    }
  };

  const getStockIcon = () => {
    if (stock < 10) {
      return (
        <motion.div
          className="bg-red-500/20 p-2 rounded-full"
          whileHover={{ scale: 1.2 }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </motion.div>
      );
    }
    return (
      <motion.div
        className="bg-green-500/20 p-2 rounded-full"
        whileHover={{ scale: 1.2 }}
      >
        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </motion.div>
    );
  };

  const getRatingIcon = () => (
    <motion.div
      className="bg-yellow-500/20 p-2 rounded-full"
      whileHover={{ scale: 1.2 }}
    >
      <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    </motion.div>
  );

  return (
    <motion.div 
      className="absolute top-2 left-2 flex gap-2"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {getCategoryIcon()}
      {getStockIcon()}
      {rating >= 4.8 && getRatingIcon()}
    </motion.div>
  );
};

// Update the ProductCard component
const ProductCard = ({ product, onQuickView, onAddToCart }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [activeView, setActiveView] = useState(null);
  const [selectedFlavor, setSelectedFlavor] = useState(product.flavors?.[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0]);
  const [tiltValues, setTiltValues] = useState({ x: 0, y: 0 });
  const [addToCartClicked, setAddToCartClicked] = useState(false);
  const navigate = useNavigate();

  const handleMouseMove = (e) => {
    if (!isHovered) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTiltValues({ x: x * 20, y: y * -20 });
  };

  const handleProductClick = () => {
    // On mobile and tablet, navigate to product details
    if (window.innerWidth < 1024) {
      navigate(`/product/${product.id}`, { state: { product } });
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    setAddToCartClicked(true);
    onAddToCart({ 
      ...product, 
      flavor: selectedFlavor, 
      size: selectedSize 
    });
    
    // Add ripple effect animation
    const button = e.currentTarget;
    const circle = document.createElement('div');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${e.clientY - button.offsetTop - radius}px`;
    circle.classList.add('ripple');

    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) {
      ripple.remove();
    }

    button.appendChild(circle);

    setTimeout(() => setAddToCartClicked(false), 1000);
  };

  // Add error handling for images
  const handleImageError = (e) => {
    e.target.onerror = null; // Prevent infinite loop
    e.target.src = "https://via.placeholder.com/300x300?text=Product+Image"; // Fallback image
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      whileHover={{ y: -8 }}
      style={{
        transform: isHovered ? `perspective(1000px) rotateX(${tiltValues.y}deg) rotateY(${tiltValues.x}deg)` : 'none',
        transition: 'transform 0.2s ease-out'
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setActiveView(null);
        setTiltValues({ x: 0, y: 0 });
      }}
      onClick={handleProductClick}
      className="relative bg-black/50 backdrop-blur border border-lime-500/20 rounded-lg overflow-hidden cursor-pointer transform-gpu"
    >
      {/* Product Icons - Only visible on large screens */}
      <div className="hidden lg:block">
        <ProductIcons 
          category={product.category}
          rating={product.rating}
          stock={product.stock}
        />
      </div>

      {/* Training Type Indicators - Only visible on large screens */}
      <div className="hidden lg:block">
        <TrainingTypeIndicator types={product.trainingTypes || ['Strength', 'Muscle Gain']} />
      </div>

      {/* Achievement Badge - Only visible on large screens */}
      {product.achievement && (
        <div className="hidden lg:block">
          <AchievementBadge achievement={product.achievement} />
        </div>
      )}

      {/* Product Image Container */}
      <div className="relative aspect-square overflow-hidden">
        <motion.img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          animate={{
            scale: isHovered ? 1.15 : 1,
            rotate: isHovered ? -1 : 0,
          }}
          transition={{ 
            type: "spring",
            stiffness: 200,
            damping: 25
          }}
          onError={handleImageError}
        />
        
        {/* View Controls - Only visible on large screens */}
        <div className="absolute inset-0 hidden lg:flex items-center justify-center gap-4 bg-black/60 opacity-0 hover:opacity-100 transition-opacity">
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="bg-lime-500 text-black px-4 py-2 rounded-lg font-semibold text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Quick View
          </motion.button>
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              setActiveView(activeView === 'nutrition' ? null : 'nutrition');
            }}
            className={`backdrop-blur text-white px-4 py-2 rounded-lg font-semibold text-sm ${
              activeView === 'nutrition' ? 'bg-lime-500 text-black' : 'bg-white/20'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Nutrition
          </motion.button>
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              setActiveView(activeView === 'benefits' ? null : 'benefits');
            }}
            className={`backdrop-blur text-white px-4 py-2 rounded-lg font-semibold text-sm ${
              activeView === 'benefits' ? 'bg-lime-500 text-black' : 'bg-white/20'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Benefits
          </motion.button>
        </div>

        {/* Overlays - Only visible on large screens */}
        <div className="hidden lg:block">
          <AnimatePresence>
            {activeView === 'nutrition' && (
              <NutritionInfo nutrition={product.nutrition} />
            )}
            {activeView === 'benefits' && (
              <ProductBenefits benefits={product.benefits || [
                'Enhances Muscle Growth',
                'Improves Recovery Time',
                'Increases Strength',
                'Supports Lean Mass'
              ]} />
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Price Tag - Always visible */}
        <motion.div
          className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm text-lime-500 px-3 py-1 rounded-full text-sm font-bold"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.1 }}
        >
          ${product.price}
        </motion.div>
      </div>

      {/* Product Info */}
      <motion.div 
        className="p-4 space-y-2 relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between">
          <motion.span 
            className="text-lime-500 text-xs font-medium"
            whileHover={{ scale: 1.1 }}
            animate={{
              x: isHovered ? 3 : 0
            }}
          >
            {product.category}
          </motion.span>
          <motion.div 
            className="flex items-center gap-1"
            animate={{
              scale: isHovered ? 1.1 : 1
            }}
          >
            {[...Array(5)].map((_, index) => (
              <motion.span
                key={index}
                className={index < Math.floor(product.rating) ? 'text-yellow-500' : 'text-gray-400'}
                animate={{
                  scale: isHovered && index < Math.floor(product.rating) ? [1, 1.2, 1] : 1,
                  rotate: isHovered && index < Math.floor(product.rating) ? [0, 10, -10, 0] : 0
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  repeat: isHovered ? Infinity : 0,
                  repeatType: "reverse"
                }}
              >
                ★
              </motion.span>
            ))}
          </motion.div>
        </div>

        <motion.h3
          className="text-sm font-bold text-white line-clamp-1"
          animate={{ 
            y: isHovered ? -2 : 0,
            color: isHovered ? "#84cc16" : "#ffffff"
          }}
        >
          {product.name}
        </motion.h3>

        <motion.p 
          className="text-gray-400 text-xs line-clamp-2"
          animate={{ 
            opacity: isHovered ? 0.9 : 0.7,
            y: isHovered ? 2 : 0
          }}
        >
          {product.description}
        </motion.p>

        {/* Add to Cart Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddToCart}
          className="w-full bg-lime-500 text-black py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 relative overflow-hidden"
          animate={addToCartClicked ? {
            scale: [1, 0.9, 1.1, 1],
            transition: { duration: 0.4 }
          } : {}}
        >
          Add to Cart
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

const QuickViewModal = ({ product, onClose, onAddToCart }) => {
  const [selectedTab, setSelectedTab] = useState('details');
  const [selectedFlavor, setSelectedFlavor] = useState(product.flavors?.[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-gray-900 rounded-xl max-w-4xl w-full overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column - Image and Basic Info */}
          <div className="relative">
            <div className="aspect-square">
              <motion.img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              />
            </div>
            <ProductIcons
              category={product.category}
              rating={product.rating}
              stock={product.stock}
            />
          </div>

          {/* Right Column - Details */}
          <div className="p-6 space-y-6">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div>
              <h2 className="text-3xl font-bold text-white mb-2">{product.name}</h2>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-2xl font-bold text-lime-500">${product.price}</span>
                <div className="flex items-center text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <motion.span
                      key={i}
                      animate={{
                        scale: i < Math.floor(product.rating) ? [1, 1.2, 1] : 1
                      }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                    >
                      ★
                    </motion.span>
                  ))}
                  <span className="ml-2 text-gray-400">({product.rating})</span>
                </div>
              </div>
              <p className="text-gray-400">{product.description}</p>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-800">
              <div className="flex gap-4">
                {['details', 'nutrition', 'benefits'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={`px-4 py-2 font-semibold transition-colors ${
                      selectedTab === tab
                        ? 'text-lime-500 border-b-2 border-lime-500'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="min-h-[200px]">
              <AnimatePresence mode="wait">
                {selectedTab === 'details' && (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-black/50 p-4 rounded-lg">
                        <h3 className="text-lime-500 font-semibold mb-2">Category</h3>
                        <p className="text-white">{product.category}</p>
                      </div>
                      <div className="bg-black/50 p-4 rounded-lg">
                        <h3 className="text-lime-500 font-semibold mb-2">Stock</h3>
                        <p className="text-white">{product.stock} units</p>
                      </div>
                    </div>
                    {product.tags && (
                      <div>
                        <h3 className="text-lime-500 font-semibold mb-2">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {product.tags.map((tag) => (
                            <span
                              key={tag}
                              className="bg-black/50 px-3 py-1 rounded-full text-sm text-gray-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {selectedTab === 'nutrition' && (
                  <motion.div
                    key="nutrition"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="grid grid-cols-2 gap-4"
                  >
                    {Object.entries(product.nutrition).map(([key, value]) => (
                      <div key={key} className="bg-black/50 p-4 rounded-lg">
                        <h3 className="text-lime-500 font-semibold mb-2">
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </h3>
                        <p className="text-white text-lg font-bold">{value}</p>
                      </div>
                    ))}
                  </motion.div>
                )}

                {selectedTab === 'benefits' && (
                  <motion.div
                    key="benefits"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
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
                        className="flex items-center gap-3 bg-black/50 p-4 rounded-lg"
                      >
                        <svg className="w-6 h-6 text-lime-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-white">{benefit}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Product Options */}
            <div className="space-y-4">
              {product.flavors && (
                <div>
                  <h3 className="text-white font-semibold mb-2">Flavor</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.flavors.map((flavor) => (
                      <motion.button
                        key={flavor}
                        onClick={() => setSelectedFlavor(flavor)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                          selectedFlavor === flavor
                            ? 'bg-lime-500 text-black'
                            : 'bg-black/50 text-gray-300 hover:text-lime-500 border border-lime-500/20'
                        }`}
                      >
                        {flavor}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {product.sizes && (
                <div>
                  <h3 className="text-white font-semibold mb-2">Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <motion.button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                          selectedSize === size
                            ? 'bg-lime-500 text-black'
                            : 'bg-black/50 text-gray-300 hover:text-lime-500 border border-lime-500/20'
                        }`}
                      >
                        {size}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Add to Cart Button */}
            <motion.button
              onClick={() => {
                onAddToCart({ ...product, flavor: selectedFlavor, size: selectedSize });
                onClose();
              }}
              className="w-full bg-lime-500 text-black py-4 rounded-lg font-semibold text-lg hover:bg-lime-600 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Add to Cart - ${product.price}
              {selectedSize && <span className="text-sm ml-2">/ {selectedSize}</span>}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Add new Pagination component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded-lg text-sm font-semibold ${
          currentPage === 1
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
            : 'bg-black/50 text-white hover:bg-lime-500/20 border border-lime-500/20'
        }`}
      >
        Previous
      </motion.button>
      
      <div className="flex gap-2">
        {[...Array(totalPages)].map((_, index) => (
          <motion.button
            key={index + 1}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPageChange(index + 1)}
            className={`w-10 h-10 rounded-lg text-sm font-semibold flex items-center justify-center ${
              currentPage === index + 1
                ? 'bg-lime-500 text-black'
                : 'bg-black/50 text-white hover:bg-lime-500/20 border border-lime-500/20'
            }`}
          >
            {index + 1}
          </motion.button>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 rounded-lg text-sm font-semibold ${
          currentPage === totalPages
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
            : 'bg-black/50 text-white hover:bg-lime-500/20 border border-lime-500/20'
        }`}
      >
        Next
      </motion.button>
    </div>
  );
};

// Add Toast component
const Toast = ({ message, isVisible, onHide }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onHide, 2000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onHide]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.5 }}
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
        >
          <motion.div
            className="bg-lime-500 text-black px-6 py-3 rounded-xl shadow-xl flex items-center gap-3"
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 1, -1, 0],
            }}
            transition={{ duration: 0.3 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-semibold">{message}</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Add AnimatedBackground component
const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Gradient Base */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black">
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              'radial-gradient(circle at 0% 0%, #00ff8822 0%, transparent 50%)',
              'radial-gradient(circle at 100% 100%, #00ff8822 0%, transparent 50%)',
              'radial-gradient(circle at 0% 100%, #00ff8822 0%, transparent 50%)',
              'radial-gradient(circle at 100% 0%, #00ff8822 0%, transparent 50%)',
            ]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </div>

      {/* Animated Grid */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, #84cc1620 1px, transparent 1px),
            linear-gradient(to bottom, #84cc1620 1px, transparent 1px)
          `,
          backgroundSize: '4rem 4rem',
        }}
      >
        <motion.div
          className="absolute inset-0"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Floating Orbs */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-32 h-32 rounded-full"
          style={{
            background: 'radial-gradient(circle at center, #84cc1610 0%, transparent 70%)',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0],
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: i * 0.2,
          }}
        />
      ))}

      {/* Animated Lines */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={`line-${i}`}
          className="absolute h-px w-48 bg-gradient-to-r from-transparent via-lime-500/20 to-transparent"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [-200, window.innerWidth + 200],
            rotate: Math.random() * 360,
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            ease: "linear",
            delay: i * 0.5,
          }}
        />
      ))}

      {/* Glowing Points */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={`point-${i}`}
          className="absolute w-1 h-1 bg-lime-500/50 rounded-full shadow-lg shadow-lime-500/50"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: i * 0.1,
          }}
        />
      ))}

      {/* Vignette Effect */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent to-black/50" />
    </div>
  );
};

const Shop = () => {
  // Group all useState hooks together
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  
  const { addToCart } = useCart();
  const productsPerPage = 10;

  // Firebase listener effect
  useEffect(() => {
    const productsRef = collection(db, 'products');
    const unsubscribe = onSnapshot(productsRef, 
      (snapshot) => {
        const dynamicProducts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        // Combine dynamic and static products
        const allProducts = [...dynamicProducts, ...staticProducts];
        console.log('Fetched products:', allProducts);
        setProducts(allProducts);
        setFilteredProducts(allProducts);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching products:', error);
        // Even if dynamic products fail to load, show static products
        setProducts(staticProducts);
        setFilteredProducts(staticProducts);
        setError('Failed to load some products');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Filter and sort effect
  useEffect(() => {
    console.log('Filtering products:', {
      searchTerm,
      selectedCategory,
      sortBy,
      totalProducts: products.length
    });

    const filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || 
                            (product.category && product.category.toLowerCase() === selectedCategory.toLowerCase());
      
      console.log('Product filter check:', {
        name: product.name,
        category: product.category,
        matchesSearch,
        matchesCategory
      });
      
      return matchesSearch && matchesCategory;
    });

    console.log('Filtered products:', filtered.length);

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    console.log('Sorted products:', sorted.length);
    setFilteredProducts(sorted);
    setCurrentPage(1);
  }, [products, searchTerm, selectedCategory, sortBy]);

  // Reset page effect
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortBy]);

  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    setToastMessage(`${product.name} added to cart!`);
    setShowToast(true);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <AnimatedBackground />
      </div>

      {/* Main Content */}
      <div className="flex-grow relative py-12 px-4 sm:px-6 lg:px-8">
        {/* Search and Filters */}
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
          isFiltersOpen={isFiltersOpen}
          onToggleFilters={() => setIsFiltersOpen(!isFiltersOpen)}
          products={products}
        />

        {/* Products Grid */}
        <motion.div
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
        >
          <AnimatePresence mode="wait">
            {currentProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard
                  product={product}
                  onQuickView={handleQuickView}
                  onAddToCart={handleAddToCart}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <QuickViewModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onAddToCart={handleAddToCart}
          />
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-lime-500 text-black px-6 py-3 rounded-lg shadow-lg"
            onAnimationComplete={() => {
              setTimeout(() => setShowToast(false), 2000);
            }}
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <Footer />
    </div>
  );
};

// Add radial gradient utility to tailwind
const styles = `
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }

  .ripple {
    position: absolute;
    border-radius: 50%;
    transform: scale(0);
    animation: ripple 600ms linear;
    background-color: rgba(255, 255, 255, 0.7);
  }

  .bg-gradient-radial {
    background-image: radial-gradient(var(--tw-gradient-stops));
  }
`;

// Add style tag to the document
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default Shop;