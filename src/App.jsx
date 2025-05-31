import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
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

function App() {
  return (
    <SocketProvider>
      <AuthProvider>
        <CartProvider>
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
              </Routes>
            </main>
          </div>
        </CartProvider>
      </AuthProvider>
    </SocketProvider>
  );
}

export default App;
