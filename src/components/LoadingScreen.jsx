import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

// Dumbbell component
const Dumbbell = ({ scale = 1 }) => (
  <motion.div
    className="absolute"
    style={{ transform: `scale(${scale})` }}
  >
    <div className="flex items-center">
      <div className="w-4 h-12 bg-lime-500/20 rounded-full" />
      <div className="w-16 h-2 bg-lime-500" />
      <div className="w-4 h-12 bg-lime-500/20 rounded-full" />
    </div>
  </motion.div>
);

// Weight Plate component
const WeightPlate = ({ scale = 1 }) => (
  <motion.div
    className="absolute"
    style={{ transform: `scale(${scale})` }}
  >
    <div className="w-8 h-8 rounded-full border-4 border-lime-500/40 flex items-center justify-center">
      <div className="w-2 h-2 rounded-full bg-lime-500/40" />
    </div>
  </motion.div>
);

// Burst Animation Component
const BurstAnimation = () => {
  const items = Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    type: i % 2 === 0 ? 'dumbbell' : 'weight',
    angle: (i * 360) / 8,
    delay: i * 0.1
  }));

  return (
    <div className="absolute inset-0 pointer-events-none">
      {items.map(item => (
        <motion.div
          key={item.id}
          initial={{ 
            scale: 0,
            x: 0,
            y: 0,
            opacity: 0
          }}
          animate={{
            scale: [0, 0.6, 0.4],
            x: [0, Math.cos(item.angle * (Math.PI / 180)) * 100],
            y: [0, Math.sin(item.angle * (Math.PI / 180)) * 100],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 2,
            delay: 0.5 + item.delay,
            ease: "easeOut",
            times: [0, 0.7, 1]
          }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          {item.type === 'dumbbell' ? (
            <Dumbbell scale={0.5} />
          ) : (
            <WeightPlate scale={1} />
          )}
        </motion.div>
      ))}
    </div>
  );
};

const LoadingScreen = () => {
  const [particles, setParticles] = useState([]);
  const controls = useAnimation();

  useEffect(() => {
    // Create particles with different delays
    const particleCount = 15;
    const newParticles = Array.from({ length: particleCount }).map((_, i) => ({
      id: i,
      delay: (i * 0.1) % 2
    }));
    setParticles(newParticles);

    // Animate the background gradient
    controls.start({
      background: [
        'linear-gradient(45deg, rgba(0,0,0,1) 0%, rgba(16,24,16,1) 100%)',
        'linear-gradient(225deg, rgba(0,0,0,1) 0%, rgba(16,24,16,1) 100%)',
        'linear-gradient(45deg, rgba(0,0,0,1) 0%, rgba(16,24,16,1) 100%)'
      ],
      transition: {
        duration: 5,
        repeat: Infinity,
        ease: "linear"
      }
    });
  }, [controls]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden p-4 sm:p-6 md:p-8"
    >
      {/* Animated background */}
      <motion.div
        animate={controls}
        className="absolute inset-0"
      />

      {/* Energy particles */}
      <div className="absolute inset-0 flex items-center justify-center">
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 0.3, 0],
              x: [0, (Math.random() - 0.5) * 100],
              y: [0, (Math.random() - 0.5) * 100]
            }}
            transition={{
              duration: 2,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute w-1 h-4 bg-lime-500/30 rounded-full"
            style={{
              filter: "blur(1px)"
            }}
          />
        ))}
      </div>

      {/* Content container */}
      <div className="relative w-full max-w-[90vw] sm:max-w-[80vw] md:max-w-[70vw] lg:max-w-[60vw]">
        {/* Main Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.8,
            ease: "easeOut"
          }}
          className="text-center relative"
        >
          {/* Burst Animation */}
          <BurstAnimation />

          {/* Mobile Text (XS screens) */}
          <motion.div 
            className="text-4xl font-bold text-white mb-3 sm:hidden relative"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="relative z-10">MC</span>{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-lime-500 relative z-10">
              NUTRITION
            </span>
            <motion.div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm -z-0 rounded-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            />
          </motion.div>

          {/* Small screens */}
          <motion.div 
            className="hidden sm:block md:hidden text-5xl font-bold text-white mb-3 relative"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="relative z-10">MC</span>{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-lime-500 relative z-10">
              NUTRITION
            </span>
            <motion.div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm -z-0 rounded-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            />
          </motion.div>

          {/* Medium screens */}
          <motion.div 
            className="hidden md:block lg:hidden text-6xl font-bold text-white mb-4 relative"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="relative z-10">MC</span>{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-lime-500 relative z-10">
              NUTRITION
            </span>
            <motion.div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm -z-0 rounded-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            />
          </motion.div>

          {/* Large screens and up */}
          <motion.div 
            className="hidden lg:block text-7xl xl:text-8xl font-bold text-white mb-4 relative"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="relative z-10">MC</span>{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-lime-500 relative z-10">
              NUTRITION
            </span>
            <motion.div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm -z-0 rounded-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            />
          </motion.div>

          {/* Underline with responsive width and height */}
          <div className="relative w-full">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ 
                delay: 0.5, 
                duration: 1.2,
                ease: "easeInOut"
              }}
              className="h-[0.15em] sm:h-[0.2em] md:h-[0.25em] bg-gradient-to-r from-lime-500/20 via-lime-500 to-lime-500/20 mx-auto rounded-full"
            />
            
            {/* Glow effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{
                delay: 1.7,
                duration: 1.5,
                ease: "easeInOut",
                times: [0, 0.5, 1]
              }}
              className="absolute inset-0 h-[0.15em] sm:h-[0.2em] md:h-[0.25em] bg-lime-500/40 blur-[8px] rounded-full"
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen; 