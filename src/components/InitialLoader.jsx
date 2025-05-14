import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const InitialLoader = ({ onLoadingComplete }) => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showContent, setShowContent] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setShowContent(false);
            setTimeout(onLoadingComplete, 1000);
          }, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  const letters = "MCNUTRITION".split("");

  return (
    <AnimatePresence>
      {showContent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black"
        >
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Particle System */}
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-lime-500/30 rounded-full"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                }}
                animate={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
            ))}

            {/* Animated Lines */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={`line-${i}`}
                className="absolute h-px"
                style={{
                  background: `linear-gradient(90deg, transparent, ${i % 2 === 0 ? '#84cc16' : '#ffffff'}22, transparent)`,
                  width: `${Math.random() * 200 + 100}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  x: [-200, window.innerWidth + 200],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}

            {/* Circular Gradient */}
            <motion.div
              className="absolute inset-0"
              animate={{
                background: [
                  'radial-gradient(circle at 30% 30%, #84cc1615 0%, transparent 50%)',
                  'radial-gradient(circle at 70% 70%, #84cc1615 0%, transparent 50%)',
                  'radial-gradient(circle at 30% 70%, #84cc1615 0%, transparent 50%)',
                  'radial-gradient(circle at 70% 30%, #84cc1615 0%, transparent 50%)',
                ],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          </div>

          {/* Main Content */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Animated Logo */}
            <motion.div
              className="relative mb-12"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
              }}
            >
              <motion.div
                className="absolute inset-0 bg-lime-500/20 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
              <div className="relative bg-black/50 backdrop-blur-xl border border-lime-500/30 rounded-full p-12">
                <svg className="w-32 h-32 text-lime-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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

            {/* Animated Text */}
            <div className="flex gap-1 mb-12">
              {letters.map((letter, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.1,
                  }}
                  className="text-4xl font-bold"
                  style={{
                    color: i < 2 ? '#84cc16' : 'white',
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="relative w-80">
              <motion.div
                className="absolute -top-8 left-0 text-lime-500 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Loading Experience...
              </motion.div>
              <div className="h-2 bg-black/50 rounded-full overflow-hidden backdrop-blur-lg border border-lime-500/30">
                <motion.div
                  className="h-full bg-gradient-to-r from-lime-500/50 via-lime-500 to-lime-500/50"
                  initial={{ width: 0 }}
                  animate={{ width: `${loadingProgress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <motion.div
                className="absolute -bottom-8 right-0 text-lime-500 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {loadingProgress}%
              </motion.div>
            </div>

            {/* Loading Indicators */}
            <div className="mt-16 flex items-center gap-4">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 bg-lime-500 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Corner Decorations */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-32 h-32"
              style={{
                top: i < 2 ? 0 : 'auto',
                bottom: i >= 2 ? 0 : 'auto',
                left: i % 2 === 0 ? 0 : 'auto',
                right: i % 2 === 1 ? 0 : 'auto',
                background: 'radial-gradient(circle at center, #84cc1620 0%, transparent 70%)',
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InitialLoader; 