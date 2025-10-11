"use client";

import { motion } from "framer-motion";

interface LoadingOverlayProps {
  text: string;
  isVisible: boolean;
}

const LoadingOverlay = ({ text, isVisible }: LoadingOverlayProps) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
    >
      {/* Loading bar at bottom */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: "10%" }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="absolute bottom-14 left-1/2 transform -translate-x-1/2 w-2/5 bg-white rounded-lg shadow-2xl"
      >
        <div className="p-8 flex flex-col items-center justify-center space-y-6">
          {/* Throbber spinner - 3 concentric circles */}
          <div className="relative w-16 h-16">
            {/* Outer circle */}
            <motion.div
              className="absolute inset-0 border-4 border-[#955aa4] border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            {/* Middle circle */}
            <motion.div
              className="absolute inset-2 border-3 border-[#955aa4] border-t-transparent rounded-full"
              animate={{ rotate: -360 }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            {/* Inner circle */}
            <motion.div
              className="absolute inset-4 border-2 border-[#955aa4] border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{
                duration: 0.9,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </div>

          {/* Loading text */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg font-medium text-gray-700 text-center"
          >
            {text}
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LoadingOverlay;
