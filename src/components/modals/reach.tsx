"use client";

import { AnimatePresence, motion } from "framer-motion";
import JustGoHealth from "@/components/logo-purple";
import { X } from "lucide-react";
import { useState } from "react";

interface ReachModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReachModal = ({ isOpen, onClose }: ReachModalProps) => {
  const [baseline, setBaseline] = useState("");
  const schools = [
    "Achimota High School",
    "Achimota High School",
    "Achimota High School",
    "Achimota High School",
    "Achimota High School",
    "Achimota High School",
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-sm bg-white/20 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
          >
            <div className="bg-white rounded-2xl border-2 border-[#955aa4] max-w-5xl w-full p-10">
              <div className="flex items-start justify-between">
                <h2 className="text-[#955aa4] text-6xl font-extrabold">
                  Reach - 293,894 <span className="text-4xl font-bold text-gray-800">Students</span>
                </h2>
                <div className="mt-2 flex items-center gap-4">
                  <JustGoHealth />
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="text-gray-500 hover:text-gray-800 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-12 mt-10">
                {/* Left metrics */}
                <div>
                  <p className="text-3xl font-extrabold mb-3">Baseline</p>
                  <input
                    value={baseline}
                    onChange={(e) => setBaseline(e.target.value)}
                    className="w-full h-16 rounded-xl border-2 border-gray-400 px-4 text-2xl"
                  />

                  <div className="mt-8 space-y-6">
                    {[
                      "Visit - 0",
                      "Screen - 0",
                      "Results - 0",
                      "Active Results - 0",
                    ].map((label) => (
                      <div
                        key={label}
                        className="w-full rounded-xl bg-black text-white text-3xl font-extrabold px-6 py-4"
                      >
                        {label}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right list */}
                <div>
                  <p className="text-[#955aa4] text-5xl font-extrabold mb-4">JustGo Health</p>
                  <div className="space-y-2">
                    {schools.map((s, i) => (
                      <p key={i} className="text-4xl font-extrabold text-gray-900">
                        {s}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ReachModal;


