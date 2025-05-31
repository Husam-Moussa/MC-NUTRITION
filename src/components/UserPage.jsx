import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { auth } from '../firebase/config';
import { updatePassword, updateEmail, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

const UserPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    newPassword: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      navigate('/login');
      return;
    }

    setFormData({
      displayName: user.displayName || '',
      email: user.email || '',
      newPassword: '',
      confirmPassword: ''
    });

    // Fetch user's orders
    const fetchOrders = async () => {
      try {
        const ordersQuery = query(
          collection(db, 'orders'),
          where('userId', '==', user.uid)
        );
        const querySnapshot = await getDocs(ordersQuery);
        const ordersList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setOrders(ordersList);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const user = auth.currentUser;
      
      // Update display name
      if (formData.displayName !== user.displayName) {
        await updateProfile(user, {
          displayName: formData.displayName
        });
      }

      // Update email
      if (formData.email !== user.email) {
        await updateEmail(user, formData.email);
      }

      // Update password if provided
      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        await updatePassword(user, formData.newPassword);
      }

      setSuccess('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleResetPassword = async () => {
    try {
      setError('');
      setSuccess('');
      setIsResettingPassword(true);
      
      await sendPasswordResetEmail(auth, auth.currentUser.email);
      setResetEmailSent(true);
      setSuccess('Password reset email sent. Please check your inbox.');
    } catch (error) {
      console.error('Error sending password reset email:', error);
      setError(error.message);
    } finally {
      setIsResettingPassword(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'orders', label: 'Orders' },
    { id: 'settings', label: 'Settings' }
  ];

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/50 backdrop-blur border border-lime-500/20 rounded-xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 sm:p-8 border-b border-lime-500/10">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-lime-500/20 rounded-full flex items-center justify-center">
                <span className="text-3xl sm:text-4xl font-bold text-lime-500">
                  {auth.currentUser?.displayName?.[0] || auth.currentUser?.email?.[0] || 'U'}
                </span>
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  {auth.currentUser?.displayName || 'User'}
                </h1>
                <p className="text-gray-400 mt-1">{auth.currentUser?.email}</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap border-b border-lime-500/10">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-lime-500 border-b-2 border-lime-500'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-4 sm:p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-500">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-lime-500/20 border border-lime-500 rounded-lg text-lime-500">
                {success}
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-6">
                {isEditing ? (
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Display Name</label>
                      <input
                        type="text"
                        name="displayName"
                        value={formData.displayName}
                        onChange={handleChange}
                        className="w-full bg-black/50 border border-lime-500/20 rounded-lg px-4 py-3 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-black/50 border border-lime-500/20 rounded-lg px-4 py-3 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">New Password</label>
                      <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="w-full bg-black/50 border border-lime-500/20 rounded-lg px-4 py-3 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Confirm Password</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full bg-black/50 border border-lime-500/20 rounded-lg px-4 py-3 text-white"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        type="submit"
                        className="flex-1 bg-lime-500 text-black py-3 rounded-lg font-semibold hover:bg-lime-600 transition-colors"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="flex-1 bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">Display Name</h3>
                        <p className="text-lg text-white">{auth.currentUser?.displayName || 'Not set'}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">Email</h3>
                        <p className="text-lg text-white">{auth.currentUser?.email}</p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex-1 bg-lime-500 text-black py-3 rounded-lg font-semibold hover:bg-lime-600 transition-colors"
                      >
                        Edit Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex-1 bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-6">
                {loading ? (
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-500"></div>
                  </div>
                ) : orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map(order => (
                      <div
                        key={order.id}
                        className="bg-black/50 border border-lime-500/20 rounded-lg p-4 sm:p-6"
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-white">Order #{order.id}</h3>
                            <p className="text-gray-400">
                              {new Date(order.createdAt?.toDate()).toLocaleDateString()}
                            </p>
                          </div>
                          <span className="px-3 py-1 bg-lime-500/20 text-lime-500 rounded-full text-sm font-medium">
                            {order.status}
                          </span>
                        </div>
                        <div className="space-y-2">
                          {order.items?.map(item => (
                            <div key={item.id} className="flex justify-between text-gray-400">
                              <span>{item.name} x {item.quantity}</span>
                              <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-lime-500/10 flex justify-between items-center">
                          <span className="text-gray-400">Total</span>
                          <span className="text-xl font-bold text-lime-500">
                            ${order.total?.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    No orders found
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                {/* Password Reset Section */}
                <div className="bg-black/50 border border-lime-500/20 rounded-lg p-4 sm:p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Password Reset</h3>
                  <div className="space-y-4">
                    <p className="text-gray-400">
                      Need to reset your password? We'll send you an email with instructions.
                    </p>
                    <button
                      onClick={handleResetPassword}
                      disabled={isResettingPassword || resetEmailSent}
                      className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                        resetEmailSent
                          ? 'bg-green-500 text-white cursor-not-allowed'
                          : isResettingPassword
                          ? 'bg-gray-500 text-white cursor-not-allowed'
                          : 'bg-lime-500 text-black hover:bg-lime-600'
                      }`}
                    >
                      {isResettingPassword
                        ? 'Sending Reset Email...'
                        : resetEmailSent
                        ? 'Reset Email Sent'
                        : 'Send Password Reset Email'}
                    </button>
                  </div>
                </div>

                {/* Account Settings */}
                <div className="bg-black/50 border border-lime-500/20 rounded-lg p-4 sm:p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Account Settings</h3>
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-white font-medium">Email Notifications</h4>
                        <p className="text-gray-400 text-sm">Receive updates about your orders</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-lime-500"></div>
                      </label>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-white font-medium">Two-Factor Authentication</h4>
                        <p className="text-gray-400 text-sm">Add an extra layer of security</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-lime-500"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-black/50 border border-lime-500/20 rounded-lg p-4 sm:p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Danger Zone</h3>
                  <button
                    onClick={handleLogout}
                    className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserPage; 