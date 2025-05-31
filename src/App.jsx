import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Shop from './components/Shop';
import About from './components/About';
import Contact from './components/Contact';
import Login from './components/Login';
import Signup from './components/Signup';
import AdminPanel from './components/AdminPanel';
import UserPage from './components/UserPage';
import PublicRoute from './components/PublicRoute';
import AdminRoute from './components/AdminRoute';
import ProductDetailsRoute from './components/ProductDetailsRoute';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time (you can remove this in production)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // Show loading screen for 2.5 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <SocketProvider>
      <AuthProvider>
        <CartProvider>
          <AnimatePresence mode="wait">
            {isLoading ? (
              <LoadingScreen key="loading" />
            ) : (
              <div className="flex flex-col min-h-screen bg-black text-white">
                <Navbar />
                <main className="flex-grow">
                  <Routes>
                    <Route
                      path="/"
                      element={
                        <PublicRoute>
                          <Home />
                        </PublicRoute>
                      }
                    />
                    <Route
                      path="/shop"
                      element={
                        <PublicRoute>
                          <Shop />
                        </PublicRoute>
                      }
                    />
                    <Route
                      path="/about"
                      element={
                        <PublicRoute>
                          <About />
                        </PublicRoute>
                      }
                    />
                    <Route
                      path="/contact"
                      element={
                        <PublicRoute>
                          <Contact />
                        </PublicRoute>
                      }
                    />
                    <Route
                      path="/login"
                      element={
                        <PublicRoute>
                          <Login />
                        </PublicRoute>
                      }
                    />
                    <Route
                      path="/signup"
                      element={
                        <PublicRoute>
                          <Signup />
                        </PublicRoute>
                      }
                    />
                    <Route
                      path="/admin"
                      element={
                        <AdminRoute>
                          <AdminPanel />
                        </AdminRoute>
                      }
                    />
                    <Route
                      path="/user"
                      element={
                        <PublicRoute>
                          <UserPage />
                        </PublicRoute>
                      }
                    />
                    <Route
                      path="/product/:id"
                      element={
                        <PublicRoute>
                          <ProductDetailsRoute />
                        </PublicRoute>
                      }
                    />
                  </Routes>
                </main>
              </div>
            )}
          </AnimatePresence>
        </CartProvider>
      </AuthProvider>
    </SocketProvider>
  );
}

export default App;
