import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { useNavigate } from 'react-router-dom';

const CheckoutForm = ({ cartItems, total, onClose, onOrderComplete }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate form data
      if (!formData.fullName.trim() || !formData.phoneNumber.trim() || 
          !formData.address.trim()) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      // Validate cart items
      if (!cartItems || cartItems.length === 0) {
        setError('Your cart is empty');
        setLoading(false);
        return;
      }

      // Create order document
      const shippingDetails = {
        fullName: formData.fullName.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        address: formData.address.trim()
      };

      const orderData = {
        userId: auth.currentUser?.uid || 'guest',
        userEmail: auth.currentUser?.email || 'guest',
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        total: total || 0,
        status: 'pending',
        shippingDetails,
        createdAt: new Date()
      };

      // Add order to Firestore
      await addDoc(collection(db, 'orders'), orderData);
      
      // Show success message
      setOrderSubmitted(true);
      
      // Close modal after 3 seconds and redirect to home
      setTimeout(() => {
        onOrderComplete();
        navigate('/');
      }, 3000);

    } catch (error) {
      console.error('Error submitting order:', error);
      setError('Failed to submit order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (orderSubmitted) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-black/50 backdrop-blur border border-lime-500/20 rounded-xl p-8 max-w-md w-full"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-lime-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-lime-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Order Submitted!</h2>
            <p className="text-gray-400">Thank you for your order. We'll process it shortly.</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-black/50 backdrop-blur border border-lime-500/20 rounded-xl p-8 max-w-md w-full"
      >
        <h2 className="text-2xl font-bold text-white mb-6">Complete Your Order</h2>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-500">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full bg-black/50 border border-lime-500/20 rounded-lg px-4 py-3 text-white"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full bg-black/50 border border-lime-500/20 rounded-lg px-4 py-3 text-white"
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full bg-black/50 border border-lime-500/20 rounded-lg px-4 py-3 text-white"
              placeholder="Enter your street address"
              required
            />
          </div>

          <div className="flex gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 bg-lime-500 text-black py-3 rounded-lg font-semibold hover:bg-lime-600 transition-colors ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Submitting...' : 'Place Order'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CheckoutForm; 