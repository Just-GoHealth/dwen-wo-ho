import React from "react";
import { FiX, FiClock } from "react-icons/fi";

interface FeatureComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
}

const FeatureComingSoonModal = ({
  isOpen,
  onClose,
  featureName,
}: FeatureComingSoonModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-[60] p-4">
      <div 
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col items-center text-center p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full flex items-center justify-center transition-all duration-200"
          aria-label="Close modal"
        >
          <FiX className="w-4 h-4" />
        </button>

        <div className="w-20 h-20 bg-[#955aa4]/10 rounded-full flex items-center justify-center mb-6">
          <FiClock className="w-10 h-10 text-[#955aa4]" />
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Coming Soon
        </h3>
        
        <p className="text-gray-600 mb-6">
          The <span className="font-semibold text-[#955aa4]">{featureName}</span> feature is currently under development. We're working hard to bring this to you!
        </p>

        <button
          onClick={onClose}
          className="px-6 py-2.5 bg-[#955aa4] text-white font-semibold rounded-lg hover:bg-[#8a4d99] transition-colors shadow-lg shadow-[#955aa4]/20"
        >
          Got it
        </button>
      </div>
    </div>
  );
};

export default FeatureComingSoonModal;
