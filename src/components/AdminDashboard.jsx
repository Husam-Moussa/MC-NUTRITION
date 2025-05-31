import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    stock: '',
    description: '',
    rating: '',
    tags: '',
    badge: '',
    image: null
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data);
    } catch (error) {
      setError('Failed to fetch products');
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/orders');
      setOrders(response.data);
    } catch (error) {
      setError('Failed to fetch orders');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'Product name is required';
    if (!formData.price || isNaN(formData.price) || formData.price <= 0) return 'Valid price is required';
    if (!formData.category.trim()) return 'Category is required';
    if (!formData.stock || isNaN(formData.stock) || formData.stock < 0) return 'Valid stock value is required';
    if (!formData.image && !editingProduct) return 'Product image is required';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    // Get auth token
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Not authenticated. Please log in.');
      setLoading(false);
      return;
    }

    try {
      // Create FormData object
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          submitData.append(key, formData[key]);
        }
      });

      // Make API request
      const url = editingProduct 
        ? `http://localhost:5000/api/products/${editingProduct.id}`
        : 'http://localhost:5000/api/products';
      
      const method = editingProduct ? 'put' : 'post';
      
      const response = await axios[method](url, submitData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      // Handle success
      setSuccess(editingProduct ? 'Product updated successfully' : 'Product added successfully');
      setFormData({
        name: '',
        price: '',
        category: '',
        stock: '',
        description: '',
        rating: '',
        tags: '',
        badge: '',
        image: null
      });
      setEditingProduct(null);
      fetchProducts();

    } catch (error) {
      console.error('Error saving product:', error);
      setError(error.response?.data?.error || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      stock: product.stock,
      description: product.description || '',
      rating: product.rating || '',
      tags: product.tags?.join(', ') || '',
      badge: product.badge || '',
      image: null
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setSuccess('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      setError('Failed to delete product');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-3xl font-bold mb-8 text-lime-500">Admin Dashboard</h1>
        
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500 text-white p-4 rounded-lg mb-4"
          >
            {error}
          </motion.div>
        )}
        
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-lime-500 text-black p-4 rounded-lg mb-4"
          >
            {success}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-bold mb-4 text-lime-500">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-gray-800 text-white p-2 rounded focus:ring-2 focus:ring-lime-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Price *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full bg-gray-800 text-white p-2 rounded focus:ring-2 focus:ring-lime-500"
                required
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Category *</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full bg-gray-800 text-white p-2 rounded focus:ring-2 focus:ring-lime-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Stock *</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                className="w-full bg-gray-800 text-white p-2 rounded focus:ring-2 focus:ring-lime-500"
                required
                min="0"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full bg-gray-800 text-white p-2 rounded focus:ring-2 focus:ring-lime-500"
                rows="3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Rating (0-5)</label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
                className="w-full bg-gray-800 text-white p-2 rounded focus:ring-2 focus:ring-lime-500"
                min="0"
                max="5"
                step="0.1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Tags (comma-separated)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full bg-gray-800 text-white p-2 rounded focus:ring-2 focus:ring-lime-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Badge</label>
              <input
                type="text"
                name="badge"
                value={formData.badge}
                onChange={handleInputChange}
                className="w-full bg-gray-800 text-white p-2 rounded focus:ring-2 focus:ring-lime-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Image {!editingProduct && '*'}
              </label>
              <input
                type="file"
                name="image"
                onChange={handleInputChange}
                className="w-full bg-gray-800 text-white p-2 rounded focus:ring-2 focus:ring-lime-500"
                accept="image/*"
                required={!editingProduct}
              />
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 bg-lime-500 text-black px-4 py-2 rounded font-medium
                ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-lime-600'}`}
            >
              {loading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
            </button>

            {editingProduct && (
              <button
                type="button"
                onClick={() => {
                  setEditingProduct(null);
                  setFormData({
                    name: '',
                    price: '',
                    category: '',
                    stock: '',
                    description: '',
                    rating: '',
                    tags: '',
                    badge: '',
                    image: null
                  });
                }}
                className="bg-gray-700 text-white px-4 py-2 rounded font-medium hover:bg-gray-600"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Products Table */}
        <div className="bg-gray-900 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-bold mb-4 text-lime-500">Products</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-700">
                  <th className="pb-2">Name</th>
                  <th className="pb-2">Price</th>
                  <th className="pb-2">Category</th>
                  <th className="pb-2">Stock</th>
                  <th className="pb-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-gray-700">
                    <td className="py-2">{product.name}</td>
                    <td className="py-2">${product.price}</td>
                    <td className="py-2">{product.category}</td>
                    <td className="py-2">{product.stock}</td>
                    <td className="py-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="bg-lime-500 text-black px-2 py-1 rounded mr-2 hover:bg-lime-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-gray-900 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4 text-lime-500">Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-700">
                  <th className="pb-2">Order ID</th>
                  <th className="pb-2">Customer</th>
                  <th className="pb-2">Total</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-700">
                    <td className="py-2">{order.id}</td>
                    <td className="py-2">{order.customer}</td>
                    <td className="py-2">${order.total}</td>
                    <td className="py-2">{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard; 