import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import CheckoutForm from './CheckoutForm';

const Cart = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, updateCartQuantity, clearCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  // Add scroll lock effect
  useEffect(() => {
    if (isOpen) {
      // Get the current scroll position
      const scrollY = window.scrollY;
      
      // Add styles to prevent scrolling and maintain position
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      // Restore scrolling and position when cart closes
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }

    // Cleanup function
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    setShowCheckout(true);
  };

  const handleCheckoutComplete = () => {
    clearCart();
    setShowCheckout(false);
    onClose();
  };

  if (showCheckout) {
    return (
      <CheckoutForm
        cartItems={cartItems}
        total={total}
        onClose={handleCheckoutComplete}
      />
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[95%] md:w-[450px] bg-black/95 backdrop-blur border-l border-lime-500/20 overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex-shrink-0 p-4 sm:p-6 border-b border-lime-500/10">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Your Cart</h2>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition-colors p-1.5 sm:p-2 hover:bg-white/5 rounded-lg"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="text-sm sm:text-base text-gray-400">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
                </p>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto">
                {cartItems.length > 0 ? (
                  <div className="space-y-3 sm:space-y-4 p-3 sm:p-4">
                    {cartItems.map(item => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-black/50 border border-lime-500/20 rounded-xl p-3 sm:p-4 hover:border-lime-500/40 transition-colors group"
                      >
                        <div className="flex gap-3 sm:gap-4">
                          {/* Product Image */}
                          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-black/50 flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start gap-2">
                              <div>
                                <h3 className="text-sm sm:text-base text-white font-medium truncate">{item.name}</h3>
                                {item.category && (
                                  <p className="text-xs sm:text-sm text-gray-400">{item.category}</p>
                                )}
                              </div>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-gray-400 hover:text-red-500 transition-colors p-1 hover:bg-red-500/10 rounded-lg flex-shrink-0"
                              >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>

                            {/* Price and Quantity Controls */}
                            <div className="mt-2 flex items-center justify-between">
                              <div className="flex items-center gap-2 sm:gap-3">
                                <button
                                  onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                  className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-lime-500/10 text-lime-500 rounded-lg hover:bg-lime-500/20 transition-colors"
                                >
                                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                  </svg>
                                </button>
                                <span className="w-6 sm:w-8 text-center text-sm sm:text-base text-white font-medium">{item.quantity}</span>
                                <button
                                  onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                  className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-lime-500/10 text-lime-500 rounded-lg hover:bg-lime-500/20 transition-colors"
                                >
                                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                  </svg>
                                </button>
                              </div>
                              <div className="text-right">
                                <p className="text-sm sm:text-base text-lime-500 font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                                {item.quantity > 1 && (
                                  <p className="text-xs sm:text-sm text-gray-400">${item.price.toFixed(2)} each</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 p-6 sm:p-8">
                    <svg className="w-12 h-12 sm:w-16 sm:h-16 mb-3 sm:mb-4 text-lime-500/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <p className="text-base sm:text-lg font-medium mb-1 sm:mb-2">Your cart is empty</p>
                    <p className="text-sm sm:text-base text-center">Add some products to your cart and they will appear here</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              {cartItems.length > 0 && (
                <div className="flex-shrink-0 p-4 sm:p-6 border-t border-lime-500/10 bg-black/50">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm sm:text-base text-gray-400">Subtotal</span>
                      <span className="text-sm sm:text-base text-white font-medium">${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm sm:text-base text-gray-400">Total</span>
                      <span className="text-xl sm:text-2xl font-bold text-lime-500">${total.toFixed(2)}</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCheckout}
                      className="w-full bg-lime-500 text-black py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-lime-400 transition-colors flex items-center justify-center gap-2 group"
                    >
                      Proceed to Checkout
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </motion.button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Cart; 