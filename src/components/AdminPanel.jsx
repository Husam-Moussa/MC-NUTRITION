import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage, auth } from '../firebase/config';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    image: null,
    category: '',
    rating: '',
    stock: '',
    description: '',
    tags: '',
    nutrition: {
      protein: '',
      calories: '',
      carbs: '',
      servings: ''
    },
    badge: '',
    benefits: ['', '', '', ''],
    trainingTypes: ['', ''],
    flavors: ['', ''],
    sizes: ['', ''],
    achievement: ''
  });
  const [selectedStatus, setSelectedStatus] = useState({});
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [deletingOrder, setDeletingOrder] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: ''
  });
  const [success, setSuccess] = useState('');
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Check admin status on component mount
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigate('/login');
          return;
        }

        // Get the user's ID token to check admin claim
        const idTokenResult = await user.getIdTokenResult();
        if (!idTokenResult.claims.admin) {
          setError('Access denied. Admin privileges required.');
          navigate('/');
          return;
        }

        // If admin, fetch data
        fetchProducts();
        fetchOrders();
      } catch (error) {
        console.error('Error checking admin status:', error);
        setError('Failed to verify admin privileges');
        navigate('/login');
      }
    };

    checkAdminStatus();
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productsList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products');
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(ordersQuery);
      const ordersList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersList);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  // Add real-time updates for orders
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(ordersQuery, 
      (snapshot) => {
        const ordersList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setOrders(ordersList);
      },
      (error) => {
        console.error('Error in orders snapshot:', error);
        setError('Failed to update orders in real-time');
      }
    );

    return () => unsubscribe();
  }, []);

  const uploadImage = async (file) => {
    if (!file) return null;
    
    try {
      // Convert image to base64
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    } catch (error) {
      console.error('Error converting image:', error);
      throw new Error('Failed to process image. Please try again.');
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      let imageUrl = '';
      if (newProduct.image) {
        try {
          imageUrl = await uploadImage(newProduct.image);
        } catch (uploadError) {
          console.error('Error processing image:', uploadError);
          setError('Failed to process image. Please try again.');
          setLoading(false);
          return;
        }
      }

      const productData = {
        ...newProduct,
        image: imageUrl,
        price: parseFloat(newProduct.price),
        rating: parseFloat(newProduct.rating),
        stock: parseInt(newProduct.stock),
        tags: newProduct.tags.split(',').map(tag => tag.trim()),
        nutrition: {
          protein: newProduct.nutrition.protein,
          calories: newProduct.nutrition.calories,
          carbs: newProduct.nutrition.carbs,
          servings: newProduct.nutrition.servings
        }
      };

      // Remove the image file object before saving to Firestore
      delete productData.imageFile;

      const docRef = await addDoc(collection(db, 'products'), productData);
      console.log('Product added with ID:', docRef.id);

      // Reset form
      setNewProduct({
        name: '',
        price: '',
        image: null,
        category: '',
        rating: '',
        stock: '',
        description: '',
        tags: '',
        nutrition: {
          protein: '',
          calories: '',
          carbs: '',
          servings: ''
        },
        badge: '',
        benefits: ['', '', '', ''],
        trainingTypes: ['', ''],
        flavors: ['', ''],
        sizes: ['', ''],
        achievement: ''
      });

      // Refresh the products list
      await fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
      setError(error.message || 'Failed to add product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteDoc(doc(db, 'products', id));
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        setError('Failed to delete product');
      }
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = editingProduct.image;
      
      // If a new image was selected, convert it to base64
      if (editingProduct.newImage) {
        imageUrl = await uploadImage(editingProduct.newImage);
      }

      const productData = {
        ...editingProduct,
        image: imageUrl,
        price: parseFloat(editingProduct.price),
        rating: parseFloat(editingProduct.rating),
        stock: parseInt(editingProduct.stock),
        tags: Array.isArray(editingProduct.tags)
          ? editingProduct.tags
          : editingProduct.tags.split(',').map(tag => tag.trim()),
        nutrition: {
          protein: editingProduct.nutrition.protein,
          calories: editingProduct.nutrition.calories,
          carbs: editingProduct.nutrition.carbs,
          servings: editingProduct.nutrition.servings
        }
      };

      // Remove the newImage field before saving to Firestore
      delete productData.newImage;

      await updateDoc(doc(db, 'products', editingProduct.id), productData);
      setEditingProduct(null);
      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      setError('Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e, isEditing = false) => {
    const file = e.target.files[0];
    if (file) {
      if (isEditing) {
        setEditingProduct(prev => ({
          ...prev,
          newImage: file
        }));
      } else {
        setNewProduct(prev => ({
          ...prev,
          image: file
        }));
      }
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    setSelectedStatus(prev => ({
      ...prev,
      [orderId]: newStatus
    }));
  };

  const handleUpdateOrderStatus = async (orderId) => {
    if (!selectedStatus[orderId]) return;
    
    setUpdatingStatus(true);
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: selectedStatus[orderId],
        updatedAt: new Date()
      });
      // Clear the selected status after successful update
      setSelectedStatus(prev => {
        const newState = { ...prev };
        delete newState[orderId];
        return newState;
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      setError('Failed to update order status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      return;
    }

    setDeletingOrder(true);
    try {
      await deleteDoc(doc(db, 'orders', orderId));
    } catch (error) {
      console.error('Error deleting order:', error);
      setError('Failed to delete order');
    } finally {
      setDeletingOrder(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      let imageUrl = formData.image;
      if (newProduct.image) {
        try {
          imageUrl = await uploadImage(newProduct.image);
        } catch (uploadError) {
          console.error('Error processing image:', uploadError);
          setError('Failed to process image. Please try again.');
          setLoading(false);
          return;
        }
      }

      const productData = {
        ...newProduct,
        image: imageUrl,
        price: parseFloat(newProduct.price),
        rating: parseFloat(newProduct.rating),
        stock: parseInt(newProduct.stock),
        tags: newProduct.tags.split(',').map(tag => tag.trim()),
        nutrition: {
          protein: newProduct.nutrition.protein,
          calories: newProduct.nutrition.calories,
          carbs: newProduct.nutrition.carbs,
          servings: newProduct.nutrition.servings
        }
      };

      // Remove the image file object before saving to Firestore
      delete productData.imageFile;

      const docRef = await addDoc(collection(db, 'products'), productData);
      console.log('Product added with ID:', docRef.id);

      // Reset form
      setNewProduct({
        name: '',
        price: '',
        image: null,
        category: '',
        rating: '',
        stock: '',
        description: '',
        tags: '',
        nutrition: {
          protein: '',
          calories: '',
          carbs: '',
          servings: ''
        },
        badge: '',
        benefits: ['', '', '', ''],
        trainingTypes: ['', ''],
        flavors: ['', ''],
        sizes: ['', ''],
        achievement: ''
      });

      // Refresh the products list
      await fetchProducts();
      setSuccess('Product added successfully!');
    } catch (error) {
      console.error('Error adding product:', error);
      setError(error.message || 'Failed to add product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
      setError('Failed to log out. Please try again.');
    }
  };

  const tabs = [
    { id: 'products', label: 'Products' },
    { id: 'orders', label: 'Orders' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/50 backdrop-blur border border-lime-500/20 rounded-xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 sm:p-8 border-b border-lime-500/10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Admin Panel</h1>
                <p className="text-gray-400 mt-1">Manage products and orders</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <button
                  onClick={() => setShowAddProduct(true)}
                  className="w-full sm:w-auto bg-lime-500 text-black py-2 px-4 rounded-lg font-semibold hover:bg-lime-600 transition-colors"
                >
                  Add Product
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full sm:w-auto bg-red-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                >
                  Logout
                </button>
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

            {activeTab === 'products' && (
              <div className="space-y-6">
                {loading ? (
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-500"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map(product => (
                      <div
                        key={product.id}
                        className="bg-black/50 border border-lime-500/20 rounded-lg p-4 sm:p-6"
                      >
                        <div className="aspect-square mb-4 bg-lime-500/20 rounded-lg overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">{product.name}</h3>
                        <p className="text-gray-400 mb-4 line-clamp-2">{product.description}</p>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <span className="text-xl font-bold text-lime-500">
                            ${product.price.toFixed(2)}
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingProduct(product);
                                setIsModalOpen(true);
                              }}
                              className="bg-lime-500 text-black py-2 px-4 rounded-lg font-semibold hover:bg-lime-600 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="bg-red-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
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
                        {/* Order Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-white">Order #{order.id}</h3>
                            <p className="text-gray-400">
                              {order.createdAt instanceof Object && typeof order.createdAt.toDate === 'function' 
                                ? order.createdAt.toDate().toLocaleDateString()
                                : new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <select
                              value={selectedStatus[order.id] || order.status}
                              onChange={(e) => handleStatusChange(order.id, e.target.value)}
                              className="bg-black/50 border border-lime-500/20 rounded-lg px-4 py-2 text-white"
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                            {selectedStatus[order.id] && (
                              <button
                                onClick={() => handleUpdateOrderStatus(order.id)}
                                disabled={updatingStatus}
                                className="bg-lime-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-lime-600 transition-colors disabled:opacity-50"
                              >
                                Update
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteOrder(order.id)}
                              disabled={deletingOrder}
                              className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        {/* Customer Information */}
                        <div className="mb-6 p-4 bg-black/30 rounded-lg">
                          <h4 className="text-lime-500 font-semibold mb-3">Customer Information</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <p className="text-gray-400">Name</p>
                              <p className="text-white">{order.shippingDetails?.fullName || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Email</p>
                              <p className="text-white">{order.userEmail || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Phone</p>
                              <p className="text-white">{order.shippingDetails?.phoneNumber || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Address</p>
                              <p className="text-white">{order.shippingDetails?.address || 'N/A'}</p>
                            </div>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-4">
                          {order.items?.map(item => (
                            <div key={item.id} className="flex items-center gap-4 p-3 bg-black/20 rounded-lg">
                              <div className="w-16 h-16 flex-shrink-0">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover rounded-lg"
                                  onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                                  }}
                                />
                              </div>
                              <div className="flex-grow">
                                <h5 className="text-white font-medium">{item.name}</h5>
                                <div className="flex flex-wrap gap-2 text-sm text-gray-400">
                                  {item.flavor && (
                                    <span className="bg-lime-500/10 px-2 py-1 rounded">
                                      Flavor: {item.flavor}
                                    </span>
                                  )}
                                  {item.size && (
                                    <span className="bg-lime-500/10 px-2 py-1 rounded">
                                      Size: {item.size}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-white font-medium">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </p>
                                <p className="text-sm text-gray-400">
                                  ${item.price.toFixed(2)} x {item.quantity}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Order Summary */}
                        <div className="mt-4 pt-4 border-t border-lime-500/10">
                          <div className="flex flex-col gap-2">
                            <div className="flex justify-between text-gray-400">
                              <span>Subtotal</span>
                              <span>${order.subtotal?.toFixed(2) || '0.00'}</span>
                            </div>
                            {order.shipping && (
                              <div className="flex justify-between text-gray-400">
                                <span>Shipping</span>
                                <span>${order.shipping.toFixed(2)}</span>
                              </div>
                            )}
                            {order.tax && (
                              <div className="flex justify-between text-gray-400">
                                <span>Tax</span>
                                <span>${order.tax.toFixed(2)}</span>
                              </div>
                            )}
                            <div className="flex justify-between text-lg font-bold text-lime-500 pt-2">
                              <span>Total</span>
                              <span>${order.total?.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Additional Notes */}
                        {order.customerInfo?.notes && (
                          <div className="mt-4 pt-4 border-t border-lime-500/10">
                            <h4 className="text-lime-500 font-semibold mb-2">Customer Notes</h4>
                            <p className="text-gray-400">{order.customerInfo.notes}</p>
                          </div>
                        )}
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
          </div>
        </motion.div>
      </div>

      {/* Add/Edit Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black border border-lime-500/20 rounded-xl w-full max-w-2xl my-20 relative"
          >
            {/* Fixed Header */}
            <div className="bg-black border-b border-lime-500/20 p-4 sm:p-6 rounded-t-xl">
              <h2 className="text-2xl font-bold text-white">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
            </div>

            {/* Scrollable Content */}
            <div className="p-4 sm:p-6 overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-400">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      className="w-full bg-black/50 border border-lime-500/20 rounded-lg px-3 py-2 text-white text-sm"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-400">Price</label>
                    <input
                      type="number"
                      name="price"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      className="w-full bg-black/50 border border-lime-500/20 rounded-lg px-3 py-2 text-white text-sm"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                {/* Category and Rating */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-400">Category</label>
                    <input
                      type="text"
                      name="category"
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      className="w-full bg-black/50 border border-lime-500/20 rounded-lg px-3 py-2 text-white text-sm"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-400">Rating</label>
                    <input
                      type="number"
                      name="rating"
                      value={newProduct.rating}
                      onChange={(e) => setNewProduct({ ...newProduct, rating: e.target.value })}
                      className="w-full bg-black/50 border border-lime-500/20 rounded-lg px-3 py-2 text-white text-sm"
                      step="0.1"
                      min="0"
                      max="5"
                      required
                    />
                  </div>
                </div>

                {/* Stock and Badge */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-400">Stock</label>
                    <input
                      type="number"
                      name="stock"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                      className="w-full bg-black/50 border border-lime-500/20 rounded-lg px-3 py-2 text-white text-sm"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-400">Badge</label>
                    <input
                      type="text"
                      name="badge"
                      value={newProduct.badge}
                      onChange={(e) => setNewProduct({ ...newProduct, badge: e.target.value })}
                      className="w-full bg-black/50 border border-lime-500/20 rounded-lg px-3 py-2 text-white text-sm"
                      placeholder="e.g., New, Sale, Best Seller"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-400">Description</label>
                  <textarea
                    name="description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="w-full bg-black/50 border border-lime-500/20 rounded-lg px-3 py-2 text-white text-sm"
                    rows="3"
                    required
                  />
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-400">Tags (comma-separated)</label>
                  <input
                    type="text"
                    name="tags"
                    value={newProduct.tags}
                    onChange={(e) => setNewProduct({ ...newProduct, tags: e.target.value })}
                    className="w-full bg-black/50 border border-lime-500/20 rounded-lg px-3 py-2 text-white text-sm"
                    placeholder="e.g., protein, vegan, gluten-free"
                  />
                </div>

                {/* Benefits */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-400">Benefits</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {newProduct.benefits.map((benefit, index) => (
                      <input
                        key={index}
                        type="text"
                        value={benefit}
                        onChange={(e) => {
                          const newBenefits = [...newProduct.benefits];
                          newBenefits[index] = e.target.value;
                          setNewProduct({ ...newProduct, benefits: newBenefits });
                        }}
                        className="w-full bg-black/50 border border-lime-500/20 rounded-lg px-3 py-2 text-white text-sm"
                        placeholder={`Benefit ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Training Types */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-400">Training Types</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {newProduct.trainingTypes.map((type, index) => (
                      <input
                        key={index}
                        type="text"
                        value={type}
                        onChange={(e) => {
                          const newTypes = [...newProduct.trainingTypes];
                          newTypes[index] = e.target.value;
                          setNewProduct({ ...newProduct, trainingTypes: newTypes });
                        }}
                        className="w-full bg-black/50 border border-lime-500/20 rounded-lg px-3 py-2 text-white text-sm"
                        placeholder={`Training Type ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Flavors and Sizes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-400">Flavors</label>
                    {newProduct.flavors.map((flavor, index) => (
                      <input
                        key={index}
                        type="text"
                        value={flavor}
                        onChange={(e) => {
                          const newFlavors = [...newProduct.flavors];
                          newFlavors[index] = e.target.value;
                          setNewProduct({ ...newProduct, flavors: newFlavors });
                        }}
                        className="w-full bg-black/50 border border-lime-500/20 rounded-lg px-3 py-2 text-white text-sm mb-2"
                        placeholder={`Flavor ${index + 1}`}
                      />
                    ))}
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-400">Sizes</label>
                    {newProduct.sizes.map((size, index) => (
                      <input
                        key={index}
                        type="text"
                        value={size}
                        onChange={(e) => {
                          const newSizes = [...newProduct.sizes];
                          newSizes[index] = e.target.value;
                          setNewProduct({ ...newProduct, sizes: newSizes });
                        }}
                        className="w-full bg-black/50 border border-lime-500/20 rounded-lg px-3 py-2 text-white text-sm mb-2"
                        placeholder={`Size ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Achievement */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-400">Achievement Badge</label>
                  <input
                    type="text"
                    name="achievement"
                    value={newProduct.achievement}
                    onChange={(e) => setNewProduct({ ...newProduct, achievement: e.target.value })}
                    className="w-full bg-black/50 border border-lime-500/20 rounded-lg px-3 py-2 text-white text-sm"
                    placeholder="e.g., Best Seller, Top Rated"
                  />
                </div>

                {/* Nutrition Information */}
                <div className="space-y-4">
                  <h3 className="text-lime-500 font-medium text-sm">Nutrition Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-400">Protein</label>
                      <input
                        type="text"
                        value={newProduct.nutrition.protein}
                        onChange={(e) => setNewProduct({
                          ...newProduct,
                          nutrition: { ...newProduct.nutrition, protein: e.target.value }
                        })}
                        className="w-full bg-black/50 border border-lime-500/20 rounded-lg px-3 py-2 text-white text-sm"
                        placeholder="e.g., 25g per serving"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-400">Calories</label>
                      <input
                        type="text"
                        value={newProduct.nutrition.calories}
                        onChange={(e) => setNewProduct({
                          ...newProduct,
                          nutrition: { ...newProduct.nutrition, calories: e.target.value }
                        })}
                        className="w-full bg-black/50 border border-lime-500/20 rounded-lg px-3 py-2 text-white text-sm"
                        placeholder="e.g., 120 calories"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-400">Carbs</label>
                      <input
                        type="text"
                        value={newProduct.nutrition.carbs}
                        onChange={(e) => setNewProduct({
                          ...newProduct,
                          nutrition: { ...newProduct.nutrition, carbs: e.target.value }
                        })}
                        className="w-full bg-black/50 border border-lime-500/20 rounded-lg px-3 py-2 text-white text-sm"
                        placeholder="e.g., 5g per serving"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-400">Servings</label>
                      <input
                        type="text"
                        value={newProduct.nutrition.servings}
                        onChange={(e) => setNewProduct({
                          ...newProduct,
                          nutrition: { ...newProduct.nutrition, servings: e.target.value }
                        })}
                        className="w-full bg-black/50 border border-lime-500/20 rounded-lg px-3 py-2 text-white text-sm"
                        placeholder="e.g., 30 servings per container"
                      />
                    </div>
                  </div>
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-400">Product Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e)}
                    className="w-full bg-black/50 border border-lime-500/20 rounded-lg px-3 py-2 text-white text-sm"
                  />
                </div>

                {/* Submit Buttons - Fixed at bottom */}
                <div className="bg-black border-t border-lime-500/20 p-4 sm:p-6 rounded-b-xl">
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-lime-500 text-black py-2 rounded-lg font-semibold hover:bg-lime-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      {loading ? 'Saving...' : 'Save Product'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddProduct(false);
                        setNewProduct({
                          name: '',
                          price: '',
                          image: null,
                          category: '',
                          rating: '',
                          stock: '',
                          description: '',
                          tags: '',
                          nutrition: {
                            protein: '',
                            calories: '',
                            carbs: '',
                            servings: ''
                          },
                          badge: '',
                          benefits: ['', '', '', ''],
                          trainingTypes: ['', ''],
                          flavors: ['', ''],
                          sizes: ['', ''],
                          achievement: ''
                        });
                      }}
                      className="flex-1 bg-gray-500 text-white py-2 rounded-lg font-semibold hover:bg-gray-600 transition-colors text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Modal */}
      <AnimatePresence>
        {isModalOpen && editingProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-black/90 border border-lime-500/20 rounded-xl max-w-2xl w-full p-6"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-6 text-lime-500">Edit Product</h2>
              <form onSubmit={handleEditProduct} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                      type="text"
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      className="w-full bg-black/50 border border-lime-500/20 rounded-lg px-4 py-2 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Price</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                      className="w-full bg-black/50 border border-lime-500/20 rounded-lg px-4 py-2 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, true)}
                      className="w-full bg-black/50 border border-lime-500/20 rounded-lg px-4 py-2 text-white"
                    />
                    {(editingProduct.image || editingProduct.newImage) && (
                      <div className="mt-2">
                        <img
                          src={editingProduct.newImage ? URL.createObjectURL(editingProduct.newImage) : editingProduct.image}
                          alt="Preview"
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <input
                      type="text"
                      value={editingProduct.category}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                      className="w-full bg-black/50 border border-lime-500/20 rounded-lg px-4 py-2 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Rating</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={editingProduct.rating}
                      onChange={(e) => setEditingProduct({ ...editingProduct, rating: e.target.value })}
                      className="w-full bg-black/50 border border-lime-500/20 rounded-lg px-4 py-2 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Stock</label>
                    <input
                      type="number"
                      value={editingProduct.stock}
                      onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                      className="w-full bg-black/50 border border-lime-500/20 rounded-lg px-4 py-2 text-white"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    className="w-full bg-black/50 border border-lime-500/20 rounded-lg px-4 py-2 text-white"
                    rows="3"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={editingProduct.tags.join(', ')}
                    onChange={(e) => setEditingProduct({ ...editingProduct, tags: e.target.value })}
                    className="w-full bg-black/50 border border-lime-500/20 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Badge</label>
                  <input
                    type="text"
                    value={editingProduct.badge || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                    className="w-full bg-black/50 border border-lime-500/20 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <h3 className="text-lime-500 font-medium mb-2">Nutrition Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Protein</label>
                      <input
                        type="text"
                        value={editingProduct.nutrition.protein}
                        onChange={(e) => setEditingProduct({
                          ...editingProduct,
                          nutrition: { ...editingProduct.nutrition, protein: e.target.value }
                        })}
                        className="w-full bg-black/50 border border-lime-500/20 rounded-lg px-4 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Calories</label>
                      <input
                        type="text"
                        value={editingProduct.nutrition.calories}
                        onChange={(e) => setEditingProduct({
                          ...editingProduct,
                          nutrition: { ...editingProduct.nutrition, calories: e.target.value }
                        })}
                        className="w-full bg-black/50 border border-lime-500/20 rounded-lg px-4 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Carbs</label>
                      <input
                        type="text"
                        value={editingProduct.nutrition.carbs}
                        onChange={(e) => setEditingProduct({
                          ...editingProduct,
                          nutrition: { ...editingProduct.nutrition, carbs: e.target.value }
                        })}
                        className="w-full bg-black/50 border border-lime-500/20 rounded-lg px-4 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Servings</label>
                      <input
                        type="text"
                        value={editingProduct.nutrition.servings}
                        onChange={(e) => setEditingProduct({
                          ...editingProduct,
                          nutrition: { ...editingProduct.nutrition, servings: e.target.value }
                        })}
                        className="w-full bg-black/50 border border-lime-500/20 rounded-lg px-4 py-2 text-white"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-lime-500 text-black py-2 rounded-lg font-semibold hover:bg-lime-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Saving Changes...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 bg-gray-500 text-white py-2 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPanel; 