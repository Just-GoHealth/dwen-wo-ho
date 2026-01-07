"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import JustGoHealth from "../logo-purple";

interface PendingVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
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
  isLoading = false,
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
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full mx-4 overflow-hidden border-4 border-[#955aa4]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative bg-white px-8 py-4 flex items-center justify-between border-b-0">
              <div className="flex items-center gap-3">
                <JustGoHealth />
              </div>
              {!isLoading && (
                <span className="text-[#955aa4] font-bold text-lg absolute top-7 left-1/2 -translate-x-1/2">
                  Pending Page
                </span>
              )}
            </div>

            {/* Content */}
            <div className="p-8 pt-2">
              {isLoading ? (
                // Loading Skeleton State
                <div className="animate-pulse">
                  <div className="flex items-center justify-center gap-17 mb-10">
                    <div className="flex-shrink-0">
                      <div className="w-40 h-40 bg-gray-200 rounded-full"></div>
                    </div>
                    <div className="text-left space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="h-8 bg-gray-200 rounded w-64"></div>
                      <div className="h-6 bg-gray-200 rounded w-48"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-4 mb-10">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="h-14 bg-gray-200 rounded w-64"></div>
                  </div>
                </div>
              ) : (
                // Loaded State
                <>
                  <div className="grid grid-cols-[160px_1fr] gap-10 items-center max-w-2xl mx-auto mb-10">
                    {/* Profile Section */}
                    {/* Profile Image */}
                    <div className="flex justify-center flex-shrink-0">
                      {userInfo.profileImage ? (
                        <Image
                          width={170}
                          height={170}
                          src={userInfo.profileImage}
                          alt={userInfo.name}
                          className="w-40 h-40 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-40 h-40 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-gray-500 font-bold text-3xl">
                            {userInfo.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Name and Role */}
                    <div className="text-left min-w-0">
                      {userInfo.timeAgo && (
                        <p className="text-lg font-bold text-black mb-1">{userInfo.timeAgo}</p>
                      )}
                      <h2 className="text-4xl font-bold text-black mb-1 break-words">
                        {userInfo.name}
                      </h2>
                      <p className="text-2xl font-bold text-black opacity-80">{userInfo.title}</p>
                    </div>

                    {/* Status Section */}
                    {/* Icon - Centered to match Photo */}
                    <div className="flex justify-center flex-shrink-0">
                      <div className="relative w-12 h-12">
                        <div className="absolute inset-0 border-[6px] border-black rounded-full text-white"></div>
                        <div className="absolute inset-0 m-auto w-5 h-5 bg-black rounded-full"></div>
                      </div>
                    </div>

                    {/* Status Text */}
                    <div className="text-left -ml-18 -mb-2">
                      <span className="text-6xl font-extrabold text-black tracking-tight">
                        Status: &nbsp;&nbsp; <span className="font-medium">Pending...</span>
                      </span>
                    </div>
                  </div>
                </>
              )}

              {/* Instructions */}
              <div className="text-left p-6 rounded-xl">
                <p className="text-gray-700 text-center leading-relaxed text-lg">
                  You can call the JustGo Health verification team on 0538920991
                  or email them at prince.baadu7@gmail.com to speed up the process. Thank you.
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
