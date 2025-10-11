/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import JustGoHealth from "@/components/logo-purple";
import { CheckCircle2Icon, X } from "lucide-react";
import Image from "next/image";

interface MemberCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMemberCreated?: (member: any) => void;
}

const MemberCreationModal = ({ isOpen, onClose, onMemberCreated }: MemberCreationModalProps) => {
  const [formData, setFormData] = useState({
    title: "",
    name: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const memberTitles = ["Coach", "Advisor", "Ambassador"];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.name.trim()) return;
    
    // Simulate API call
    setIsSubmitted(true);
    
    // Reset form after 2 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      onMemberCreated?.(formData);
      onClose();
    }, 2000);
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
            className="fixed inset-0 backdrop-blur-sm bg-white/20 z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl border-2 border-[#955aa4] w-full max-w-3xl mx-auto">
              {/* Header */}
              <div className="px-10 pt-6 pb-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <JustGoHealth />
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-800 transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <h2 className="text-center text-6xl font-extrabold text-[#955aa4] mb-3">New Member</h2>
                <p className="text-center text-2xl text-gray-700">
                  Select a title and add full name to create a new member
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="px-10 py-8 space-y-10">
                {/* Title Selection */}
                <div className="space-y-4">
                  <div className="flex gap-6">
                  <label className="text-5xl font-bold text-gray-900 mt-4">Title</label>
                    {memberTitles.map((title) => (
                      <button
                        key={title}
                        type="button"
                        onClick={() => handleInputChange("title", title)}
                        className={`px-8 py-6 rounded-full scale-[0.8] text-2xl font-bold transition-colors ${
                          formData.title === title
                            ? "bg-black text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {title}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name Input */}
                <div className="space-y-4">
                  <div className="flex items-stretch gap-4">
                  <label className="text-5xl font-bold text-gray-900 mt-2">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="flex-1 h-20 px-8 text-2xl bg-gray-100 border-4 border-black rounded-l-lg focus:outline-none"
                      placeholder="Enter full name"
                    />
                    <button
                      type="submit"
                      disabled={!formData.title || !formData.name.trim()}
                      className={`h-20 px-8 rounded-r-lg border-4 border-black border-l-0 bg-black flex items-center justify-center ${
                        !formData.title || !formData.name.trim() ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <Image 
                        src="/arrow-vertical.png" 
                        alt="Arrow right" 
                        width={32} 
                        height={32}
                        className="w-8 h-8 hover:scale-125 transition-all duration-300"
                      />
                    </button>
                  </div>
                </div>

                {/* Success Message */}
                {isSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <CheckCircle2Icon className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="text-green-800 font-semibold">
                        {formData.title} {formData.name} has been added as a new member
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* No footer actions in this design; submission is via arrow button */}
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MemberCreationModal;
