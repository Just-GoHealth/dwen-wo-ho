/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2Icon, X, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl mx-auto overflow-hidden flex flex-col">
              {/* Header */}
              <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-4">
                  
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">New Member</h2>
                    <p className="text-sm text-gray-500">Add a team member to your organization</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form */}
              <div className="p-8">
                <form id="member-form" onSubmit={handleSubmit} className="space-y-8">
                  {/* Title Selection */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700">Role / Title</label>
                    <div className="grid grid-cols-3 gap-3">
                      {memberTitles.map((title) => (
                        <button
                          key={title}
                          type="button"
                          onClick={() => handleInputChange("title", title)}
                          className={`py-3 px-2 rounded-xl font-medium text-sm transition-all duration-200 flex flex-col items-center gap-2 ${
                            formData.title === title
                              ? "bg-[#955aa4] text-white shadow-md shadow-[#955aa4]/20 ring-2 ring-[#955aa4] ring-offset-2"
                              : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-transparent hover:border-gray-200"
                          }`}
                        >
                          {title}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name Input */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700">Full Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#955aa4]/20 focus:border-[#955aa4] transition-all"
                        placeholder="Enter member's full name"
                      />
                      <UserPlus className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                    </div>
                  </div>

                  {/* Success Message */}
                  <AnimatePresence>
                    {isSubmitted && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, y: -10, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
                          <CheckCircle2Icon className="w-5 h-5 flex-shrink-0" />
                          <p className="font-medium text-sm">
                            <span className="font-bold">{formData.title} {formData.name}</span> has been added successfully!
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </div>

              {/* Footer */}
              <div className="px-8 py-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
                <Button
                  type="button"
                  onClick={onClose}
                  variant="ghost"
                  className="px-6 font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  form="member-form"
                  disabled={!formData.title || !formData.name.trim() || isSubmitted}
                  className="px-8 bg-[#955aa4] hover:bg-[#8a4d99] text-white font-semibold shadow-lg shadow-[#955aa4]/20 disabled:opacity-50 disabled:shadow-none"
                >
                  {isSubmitted ? "Added" : "Add Member"}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MemberCreationModal;
