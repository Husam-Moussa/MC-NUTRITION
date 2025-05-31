import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Attempting login with email:', formData.email);
      const userCredential = await login(formData.email, formData.password);
      console.log('Login successful:', userCredential.user.email);
      
      // Check if user is admin
      if (userCredential.user.email === 'admin@mcnutrition.com') {
        console.log('Admin user detected, redirecting to admin panel');
        // Force a small delay to ensure auth state is updated
        setTimeout(() => {
          navigate('/admin', { replace: true });
        }, 500); // Increased delay to ensure auth state is updated
      } else {
        console.log('Regular user detected, redirecting to home');
        navigate('/', { replace: true });
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h1 className="text-3xl font-bold mb-6 text-lime-500">Login</h1>
        {error && <div className="bg-red-500 text-white p-4 rounded-lg mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-gray-800 text-white p-2 rounded"
              required
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-gray-800 text-white p-2 rounded"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-lime-500 text-black px-4 py-2 rounded hover:bg-lime-600 transition-colors ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="mt-4 text-center text-white">
          Don't have an account? <Link to="/signup" className="text-lime-500 hover:underline">Signup</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login; 