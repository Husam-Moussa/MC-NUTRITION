import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Shop from './components/Shop';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { CartProvider } from './context/CartContext';
import InitialLoader from './components/InitialLoader';

function App() {
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const handleInitialLoadingComplete = () => {
    setIsInitialLoading(false);
  };

  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen bg-black text-white">
        <InitialLoader 
          onLoadingComplete={handleInitialLoadingComplete}
        />
        
        {!isInitialLoading && (
          <>
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </main>
            <Footer />
          </>
        )}
      </div>
    </CartProvider>
  );
}

export default App;
