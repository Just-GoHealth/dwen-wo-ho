"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface PendingVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  userInfo?: {
    name: string;
    title: string;
    profileImage?: string;
    timeAgo?: string;
  };
}

const PendingVerificationModal = ({ 
  isOpen, 
  onClose, 
  userInfo = {
    name: "Dr. Amanda Gorman",
    title: "Clinical Psychologist",
    timeAgo: "2 hours ago"
  }
}: PendingVerificationModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-[#955aa4] px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-[#955aa4] rounded-full"></div>
                </div>
                <span className="text-white font-bold text-lg">JustGo Health</span>
              </div>
              <span className="text-white font-semibold">Pending Page</span>
            </div>

            {/* Content */}
            <div className="p-6 text-center">
              {/* Profile Section */}
              <div className="mb-6">
                <div className="w-24 h-24 bg-yellow-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                  {userInfo.profileImage ? (
                    <Image
                      width={96}
                      height={96}
                      src={userInfo.profileImage} 
                      alt={userInfo.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xl">
                        {userInfo.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500 mb-2">{userInfo.timeAgo}</p>
                <h2 className="text-2xl font-bold text-black mb-1">{userInfo.name}</h2>
                <p className="text-lg text-gray-600">{userInfo.title}</p>
              </div>

              {/* Status Section */}
              <div className="mb-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <span className="text-2xl font-bold text-black">Status: Pending...</span>
                </div>
              </div>

              {/* Instructions */}
              <div className="text-left">
                <p className="text-gray-700 leading-relaxed">
                  You can call the JustGo Health verification team on{" "}
                  <span className="font-semibold text-[#955aa4]">0538920991</span> or email them at{" "}
                  <span className="font-semibold text-[#955aa4]">prince.baadu7@gmail.com</span> to speed up the process. Thank you.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PendingVerificationModal;
