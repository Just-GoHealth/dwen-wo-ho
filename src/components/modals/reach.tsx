"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Users, Activity, FileText, CheckCircle, School } from "lucide-react";
import { useState } from "react";

interface ReachModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReachModal = ({ isOpen, onClose }: ReachModalProps) => {
  const [baseline, setBaseline] = useState("");
  const schools = [
    "Achimota High School",
    "Presbyterian Boys' Legon",
    "Wesley Girls' High School",
    "Holy Child School",
    "Mfantsipim School",
    "Prempeh College",
  ];

  const metrics = [
    { label: "Visits", value: "0", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Screened", value: "0", icon: Activity, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Results", value: "0", icon: FileText, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Active", value: "0", icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-sm bg-black/40 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-auto overflow-hidden flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-4">
                  
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Reach Overview</h2>
                    <p className="text-sm text-gray-500">Impact and engagement metrics</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Content */}
              <div className="p-8 overflow-y-auto">
                {/* Top Section: Total Reach & Baseline */}
                <div className="flex flex-col md:flex-row gap-8 mb-10">
                  <div className="flex-1 bg-[#955aa4] rounded-2xl p-6 text-white shadow-lg shadow-[#955aa4]/20 relative overflow-hidden">
                    <div className="relative z-10">
                      <p className="text-white/80 font-medium mb-1">Total Student Reach</p>
                      <h3 className="text-5xl font-bold mb-2">293,894</h3>
                      <p className="text-white/60 text-sm">Across all partner institutions</p>
                    </div>
                    <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
                      <Users className="w-48 h-48" />
                    </div>
                  </div>

                  <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Set Baseline Target</label>
                    <div className="flex gap-3">
                      <input
                        value={baseline}
                        onChange={(e) => setBaseline(e.target.value)}
                        className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#955aa4]/20 focus:border-[#955aa4] transition-all text-lg font-medium"
                        placeholder="e.g. 300,000"
                      />
                      <button className="px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors">
                        Update
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-3">
                      This baseline will be used to calculate progress percentages across all schools.
                    </p>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                  {metrics.map((metric) => (
                    <div key={metric.label} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                      <div className={`w-10 h-10 ${metric.bg} ${metric.color} rounded-lg flex items-center justify-center mb-3`}>
                        <metric.icon className="w-5 h-5" />
                      </div>
                      <p className="text-gray-500 text-sm font-medium">{metric.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                    </div>
                  ))}
                </div>

                {/* Schools List */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <School className="w-5 h-5 text-gray-500" />
                    Participating Schools
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {schools.map((school, i) => (
                      <div key={i} className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-xl hover:border-gray-200 hover:shadow-sm transition-all">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold text-sm">
                          {school.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-700">{school}</span>
                      </div>
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


