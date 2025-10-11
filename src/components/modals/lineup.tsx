"use client";

import { AnimatePresence, motion } from "framer-motion";
import JustGoHealth from "@/components/logo-purple";
import { useState } from "react";
import { X } from "lucide-react";

interface LineupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LineupModal = ({ isOpen, onClose }: LineupModalProps) => {
  const [lineup, setLineup] = useState<string[]>([
    "Achimota High School",
    "Achimota High School",
    "Achimota High School",
    "Achimota High School",
  ]);
  const [others, setOthers] = useState<string[]>([
    "Ashesi University",
    "Ashesi University",
    "Ashesi University",
  ]);
  const [activeTab, setActiveTab] = useState<"lineup" | "others">("lineup");

  const handleToggle = (name: string) => {
    // If it's already in lineup, remove and push to others; else move from others into lineup
    if (lineup.includes(name)) {
      setLineup((prev) => prev.filter((n) => n !== name));
      setOthers((prev) => (prev.includes(name) ? prev : [...prev, name]));
    } else {
      setLineup((prev) => (prev.includes(name) ? prev : [...prev, name]));
      setOthers((prev) => prev.filter((n) => n !== name));
    }
  };

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
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl border-2 border-[#955aa4] max-w-5xl w-full p-8 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
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

              <p className="text-center text-3xl font-extrabold text-gray-800 mb-6">
                Double click to add or remove a school from the lineup
              </p>

              <div className="grid grid-cols-3 gap-8 items-start">
                {/* Left stacked tabs */}
                <div className="space-y-6">
                  <button
                    onClick={() => setActiveTab("lineup")}
                    className={`w-full text-left px-6 py-3 rounded-full text-4xl font-extrabold transition-colors ${
                      activeTab === "lineup" ? "bg-[#955aa4] text-white" : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    Lineup . {lineup.length}
                  </button>
                  <button
                    onClick={() => setActiveTab("others")}
                    className={`w-full text-left px-6 py-3 rounded-full text-4xl font-extrabold transition-colors ${
                      activeTab === "others" ? "bg-[#955aa4] text-white" : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    Others
                  </button>
                </div>

                {/* Right list for active tab */}
                <div className="col-span-2">
                  {activeTab === "lineup" ? (
                    <div className="space-y-3">
                      {lineup.map((n) => (
                        <p
                          key={n}
                          onDoubleClick={() => handleToggle(n)}
                          className="text-5xl font-extrabold text-gray-900 cursor-pointer"
                        >
                          {n}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {others.map((n) => (
                        <p
                          key={n}
                          onDoubleClick={() => handleToggle(n)}
                          className="text-5xl font-extrabold text-gray-300 cursor-pointer select-none"
                        >
                          {n}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LineupModal;


