import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

// SVG Components for animated background
const CartIcon = () => (
  <svg 
    viewBox="0 0 24 24" 
    className="w-7 h-7"
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
)

// Floating Cart Preview Component
const FloatingCart = ({ items, onUpdateQuantity, onRemoveItem }) => {
  const [isOpen, setIsOpen] = useState(false)

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="fixed right-4 bottom-4 z-50">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="relative"
      >
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-lime-500 text-black w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:bg-lime-600 transition-all duration-300 group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{
              rotate: isOpen ? 180 : 0
            }}
            transition={{ duration: 0.3 }}
          >
            <CartIcon />
          </motion.div>
          {items.length > 0 && (
            <motion.div
              className="absolute -top-2 -right-2 bg-black text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20
              }}
            >
              {items.reduce((sum, item) => sum + item.quantity, 0)}
            </motion.div>
          )}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-lime-500"
            initial={{ scale: 1 }}
            animate={{ scale: 1.1, opacity: 0 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-20 right-0 w-80 bg-black border border-lime-500/20 rounded-xl shadow-xl overflow-hidden backdrop-blur-lg"
            >
              <div className="p-4 border-b border-lime-500/20">
                <h3 className="text-white font-bold flex items-center gap-2">
                  <CartIcon />
                  Your Cart
                </h3>
              </div>
              <div className="p-4 space-y-4">
                {items.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">
                    Your cart is empty
                  </div>
                ) : (
                  items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between group"
                    >
                      <div>
                        <h4 className="text-white group-hover:text-lime-500 transition-colors">{item.name}</h4>
                        <div className="flex items-center gap-3 text-gray-400 text-sm">
                          <div className="flex items-center gap-2">
                            <button 
                              className="hover:text-lime-500 transition-colors"
                              onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                            >
                              -
                            </button>
                            <span>Qty: {item.quantity}</span>
                            <button 
                              className="hover:text-lime-500 transition-colors"
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                          <button 
                            className="opacity-0 group-hover:opacity-100 text-red-500 transition-all"
                            onClick={() => onRemoveItem(item.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <p className="text-lime-500 font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                    </motion.div>
                  ))
                )}
              </div>
              {items.length > 0 && (
                <motion.div 
                  className="p-4 bg-black/50 border-t border-lime-500/20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-white font-bold">Total:</span>
                    <span className="text-lime-500 font-bold text-xl">${total.toFixed(2)}</span>
                  </div>
                  <a href="https://wa.me/+96103903800?text=I%20want%20to%20order">
                  <motion.button 
                    className="w-full bg-lime-500 text-black font-bold py-3 rounded hover:bg-lime-600 transition-all flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Checkout
                    <svg 
                      className="w-5 h-5" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                    </motion.button>
                  </a>
                 
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

// SVG Components for animated background
const ProteinMolecule = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <circle cx="50" cy="50" r="20" className="fill-current" />
    <circle cx="85" cy="50" r="10" className="fill-current" />
    <circle cx="15" cy="50" r="10" className="fill-current" />
    <circle cx="50" cy="85" r="10" className="fill-current" />
    <circle cx="50" cy="15" r="10" className="fill-current" />
  </svg>
)

const AminoAcid = ({ type }) => {
  const aminoAcids = {
    leucine: "Leu",
    isoleucine: "Ile",
    valine: "Val",
    glutamine: "Gln",
    alanine: "Ala"
  }
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="40" className="fill-current opacity-30" />
      <text x="50" y="50" 
            className="fill-current text-2xl font-bold" 
            textAnchor="middle" 
            dominantBaseline="middle">
        {aminoAcids[type] || "AA"}
      </text>
    </svg>
  )
}

const Capsule = () => (
  <svg viewBox="0 0 100 40" className="w-full h-full">
    <path d="M10,20 L70,20 Q90,20 90,20 T90,20" 
          className="stroke-current" 
          strokeWidth="15" 
          strokeLinecap="round"
          fill="none" />
  </svg>
)

const Vitamin = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <text x="50" y="50" 
          className="fill-current text-4xl font-bold" 
          textAnchor="middle" 
          dominantBaseline="middle">
      B12
    </text>
  </svg>
)

const ProteinChain = () => (
  <svg viewBox="0 0 200 100" className="w-full h-full">
    <path d="M20,50 Q50,20 80,50 T140,50 T200,50" 
          className="stroke-current" 
          strokeWidth="8"
          fill="none" />
    <circle cx="20" cy="50" r="10" className="fill-current" />
    <circle cx="80" cy="50" r="10" className="fill-current" />
    <circle cx="140" cy="50" r="10" className="fill-current" />
  </svg>
)

const MuscleIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <path d="M20,50 C20,20 80,20 80,50 C80,80 20,80 20,50" 
          className="fill-current" />
    <path d="M35,50 C35,35 65,35 65,50 C65,65 35,65 35,50" 
          className="fill-current opacity-50" />
  </svg>
)

// Updated SVG Components
const DumbbellIcon = () => (
  <svg viewBox="0 0 100 40" className="w-full h-full">
    <circle cx="15" cy="20" r="12" className="fill-current" />
    <circle cx="85" cy="20" r="12" className="fill-current" />
    <rect x="15" y="17" width="70" height="6" className="fill-current" />
  </svg>
)

const ShakeIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <path d="M30,20 L70,20 L65,90 L35,90 Z" className="fill-current" />
    <path d="M40,10 L60,10 L70,20 L30,20 Z" className="fill-current" />
    <path d="M35,30 L65,30 M35,40 L65,40 M35,50 L65,50" 
          className="stroke-current" 
          strokeWidth="3"
          fill="none" />
  </svg>
)

const ProductCard = ({ product }) => {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="relative h-[600px] perspective-1000"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
    >
      <motion.div
        className="relative w-full h-full"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front of card */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black/95 to-black/90 rounded-2xl border border-lime-500/20 overflow-hidden">
          {/* Background Animation */}
          <motion.div
            className="absolute inset-0 opacity-20"
            animate={{
              background: [
                'radial-gradient(circle at 0% 0%, #84cc16 0%, transparent 50%)',
                'radial-gradient(circle at 100% 100%, #84cc16 0%, transparent 50%)',
                'radial-gradient(circle at 0% 100%, #84cc16 0%, transparent 50%)',
                'radial-gradient(circle at 100% 0%, #84cc16 0%, transparent 50%)',
                'radial-gradient(circle at 0% 0%, #84cc16 0%, transparent 50%)',
              ],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          <div className="relative h-72 overflow-hidden rounded-t-2xl">
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"
              animate={{
                opacity: isHovered ? 1 : 0.7
              }}
            />
            <motion.img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              animate={{
                scale: isHovered ? 1.1 : 1
              }}
              transition={{ duration: 0.4 }}
            />
            {/* Floating Product Details */}
            <motion.div
              className="absolute top-4 right-4 bg-black/80 backdrop-blur border border-lime-500/20 rounded-lg px-3 py-1 z-20"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="text-lime-500 font-bold">${product.price}</span>
            </motion.div>
            {/* Product Badge */}
            {product.badge && (
              <motion.div
                className="absolute top-4 left-4 bg-lime-500 text-black rounded-lg px-3 py-1 z-20 font-semibold text-sm"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {product.badge}
              </motion.div>
            )}
          </div>

          <div className="p-6 relative">
            {/* Product Category */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lime-500 text-sm font-medium">{product.category}</span>
              <span className="w-1 h-1 bg-lime-500/50 rounded-full"/>
              <span className="text-gray-400 text-sm">{product.size}</span>
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
              {product.name}
              {product.isNew && (
                <span className="text-xs bg-lime-500/20 text-lime-500 px-2 py-1 rounded-full">NEW</span>
              )}
            </h3>
            
            <p className="text-gray-400 mb-4 line-clamp-2">{product.description}</p>
            
            {/* Key Features */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {product.keyFeatures?.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                  <div className="w-2 h-2 rounded-full bg-lime-500/50" />
                  {feature}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-black bg-lime-500 hover:bg-lime-600 px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
                >
                  Add to Cart
                  <span className="text-xl">🛒</span>
                </motion.button>
                <motion.button
                  onClick={() => setIsFlipped(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-lime-500 hover:text-lime-400 px-4 py-3 rounded-lg font-semibold border border-lime-500/20 hover:border-lime-500/40"
                >
                  Details
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-black via-black/95 to-black/90 rounded-2xl border border-lime-500/20 [transform:rotateY(180deg)] [backface-visibility:hidden] cursor-pointer group/back"
          onClick={() => setIsFlipped(false)}
        >
          <div className="p-8 h-full flex flex-col relative">
            {/* Flip indicator */}
            <motion.div
              className="absolute top-4 right-4 text-gray-400 flex items-center gap-2 opacity-50 group-hover/back:opacity-100 transition-opacity"
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 0.5 }}
              transition={{ delay: 0.5 }}
            >
              <span className="text-sm">Click anywhere to flip back</span>
              <svg 
                className="w-5 h-5 animate-bounce" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M7 16l-4-4m0 0l4-4m-4 4h18"
                />
              </svg>
            </motion.div>

            <div className="flex items-center justify-between mb-6">
              <h4 className="text-2xl font-bold text-lime-500">Nutrition Facts</h4>
            </div>

            {/* Nutrition Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {Object.entries(product.nutrition || {}).map(([key, value]) => (
                <div 
                  key={key} 
                  className="bg-black/30 border border-lime-500/10 rounded-lg p-4 hover:border-lime-500/30 transition-colors"
                >
                  <h5 className="text-gray-400 text-sm mb-1 capitalize">{key}</h5>
                  <p className="text-white text-xl font-bold">{value}</p>
                </div>
              ))}
            </div>

            {/* Benefits Section */}
            <div className="mb-8">
              <h4 className="text-xl font-bold text-lime-500 mb-4">Key Benefits</h4>
              <ul className="space-y-3">
                {product.benefits?.map((benefit, idx) => (
                  <li 
                    key={idx} 
                    className="flex items-start gap-3 text-gray-300 hover:text-white transition-colors"
                  >
                    <span className="text-lime-500 text-xl">•</span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            {/* Usage Instructions */}
            <div className="mt-auto">
              <h4 className="text-xl font-bold text-lime-500 mb-4">Recommended Usage</h4>
              <p className="text-gray-300">{product.usage}</p>
            </div>

            {/* Visual feedback for clickable area */}
            <motion.div
              className="absolute inset-0 bg-lime-500/5 opacity-0 group-hover/back:opacity-100 transition-opacity"
              whileHover={{ scale: 0.98 }}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Why Choose Us Icons
const QualityIcon = () => (
  <svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke="currentColor">
    <motion.path
      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
    />
  </svg>
)

const SpeedIcon = () => (
  <svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke="currentColor">
    <motion.path
      d="M12 2V4M12 20V22M4 12H2M6.31 6.31L4.89 4.89M17.69 6.31L19.11 4.89M6.31 17.69L4.89 19.11M17.69 17.69L19.11 19.11M22 12H20"
      strokeWidth="2"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
    />
    <motion.path
      d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
      strokeWidth="2"
      initial={{ scale: 0.8 }}
      animate={{ scale: 1.1 }}
      transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
    />
  </svg>
)

const LabIcon = () => (
  <svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke="currentColor">
    <motion.path
      d="M9 2V4M15 2V4"
      strokeWidth="2"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
    />
    <motion.path
      d="M10 14L8 20H16L14 14M10 14L12 8M10 14H14M14 14L12 8M12 8V4"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
    />
  </svg>
)

const ExpertIcon = () => (
  <svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke="currentColor">
    <motion.path
      d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
      strokeWidth="2"
      initial={{ scale: 0.8 }}
      animate={{ scale: 1.1 }}
      transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
    />
    <motion.path
      d="M20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12Z"
      strokeWidth="2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
    />
    <motion.path
      d="M12 2V4M12 20V22M2 12H4M20 12H22"
      strokeWidth="2"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
    />
  </svg>
)

const NaturalIcon = () => (
  <svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke="currentColor">
    <motion.path
      d="M12 2L14 6L12 12L10 6L12 2Z"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
    />
    <motion.path
      d="M12 12C12 12 18 11 18 6C18 11 24 12 24 12C24 12 18 13 18 18C18 13 12 12 12 12ZM12 12C12 12 6 11 6 6C6 11 0 12 0 12C0 12 6 13 6 18C6 13 12 12 12 12Z"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ scale: 0.8 }}
      animate={{ scale: 1.1 }}
      transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
    />
  </svg>
)

const ResultsIcon = () => (
  <svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke="currentColor">
    <motion.path
      d="M4 20H20"
      strokeWidth="2"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
    />
    <motion.path
      d="M4 20V12M8 20V8M12 20V4M16 20V8M20 20V12"
      strokeWidth="2"
      strokeLinecap="round"
      initial={{ pathLength: 0, y: 10 }}
      animate={{ pathLength: 1, y: 0 }}
      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
    />
  </svg>
)

// Add these helper functions before the Home component
const calculateBMR = (weight, height, age, gender) => {
  // Mifflin-St Jeor Equation
  if (gender === 'male') {
    return (10 * weight) + (6.25 * height) - (5 * age) + 5;
  }
  return (10 * weight) + (6.25 * height) - (5 * age) - 161;
}

const calculateTDEE = (bmr, activityLevel) => {
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    very: 1.725,
    extra: 1.9
  };
  return Math.round(bmr * activityMultipliers[activityLevel]);
}

const calculateMacros = (tdee, goal) => {
  let protein, carbs, fats;
  
  switch(goal) {
    case 'muscle_gain':
      protein = Math.round((tdee * 0.3) / 4); // 30% of calories from protein
      fats = Math.round((tdee * 0.25) / 9); // 25% of calories from fat
      carbs = Math.round((tdee * 0.45) / 4); // 45% of calories from carbs
      break;
    case 'weight_loss':
      tdee = tdee - 500; // 500 calorie deficit
      protein = Math.round((tdee * 0.4) / 4); // 40% of calories from protein
      fats = Math.round((tdee * 0.3) / 9); // 30% of calories from fat
      carbs = Math.round((tdee * 0.3) / 4); // 30% of calories from carbs
      break;
    default: // maintenance
      protein = Math.round((tdee * 0.3) / 4);
      fats = Math.round((tdee * 0.3) / 9);
      carbs = Math.round((tdee * 0.4) / 4);
  }

  return { protein, carbs, fats, calories: tdee };
}

const getSupplementRecommendations = (goal, restrictions) => {
  const baseRecommendations = {
    muscle_gain: [
      { name: "Pro Whey Isolate", dosage: "2 scoops daily", timing: "Post-workout and between meals" },
      { name: "Creatine Monohydrate", dosage: "5g daily", timing: "Any time" },
      { name: "BCAAs", dosage: "5-10g", timing: "During workouts" }
    ],
    weight_loss: [
      { name: "Whey Protein Isolate", dosage: "1-2 scoops daily", timing: "Between meals" },
      { name: "L-Carnitine", dosage: "2g daily", timing: "Before cardio" },
      { name: "CLA", dosage: "3g daily", timing: "With meals" }
    ],
    performance: [
      { name: "Pre-Workout Complex", dosage: "1 scoop", timing: "30 mins before workout" },
      { name: "Beta-Alanine", dosage: "3-5g daily", timing: "Any time" },
      { name: "Electrolyte Formula", dosage: "1 serving", timing: "During workouts" }
    ],
    recovery: [
      { name: "Post-Workout Recovery", dosage: "1 scoop", timing: "Immediately after workout" },
      { name: "Glutamine", dosage: "5g daily", timing: "Before bed" },
      { name: "ZMA", dosage: "1 serving", timing: "Before bed" }
    ]
  };

  // Filter based on restrictions
  return baseRecommendations[goal].filter(supp => {
    if (restrictions.includes('vegan') && supp.name.toLowerCase().includes('whey')) {
      return false;
    }
    // Add more restriction filters as needed
    return true;
  });
};

const QuickView = ({ product, onClose, onAddToCart, isFavorite, onToggleFavorite }) => {
  if (!product) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-black border border-lime-500/20 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* Product Image */}
          <div className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-lime-500/20 via-lime-500/10 to-transparent">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <div className="absolute top-4 left-4 bg-lime-500 text-black px-3 py-1 rounded-full text-sm font-bold">
                {product.badge}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-white">{product.name}</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onToggleFavorite(product.id)}
                className={`p-2 rounded-full ${
                  isFavorite ? 'text-red-500' : 'text-gray-400'
                }`}
              >
                <svg className="w-6 h-6" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </motion.button>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-lime-500">${product.price}</span>
              {product.oldPrice && (
                <span className="text-xl text-gray-500 line-through">${product.oldPrice}</span>
              )}
            </div>

            <p className="text-gray-300">{product.description}</p>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white">Key Features</h3>
              <div className="grid grid-cols-2 gap-3">
                {product.keyFeatures?.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-gray-300">
                    <div className="w-2 h-2 rounded-full bg-lime-500/50" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {product.nutrition && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Nutrition Facts</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(product.nutrition).map(([key, value]) => (
                    <div key={key} className="bg-black/30 border border-lime-500/10 rounded-lg p-4">
                      <h5 className="text-gray-400 text-sm capitalize">{key}</h5>
                      <p className="text-white text-lg font-bold">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onAddToCart(product)}
              className="w-full bg-lime-500 text-black py-4 rounded-xl font-bold text-lg hover:bg-lime-400 transition-colors flex items-center justify-center gap-2"
            >
              Add to Cart
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Close Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

const Home = () => {
  const [hoveredProduct, setHoveredProduct] = useState(null)
  const [cartItems, setCartItems] = useState([])
  const [favorites, setFavorites] = useState([])
  const [quickViewProduct, setQuickViewProduct] = useState(null)

  // Cart handlers
  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id)
      if (existingItem) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, { ...product, quantity: quantity }]
    })
  }

  const updateCartQuantity = (productId, newQuantity) => {
    setCartItems(prev => {
      if (newQuantity === 0) {
        return prev.filter(item => item.id !== productId)
      }
      return prev.map(item => 
        item.id === productId 
          ? { ...item, quantity: newQuantity }
          : item
      )
    })
  }

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId))
  }

  const toggleFavorite = (productId) => {
    setFavorites(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  // Nutrition Calculator States
  const [calculatorData, setCalculatorData] = useState({
    weight: '',
    height: '',
    age: '',
    gender: 'male',
    activityLevel: 'moderate',
    goal: 'maintenance'
  });

  const [nutritionResults, setNutritionResults] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Supplement Quiz States
  const [quizData, setQuizData] = useState({
    goal: '',
    fitnessLevel: 50,
    restrictions: []
  });

  const [quizResults, setQuizResults] = useState(null);
  const [quizStep, setQuizStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculator handlers
  const handleCalculatorInput = (e) => {
    const { name, value } = e.target;
    setCalculatorData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateNutrition = () => {
    const { weight, height, age, gender, activityLevel, goal } = calculatorData;
    
    if (!weight || !height || !age) return;

    setIsCalculating(true);
    setNutritionResults(null);

    // Simulate calculation time for better UX
    setTimeout(() => {
      const bmr = calculateBMR(Number(weight), Number(height), Number(age), gender);
      const tdee = calculateTDEE(bmr, activityLevel);
      const macros = calculateMacros(tdee, goal);
      setNutritionResults(macros);
      setIsCalculating(false);
    }, 2000);
  };

  // Quiz handlers
  const handleQuizInput = (field, value) => {
    setQuizData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRestrictionToggle = (restriction) => {
    setQuizData(prev => ({
      ...prev,
      restrictions: prev.restrictions.includes(restriction)
        ? prev.restrictions.filter(r => r !== restriction)
        : [...prev.restrictions, restriction]
    }));
  };

  const submitQuiz = () => {
    const recommendations = getSupplementRecommendations(quizData.goal, quizData.restrictions);
    setQuizResults(recommendations);
  };

  const featuredProducts = [
    {
      id: 1,
      name: "Inner Armour Mass Peak",
      price: 89.99,
      image: "/Images/InnerArmour.png",
      description: "Premium mass gainer for serious athletes looking to build quality muscle mass with a powerful blend of proteins, carbs, and essential nutrients.",
      category: "Mass Gainer",
      size: "12 lbs (5.44 kg)",
      badge: "Best Seller",
      isNew: true,
      keyFeatures: [
        "High-quality protein blend",
        "Complex carbohydrates",
        "Essential vitamins & minerals",
        "Enhanced muscle growth"
      ],
      color: "from-lime-500 to-lime-600",
      nutrition: {
        protein: "52g",
        calories: "1250",
        carbs: "245g",
        servings: "30"
      },
      benefits: [
        "Rapid muscle mass gains",
        "Enhanced recovery",
        "Improved strength",
        "Complete nutrient profile"
      ],
      usage: "Mix 2 scoops with 16-20 oz of cold water or milk. Take 1-2 servings daily between meals or post-workout."
    },
    {
      id: 2,
      name: "BPI Sports Whey HD",
      price: 54.99,
      image: "/Images/bpi-sports-whey-hd.png",
      description: "Ultra-premium whey protein formula designed for maximum muscle growth and rapid recovery.",
      category: "Whey Protein",
      size: "5 lbs (2.27 kg)",
      badge: "Top Rated",
      keyFeatures: [
        "25g protein per serving",
        "Fast absorption",
        "Low in carbs",
        "Great taste"
      ],
      color: "from-lime-500 to-lime-600",
      nutrition: {
        protein: "25g",
        calories: "130",
        bcaa: "5.6g",
        servings: "25"
      },
      benefits: [
        "Lean muscle growth",
        "Enhanced protein synthesis",
        "Quick recovery",
        "Improved performance"
      ],
      usage: "Mix 1 scoop with 8-10 oz of cold water or milk. Take 1-2 servings daily, preferably post-workout or between meals."
    },
    {
      id: 3,
      name: "BPI Creatine",
      price: 29.99,
      image: "/Images/BPI CREATINE.webp",
      description: "Pure micronized creatine monohydrate for maximum strength, power, and muscle growth.",
      category: "Creatine",
      size: "300g",
      isNew: true,
      keyFeatures: [
        "5g pure creatine per serving",
        "Micronized formula",
        "Enhanced absorption",
        "100% pure"
      ],
      color: "from-lime-500 to-lime-600",
      nutrition: {
        creatine: "5g",
        calories: "0",
        servings: "60"
      },
      benefits: [
        "Increased strength",
        "Enhanced power output",
        "Improved muscle recovery",
        "Better performance"
      ],
      usage: "Mix 1 scoop (5g) with water or your favorite beverage. Take daily for best results."
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  }

  const backgroundElements = [
    { Component: ProteinMolecule, size: 80 },
    { Component: AminoAcid, size: 60 },
    { Component: Capsule, size: 100 },
    { Component: Vitamin, size: 70 }
  ]

  // Add this loading animation component
  const LoadingAnimation = () => (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center space-y-4">
        <motion.div
          className="w-20 h-20 text-lime-500"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <motion.path
              d="M12 2L15 5.5L12 9L9 5.5L12 2Z"
              animate={{ fill: ['rgba(132, 204, 22, 0)', 'rgba(132, 204, 22, 1)', 'rgba(132, 204, 22, 0)'] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.path
              d="M12 15L15 18.5L12 22L9 18.5L12 15Z"
              animate={{ fill: ['rgba(132, 204, 22, 0)', 'rgba(132, 204, 22, 1)', 'rgba(132, 204, 22, 0)'] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
            <motion.path
              d="M2 8.5L5 12L2 15.5L-1 12L2 8.5Z"
              animate={{ fill: ['rgba(132, 204, 22, 0)', 'rgba(132, 204, 22, 1)', 'rgba(132, 204, 22, 0)'] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            />
            <motion.path
              d="M22 8.5L25 12L22 15.5L19 12L22 8.5Z"
              animate={{ fill: ['rgba(132, 204, 22, 0)', 'rgba(132, 204, 22, 1)', 'rgba(132, 204, 22, 0)'] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
            />
          </svg>
        </motion.div>
        <motion.div
          className="text-lime-500 font-bold text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Calculating your nutrition plan...
        </motion.div>
        <motion.div
          className="text-gray-400 text-sm max-w-md text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          We're analyzing your data to create a personalized nutrition and supplement plan
        </motion.div>
      </div>
      <motion.div
        className="w-full h-2 bg-lime-500/20 rounded-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <motion.div
          className="h-full bg-lime-500"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black overflow-x-hidden">
      <FloatingCart 
        items={cartItems} 
        onUpdateQuantity={updateCartQuantity} 
        onRemoveItem={removeFromCart} 
      />
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* DNA Helix Animation */}
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={`helix-${i}`}
              className="absolute left-0 w-full"
              style={{
                top: `${i * 10}%`,
                opacity: 0.2
              }}
              initial={{ x: -100 }}
              animate={{
                x: ["-100%", "100%"],
                y: [0, 20, 0],
              }}
              transition={{
                x: {
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                  delay: i * 2
                },
                y: {
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                  delay: i * 0.5
                }
              }}
            >
              <div className="flex items-center">
                {[...Array(20)].map((_, j) => (
                  <motion.div
                    key={`node-${j}`}
                    className="w-4 h-4 rounded-full bg-lime-500 mx-8"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: j * 0.1
                    }}
                  >
                    <motion.div
                      className="absolute h-8 w-1 bg-lime-500/20"
                      style={{
                        transformOrigin: "center",
                        rotate: j % 2 === 0 ? "45deg" : "-45deg"
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}

          {/* Hexagonal Grid Pattern */}
          <div className="absolute inset-0" style={{ perspective: '1000px' }}>
            <motion.div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill-rule='evenodd' stroke='%2384CC16' fill='none'/%3E%3C/svg%3E")`,
                backgroundSize: '60px 60px',
              }}
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 10, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "linear"
              }}
            />
          </div>

          {/* Flowing Energy Lines */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={`line-${i}`}
              className="absolute h-px bg-gradient-to-r from-transparent via-lime-500/30 to-transparent"
              style={{
                width: '100%',
                top: `${Math.random() * 100}%`,
                left: 0
              }}
              animate={{
                x: ["-100%", "100%"],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "linear"
              }}
            />
          ))}
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Column - Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center lg:text-left space-y-6 sm:space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="inline-block bg-lime-500/10 border border-lime-500/20 rounded-full px-4 sm:px-6 py-2"
              >
                <span className="text-lime-500 font-semibold text-sm sm:text-base">Premium Supplements</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight"
              >
                Fuel Your
                <span className="relative block sm:inline-block mt-2 sm:mt-0">
                  <span className="relative z-10 text-lime-500 sm:ml-4">Performance</span>
                  <motion.span
                    className="absolute inset-0 bg-lime-500/10 -skew-x-12 rounded"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 1 }}
                  />
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-xl mx-auto lg:mx-0"
              >
                Premium workout supplements engineered for maximum gains, faster recovery, and peak performance. Backed by science, trusted by athletes.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Link to="/shop">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto bg-lime-500 text-black px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg hover:bg-lime-400 transition-colors flex items-center justify-center gap-2 group"
                  >
                    Shop Now
                    <motion.span
                      className="inline-block"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </motion.button>
                </Link>
              </motion.div>

              {/* Trust Badges */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-8 pt-6 sm:pt-8 border-t border-lime-500/20"
              >
                {[
                  { 
                    icon: (
                      <motion.svg 
                        viewBox="0 0 24 24" 
                        className="w-8 h-8" 
                        fill="none" 
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <motion.path
                          d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                        />
                      </motion.svg>
                    ),
                    text: "Premium Quality" 
                  },
                  { 
                    icon: (
                      <motion.svg 
                        viewBox="0 0 24 24" 
                        className="w-8 h-8" 
                        fill="none" 
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <motion.path
                          d="M10 2v4M14 2v4M8 12h8M9 16h6"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                        />
                        <motion.path
                          d="M7 4h10v16l-5-3-5 3V4z"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1, delay: 0.2 }}
                        />
                      </motion.svg>
                    ),
                    text: "Lab Tested" 
                  },
                  { 
                    icon: (
                      <motion.svg 
                        viewBox="0 0 24 24" 
                        className="w-8 h-8" 
                        fill="none" 
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <motion.path
                          d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                        />
                      </motion.svg>
                    ),
                    text: "Fast Results" 
                  }
                ].map((badge, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.2 + (index * 0.1) }}
                  >
                    <div className="text-lime-500">
                      {badge.icon}
                    </div>
                    <span className="text-gray-400 text-sm font-medium">{badge.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Column - 3D Product Showcase */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative mt-8 lg:mt-0"
            >
              {/* Product Image Container */}
              <motion.div
                animate={{
                  rotateY: [0, 10, 0],
                  rotateX: [0, 5, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="relative z-10"
              >
                <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-lime-500/20 via-lime-500/10 to-transparent border border-lime-500/20">
                  <img
                    src="/Images/Cover.jpg"
                    alt="Premium Supplement"
                    className="w-full h-full object-contain p-4 sm:p-8"
                  />
                </div>
              </motion.div>

              {/* Background Glow Effect */}
              <motion.div
                className="absolute inset-0 -z-10 blur-3xl"
                animate={{
                  background: [
                    'radial-gradient(circle at 50% 50%, rgba(132, 204, 22, 0.3) 0%, transparent 70%)',
                    'radial-gradient(circle at 60% 60%, rgba(132, 204, 22, 0.3) 0%, transparent 70%)',
                    'radial-gradient(circle at 40% 40%, rgba(132, 204, 22, 0.3) 0%, transparent 70%)',
                    'radial-gradient(circle at 50% 50%, rgba(132, 204, 22, 0.3) 0%, transparent 70%)',
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* About Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="relative py-24 overflow-hidden"
      >
        <div className="absolute inset-0">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-lime-500/10 via-transparent to-transparent"
          />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              About <span className="text-lime-500">Our Mission</span>
            </h2>
            <p className="text-gray-300 max-w-3xl mx-auto text-lg">
              We're dedicated to providing the highest quality supplements to support your fitness journey. 
              Our products are crafted with premium ingredients and backed by scientific research.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-12">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="border border-lime-500/20 rounded-xl p-6 bg-black/50 backdrop-blur">
                <h3 className="text-2xl font-bold text-lime-500 mb-4">Premium Quality</h3>
                <p className="text-gray-300">
                  Every product undergoes rigorous testing and quality control to ensure maximum effectiveness.
                </p>
              </div>
              <div className="border border-lime-500/20 rounded-xl p-6 bg-black/50 backdrop-blur">
                <h3 className="text-2xl font-bold text-lime-500 mb-4">Science-Backed</h3>
                <p className="text-gray-300">
                  Our formulas are developed based on the latest scientific research in sports nutrition.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Featured Products Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative py-24 overflow-hidden"
      >
        {/* Animated Background */}
        <div className="absolute inset-0">
          <motion.div
            animate={{
              background: [
                'radial-gradient(circle at 0% 0%, rgba(132, 204, 22, 0.15) 0%, transparent 50%)',
                'radial-gradient(circle at 100% 100%, rgba(132, 204, 22, 0.15) 0%, transparent 50%)',
                'radial-gradient(circle at 100% 0%, rgba(132, 204, 22, 0.15) 0%, transparent 50%)',
                'radial-gradient(circle at 0% 100%, rgba(132, 204, 22, 0.15) 0%, transparent 50%)',
              ]
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute inset-0"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="inline-block bg-lime-500/10 border border-lime-500/20 rounded-full px-4 py-1.5 mb-4 text-sm font-semibold text-lime-500"
            >
              Featured Collection
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl font-bold text-white mb-4"
            >
              Best Selling <span className="text-lime-500">Products</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-gray-400 max-w-2xl mx-auto"
            >
              Discover our most popular supplements, trusted by athletes and fitness enthusiasts worldwide.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative group"
              >
                <motion.div
                  whileHover={{ y: -5 }}
                  className="relative bg-gradient-to-b from-black/50 to-black rounded-2xl border border-lime-500/20 overflow-hidden"
                >
                  {/* Product Image */}
                  <div className="relative h-[300px] overflow-hidden">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                    </motion.div>
                    
                    {/* Floating Badge */}
                    {product.badge && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="absolute top-4 left-4 bg-lime-500 text-black text-sm font-bold px-3 py-1 rounded-full"
                      >
                        {product.badge}
                      </motion.div>
                    )}
                    
                    {/* Quick Actions */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100"
                    >
                      <div className="flex gap-4">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setQuickViewProduct(product)}
                          className="bg-lime-500 text-black p-3 rounded-full"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </motion.button>
                       
                      </div>
                    </motion.div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-lime-500 text-sm font-medium">{product.category}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm">{product.size}</span>
                        {product.isNew && (
                          <span className="bg-lime-500/20 text-lime-500 text-xs px-2 py-0.5 rounded-full">NEW</span>
                        )}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white group-hover:text-lime-500 transition-colors">
                      {product.name}
                    </h3>
                    
                    <p className="text-gray-400 text-sm line-clamp-2">
                      {product.description}
                    </p>

                    {/* Key Features */}
                    <div className="grid grid-cols-2 gap-2">
                      {product.keyFeatures?.slice(0, 4).map((feature, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-center gap-2 text-sm text-gray-300"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-lime-500/50" />
                          {feature}
                        </motion.div>
                      ))}
                    </div>

                    {/* Price and Action */}
                    <div className="flex items-center justify-between pt-4 border-t border-lime-500/10">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-white">${product.price}</span>
                        {product.oldPrice && (
                          <span className="text-gray-500 line-through text-sm">${product.oldPrice}</span>
                        )}
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => addToCart(product)}
                        className="bg-lime-500 text-black px-4 py-2 rounded-lg font-semibold text-sm hover:bg-lime-400 transition-colors flex items-center gap-2"
                      >
                        Add to Cart
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </motion.button>
                    </div>
                  </div>

                  {/* Hover Glow Effect */}
                  <motion.div
                    className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    animate={{
                      background: [
                        'radial-gradient(circle at 50% 50%, rgba(132, 204, 22, 0.15) 0%, transparent 70%)',
                        'radial-gradient(circle at 60% 60%, rgba(132, 204, 22, 0.15) 0%, transparent 70%)',
                        'radial-gradient(circle at 40% 40%, rgba(132, 204, 22, 0.15) 0%, transparent 70%)',
                      ]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Quick View Modal */}
          <AnimatePresence>
            {quickViewProduct && (
              <QuickView
                product={quickViewProduct}
                onClose={() => setQuickViewProduct(null)}
                onAddToCart={addToCart}
                isFavorite={favorites.includes(quickViewProduct.id)}
                onToggleFavorite={toggleFavorite}
              />
            )}
          </AnimatePresence>

          {/* View All Products Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/shop">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-lime-500/10 hover:bg-lime-500/20 cursor-pointer text-lime-500 border border-lime-500/20 px-8 py-3 rounded-lg font-semibold inline-flex items-center gap-2 transition-colors"
              >
                View All Products
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Why Choose Us Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="relative py-24 overflow-hidden"
      >
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-2 h-2 bg-lime-500/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <motion.h2
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-16 text-white"
          >
            Why Choose <span className="text-lime-500">Us</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: QualityIcon,
                title: "Premium Quality",
                description: "Only the finest ingredients with proven effectiveness"
              },
              {
                icon: SpeedIcon,
                title: "Fast Results",
                description: "Scientifically formulated for maximum performance"
              },
              {
                icon: LabIcon,
                title: "Lab Tested",
                description: "Every batch tested for purity and potency"
              },
              {
                icon: ExpertIcon,
                title: "Expert Formulation",
                description: "Developed by sports nutrition specialists"
              },
              {
                icon: NaturalIcon,
                title: "Natural Ingredients",
                description: "Clean formulas without harmful additives"
              },
              {
                icon: ResultsIcon,
                title: "Proven Results",
                description: "Trusted by athletes and fitness enthusiasts"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-black/50 backdrop-blur border border-lime-500/20 rounded-xl p-8 hover:border-lime-500/40 transition-all group"
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-lime-500 mb-6 relative">
                  <item.icon />
                  <motion.div
                    className="absolute inset-0 bg-lime-500/10 rounded-full"
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1.2, opacity: 1 }}
                    transition={{ 
                      duration: 1,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-lime-500 transition-colors">{item.title}</h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Reviews Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="relative py-24 bg-gradient-to-b from-black to-black/90"
      >
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-16 text-white"
          >
            Customer <span className="text-lime-500">Reviews</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Husam Moussa",
                rating: 5,
                image: "/Images/Me.jpg",
                review: "Incredible results with the Pro Whey Isolate. Gained 5lbs of lean muscle in just 2 months!",
                product: "Pro Whey Isolate"
              },
              {
                name: "Mohammad Kassem",
                rating: 4,
                image: "/Images/27f83b7a-6198-40e2-8022-de9c84ccd7a0.jpg",
                review: "The Mass Gainer Elite helped me break through my plateau. Great taste and mixes well!",
                product: "Mass Gainer Elite"
              },
              {
                name: "Ali Maaz",
                rating: 5,
                image: "/Images/6dac24f9-1173-4836-8851-c184eeb7a06c.jpg",
                review: "Post-Workout Recovery is a game-changer. No more muscle soreness after intense workouts!",
                product: "Post-Workout Recovery"
              }
            ].map((review, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-black/50 backdrop-blur border border-lime-500/20 rounded-xl p-6 hover:transform hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <img 
                    src={review.image} 
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="text-white font-bold">{review.name}</h4>
                    <div className="flex text-lime-500">
                      {[...Array(review.rating)].map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-400 mb-4">{review.review}</p>
                <p className="text-lime-500 text-sm">Verified purchase: {review.product}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Nutrition Calculator Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="relative py-24 bg-black"
      >
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-16 text-white"
          >
            Nutrition <span className="text-lime-500">Calculator</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="bg-black/50 backdrop-blur border border-lime-500/20 rounded-xl p-8"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Calculate Your Needs</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-300 mb-2">Weight (kg)</label>
                  <input
                    type="number"
                    name="weight"
                    value={calculatorData.weight}
                    onChange={handleCalculatorInput}
                    className="w-full bg-black border border-lime-500/20 rounded px-4 py-2 text-white focus:outline-none focus:border-lime-500"
                    placeholder="Enter your weight"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Height (cm)</label>
                  <input
                    type="number"
                    name="height"
                    value={calculatorData.height}
                    onChange={handleCalculatorInput}
                    className="w-full bg-black border border-lime-500/20 rounded px-4 py-2 text-white focus:outline-none focus:border-lime-500"
                    placeholder="Enter your height"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={calculatorData.age}
                    onChange={handleCalculatorInput}
                    className="w-full bg-black border border-lime-500/20 rounded px-4 py-2 text-white focus:outline-none focus:border-lime-500"
                    placeholder="Enter your age"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Gender</label>
                  <select
                    name="gender"
                    value={calculatorData.gender}
                    onChange={handleCalculatorInput}
                    className="w-full bg-black border border-lime-500/20 rounded px-4 py-2 text-white focus:outline-none focus:border-lime-500"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Activity Level</label>
                  <select
                    name="activityLevel"
                    value={calculatorData.activityLevel}
                    onChange={handleCalculatorInput}
                    className="w-full bg-black border border-lime-500/20 rounded px-4 py-2 text-white focus:outline-none focus:border-lime-500"
                  >
                    <option value="sedentary">Sedentary</option>
                    <option value="light">Lightly Active</option>
                    <option value="moderate">Moderately Active</option>
                    <option value="very">Very Active</option>
                    <option value="extra">Extra Active</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Goal</label>
                  <select
                    name="goal"
                    value={calculatorData.goal}
                    onChange={handleCalculatorInput}
                    className="w-full bg-black border border-lime-500/20 rounded px-4 py-2 text-white focus:outline-none focus:border-lime-500"
                  >
                    <option value="maintenance">Maintenance</option>
                    <option value="muscle_gain">Muscle Gain</option>
                    <option value="weight_loss">Weight Loss</option>
                  </select>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={calculateNutrition}
                  className="w-full bg-lime-500 text-black font-bold py-3 rounded hover:bg-lime-600 transition-colors"
                >
                  Calculate
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="bg-black/50 backdrop-blur border border-lime-500/20 rounded-xl p-8"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Your Results</h3>
              {isCalculating ? (
                <LoadingAnimation />
              ) : nutritionResults ? (
                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="p-4 border border-lime-500/20 rounded-lg"
                  >
                    <h4 className="text-lime-500 font-bold mb-2">Daily Calories</h4>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="text-3xl text-white"
                    >
                      {nutritionResults.calories} kcal
                    </motion.p>
                  </motion.div>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: "Protein", value: nutritionResults.protein },
                      { label: "Carbs", value: nutritionResults.carbs },
                      { label: "Fats", value: nutritionResults.fats }
                    ].map((macro, idx) => (
                      <motion.div
                        key={macro.label}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 + (idx * 0.1) }}
                        className="p-4 border border-lime-500/20 rounded-lg"
                      >
                        <h4 className="text-lime-500 font-bold mb-2">{macro.label}</h4>
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5, delay: 0.4 + (idx * 0.1) }}
                          className="text-2xl text-white"
                        >
                          {macro.value}g
                        </motion.p>
                      </motion.div>
                    ))}
                  </div>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="p-4 bg-lime-500/10 rounded-lg"
                  >
                    <h4 className="text-lime-500 font-bold mb-2">Recommended Supplements</h4>
                    <ul className="text-gray-300 space-y-2">
                      {getSupplementRecommendations(calculatorData.goal, []).map((supp, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.7 + (idx * 0.1) }}
                        >
                          • {supp.name} - {supp.dosage} ({supp.timing})
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                </motion.div>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-400">
                  Enter your details to see your personalized nutrition plan
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Supplement Quiz Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="relative py-24"
      >
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Find Your Perfect <span className="text-lime-500">Supplement</span>
            </h2>
            <p className="text-gray-300 max-w-3xl mx-auto text-lg">
              Take our quick quiz to get personalized supplement recommendations based on your goals and preferences.
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="bg-black/50 backdrop-blur border border-lime-500/20 rounded-xl p-8 max-w-2xl mx-auto"
          >
            {!quizResults ? (
              <div className="space-y-8">
                {quizStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h3 className="text-white font-bold mb-4">What's your primary fitness goal?</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {['muscle_gain', 'weight_loss', 'performance', 'recovery'].map((goal) => (
                        <motion.button
                          key={goal}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            handleQuizInput('goal', goal);
                            setQuizStep(2);
                          }}
                          className={`p-4 border ${
                            quizData.goal === goal ? 'border-lime-500 bg-lime-500/20' : 'border-lime-500/20'
                          } rounded-lg text-gray-300 hover:bg-lime-500/10 transition-all duration-300`}
                        >
                          {goal.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {quizStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                  >
                    <h3 className="text-white font-bold mb-4">Your current fitness level?</h3>
                    <div className="space-y-6">
                      <div className="relative">
                        <motion.div
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-lime-500 rounded-full"
                          animate={{
                            x: `${quizData.fitnessLevel}%`,
                            scale: [1, 1.2, 1],
                          }}
                          transition={{
                            x: { duration: 0.5 },
                            scale: { duration: 0.5, repeat: Infinity }
                          }}
                        />
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={quizData.fitnessLevel}
                          onChange={(e) => handleQuizInput('fitnessLevel', e.target.value)}
                          className="w-full h-2 bg-lime-500/20 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                      <div className="flex justify-between text-gray-400 text-sm">
                        <span>Beginner</span>
                        <span>Intermediate</span>
                        <span>Advanced</span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setQuizStep(3)}
                        className="w-full bg-lime-500 text-black font-bold py-3 rounded hover:bg-lime-600 transition-colors"
                      >
                        Next
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {quizStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h3 className="text-white font-bold mb-4">Any dietary restrictions?</h3>
                    <div className="space-y-4">
                      {['vegetarian', 'vegan', 'lactose_intolerant', 'gluten_free'].map((restriction) => (
                        <motion.label
                          key={restriction}
                          className="flex items-center space-x-3 p-3 rounded-lg border border-lime-500/20 hover:bg-lime-500/5 transition-colors cursor-pointer"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <input
                            type="checkbox"
                            checked={quizData.restrictions.includes(restriction)}
                            onChange={() => handleRestrictionToggle(restriction)}
                            className="form-checkbox h-5 w-5 text-lime-500 rounded border-lime-500/20"
                          />
                          <span className="text-gray-300">
                            {restriction.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </span>
                        </motion.label>
                      ))}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setIsProcessing(true);
                          setTimeout(() => {
                            submitQuiz();
                            setIsProcessing(false);
                          }, 2000);
                        }}
                        className="w-full bg-lime-500 text-black font-bold py-3 rounded hover:bg-lime-600 transition-colors mt-6"
                      >
                        Get My Recommendations
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-2xl font-bold text-lime-500 mb-6">Your Personalized Recommendations</h3>
                {quizResults.map((supp, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-black/30 border border-lime-500/20 rounded-lg p-6 hover:border-lime-500/40 transition-all"
                  >
                    <h4 className="text-white font-bold mb-2">{supp.name}</h4>
                    <p className="text-gray-400 mb-2">Recommended Dosage: {supp.dosage}</p>
                    <p className="text-gray-400">Best Timing: {supp.timing}</p>
                  </motion.div>
                ))}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setQuizResults(null);
                    setQuizStep(1);
                    setQuizData({
                      goal: '',
                      fitnessLevel: 50,
                      restrictions: []
                    });
                  }}
                  className="w-full bg-lime-500 text-black font-bold py-3 rounded hover:bg-lime-600 transition-colors mt-6"
                >
                  Start Over
                </motion.button>
              </motion.div>
            )}

            {/* Processing Animation */}
            <AnimatePresence>
              {isProcessing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center"
                >
                  <div className="text-center">
                    <motion.div
                      className="w-24 h-24 mx-auto mb-8"
                      animate={{
                        rotate: 360,
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                        scale: { duration: 1, repeat: Infinity, repeatType: "reverse" }
                      }}
                    >
                      <svg viewBox="0 0 24 24" className="w-full h-full text-lime-500">
                        <motion.path
                          d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      </svg>
                    </motion.div>
                    <motion.h4
                      className="text-xl text-lime-500 font-bold mb-2"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      Finding Your Perfect Match
                    </motion.h4>
                    <motion.p
                      className="text-gray-400"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      Analyzing your preferences and goals...
                    </motion.p>
                    <motion.div
                      className="w-full h-1 bg-lime-500/20 rounded-full mt-6 overflow-hidden"
                    >
                      <motion.div
                        className="h-full bg-lime-500"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                      />
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.section>
    </div>
  )
}

export default Home
