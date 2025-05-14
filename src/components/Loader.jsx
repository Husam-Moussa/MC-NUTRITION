import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Loader = ({ isLoading, onLoadingComplete }) => {
  useEffect(() => {
    // Simulate loading time (remove in production and replace with actual loading logic)
    const timer = setTimeout(() => {
      onLoadingComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { duration: 0.5 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.5, delay: 0.2 }
    }
  };

  const logoVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const progressVariants = {
    initial: { scaleX: 0, opacity: 0 },
    animate: { 
      scaleX: 1,
      opacity: 1,
      transition: { duration: 2, ease: "easeInOut" }
    }
  };

  const orbVariants = {
    animate: (i) => ({
      y: [0, -20, 0],
      rotate: [0, 360],
      transition: {
        duration: 2,
        repeat: Infinity,
        delay: i * 0.2,
      },
    }),
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.7, 0.3],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black"
        >
          {/* Background Effects */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Gradient Orbs */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={orbVariants}
                animate="animate"
                className="absolute w-32 h-32"
                style={{
                  left: `${(i % 3) * 33 + Math.random() * 20}%`,
                  top: `${Math.floor(i / 3) * 50 + Math.random() * 20}%`,
                  background: 'radial-gradient(circle at center, #84cc1615 0%, transparent 70%)',
                  filter: 'blur(8px)',
                }}
              />
            ))}

            {/* Animated Grid */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(to right, #84cc1620 1px, transparent 1px),
                  linear-gradient(to bottom, #84cc1620 1px, transparent 1px)
                `,
                backgroundSize: '4rem 4rem',
              }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 2, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="absolute inset-0"
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Logo */}
            <motion.div
              variants={logoVariants}
              className="mb-8 relative"
            >
              <motion.div
                variants={pulseVariants}
                animate="animate"
                className="absolute inset-0 bg-lime-500/20 rounded-full blur-xl"
              />
              <div className="relative bg-black/50 backdrop-blur-lg border border-lime-500/30 rounded-full p-8">
                <svg className="w-24 h-24 text-lime-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </motion.div>

            {/* Loading Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <h2 className="text-2xl font-bold text-white mb-2">MC NUTRITION</h2>
              <p className="text-lime-500">Loading your experience...</p>
            </motion.div>

            {/* Progress Bar */}
            <div className="w-64 h-1 bg-black/50 rounded-full overflow-hidden backdrop-blur-lg border border-lime-500/30">
              <motion.div
                variants={progressVariants}
                className="h-full bg-gradient-to-r from-lime-500/50 via-lime-500 to-lime-500/50"
                style={{ originX: 0 }}
              />
            </div>

            {/* Loading Dots */}
            <div className="flex gap-2 mt-4">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                  className="w-2 h-2 bg-lime-500 rounded-full"
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loader; 