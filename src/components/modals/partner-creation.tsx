"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { X, Upload, Building2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface PartnerCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPartnerCreated?: (partner: { name: string; nickname?: string; logo?: string }) => void;
}

const PartnerCreationModal = ({ isOpen, onClose, onPartnerCreated }: PartnerCreationModalProps) => {
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [logo, setLogo] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handlePickLogo = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setLogo(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onPartnerCreated?.({ name, nickname, logo });
    onClose();
  };

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
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl mx-auto overflow-hidden flex flex-col">
              {/* Header */}
              <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-4">
                 
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">New Partner</h2>
                    <p className="text-sm text-gray-500">Add a new partner organization</p>
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
                <form id="partner-form" onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Partner Name</label>
                    <div className="relative">
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#955aa4]/20 focus:border-[#955aa4] transition-all"
                        placeholder="e.g. Ministry of Health"
                      />
                      <Building2 className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                    </div>
                  </div>

                  {/* Nickname */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Nickname (Optional)</label>
                    <input
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#955aa4]/20 focus:border-[#955aa4] transition-all"
                      placeholder="e.g. MoH"
                    />
                  </div>

                    <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Slogan</label>
                    <input
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#955aa4]/20 focus:border-[#955aa4] transition-all"
                      placeholder="e.g. The Sound Of Young America"
                    />
                  </div>

                  {/* Logo */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Partner Logo</label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <button
                      type="button"
                      onClick={handlePickLogo}
                      className="w-full h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 hover:border-[#955aa4]/30 transition-all group overflow-hidden relative"
                    >
                      {logo ? (
                        <div className="relative w-full h-full p-4">
                          <Image src={logo} alt="Logo preview" fill className="object-contain" />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                            <span className="opacity-0 group-hover:opacity-100 bg-white/90 px-3 py-1 rounded-full text-xs font-medium shadow-sm">Change</span>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <Upload className="w-5 h-5 text-[#955aa4]" />
                          </div>
                          <span className="text-sm font-medium text-gray-600 group-hover:text-[#955aa4] transition-colors">Click to upload logo</span>
                        </>
                      )}
                    </button>
                  </div>
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
                  form="partner-form"
                  disabled={!name.trim()}
                  className="px-8 bg-[#955aa4] hover:bg-[#8a4d99] text-white font-semibold shadow-lg shadow-[#955aa4]/20 disabled:opacity-50 disabled:shadow-none"
                >
                  Create Partner
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PartnerCreationModal;


