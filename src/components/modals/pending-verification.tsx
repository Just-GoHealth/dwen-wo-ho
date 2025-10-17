"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface PendingVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  userInfo?: {
    name: string;
    title: string;
    specialty?: string;
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
    timeAgo: "2 hours ago",
  },
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
            className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full mx-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-[#955aa4] px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-[#955aa4] rounded-full"></div>
                </div>
                <span className="text-white font-bold text-lg">
                  JustGo Health
                </span>
              </div>
              <span className="text-white font-semibold">Pending Page</span>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Profile Section - Horizontal Layout */}
              <div className="flex items-start gap-6 mb-8">
                {/* Profile Image on Left */}
                <div className="flex-shrink-0">
                  {userInfo.profileImage ? (
                    <Image
                      width={120}
                      height={120}
                      src={userInfo.profileImage}
                      alt={userInfo.name}
                      className="w-30 h-30 rounded-full object-cover border-4 border-gray-200"
                    />
                  ) : (
                    <div className="w-30 h-30 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center border-4 border-gray-200">
                      <span className="text-white font-bold text-3xl">
                        {userInfo.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                  )}
                </div>

                {/* Name and Role on Right */}
                <div className="flex-1 text-left pt-2">
                  <h2 className="text-3xl font-bold text-black mb-2">
                    {userInfo.name}
                  </h2>
                  <p className="text-xl text-gray-600 mb-1">{userInfo.title}</p>
                  {userInfo.specialty && (
                    <p className="text-lg text-gray-500 mb-3">
                      {userInfo.specialty}
                    </p>
                  )}
                  {userInfo.timeAgo && (
                    <p className="text-sm text-gray-500">{userInfo.timeAgo}</p>
                  )}
                </div>
              </div>

              {/* Status Section */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <span className="text-2xl font-bold text-black">
                    Status: Pending...
                  </span>
                </div>
              </div>

              {/* Instructions */}
              <div className="text-left bg-gray-50 p-6 rounded-xl">
                <p className="text-gray-700 leading-relaxed text-lg">
                  You can call the JustGo Health verification team on{" "}
                  <span className="font-semibold text-[#955aa4]">
                    0538920991
                  </span>{" "}
                  or email them at{" "}
                  <span className="font-semibold text-[#955aa4]">
                    prince.baadu7@gmail.com
                  </span>{" "}
                  to speed up the process. Thank you.
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
