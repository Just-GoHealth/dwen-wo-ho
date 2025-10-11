"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

interface ProfessionalTitleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (title: string) => void;
  selectedTitle?: string;
}

const professionalTitles = [
  { value: "Dr.", label: "Dr. (Doctor)" },
  { value: "Prof.", label: "Prof. (Professor)" },
  { value: "Mr.", label: "Mr." },
  { value: "Mrs.", label: "Mrs." },
  { value: "Ms.", label: "Ms." },
  { value: "Miss", label: "Miss" },
  { value: "Rev.", label: "Rev. (Reverend)" },
];

const ProfessionalTitleModal: React.FC<ProfessionalTitleModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  selectedTitle,
}) => {
  const handleTitleSelect = (title: string) => {
    onSelect(title);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Professional Title</h2>
                <p className="text-gray-600 mt-1">Select your professional title</p>
              </div>

              {/* Title List */}
              <div className="p-6 max-h-96 overflow-y-auto">
                <div className="space-y-2">
                  {professionalTitles.map((title) => (
                    <button
                      key={title.value}
                      onClick={() => handleTitleSelect(title.value)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 ${
                        selectedTitle === title.value
                          ? "border-[#ed1c24] bg-red-50"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-lg font-medium text-gray-900">
                        {title.label}
                      </span>
                      {selectedTitle === title.value && (
                        <div className="w-6 h-6 bg-[#ed1c24] rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProfessionalTitleModal;
