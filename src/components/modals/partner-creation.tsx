"use client";

import { AnimatePresence, motion } from "framer-motion";
import JustGoHealth from "@/components/logo-purple";
import { useRef, useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";

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
            className="fixed inset-0 backdrop-blur-sm bg-white/20 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
          >
            <div className="bg-white rounded-2xl border-2 border-[#955aa4] max-w-3xl w-full p-10">
              <div className="flex items-center justify-between mb-6">
                <JustGoHealth />
                <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><X className="w-6 h-6" /></button>
              </div>

              <h2 className="text-center text-6xl font-extrabold text-[#955aa4] mb-8">New Partner</h2>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-5 items-center gap-6">
                  <label className="col-span-1 text-5xl font-extrabold">Name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="col-span-4 h-16 rounded-xl border-2 border-gray-400 px-4 text-2xl"
                    placeholder=""
                  />
                </div>

                <div className="grid grid-cols-5 items-center gap-6">
                  <label className="col-span-1 text-5xl font-extrabold">Nickname</label>
                  <input
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="col-span-4 h-16 rounded-xl border-2 border-gray-400 px-4 text-2xl"
                    placeholder=""
                  />
                </div>

                <div className="grid grid-cols-5 items-center gap-6">
                  <label className="col-span-1 text-5xl font-extrabold">Logo</label>
                  <div className="col-span-4">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    {logo ? (
                      <button
                        type="button"
                        onClick={handlePickLogo}
                        className="w-full h-20 rounded-xl border-2 border-gray-400 bg-white overflow-hidden flex items-center justify-center"
                        title="Change logo"
                      >
                        <Image src={logo} alt="Logo preview" className="h-full object-contain" width={100} height={100} />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handlePickLogo}
                        className="w-full h-20 rounded-xl bg-gray-300 text-gray-700 text-3xl font-extrabold"
                      >
                        + Photo
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!name.trim()}
                    className="h-16 w-24 rounded-2xl bg-gray-300 text-2xl font-bold text-gray-900 disabled:opacity-50"
                  >
                    GO
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PartnerCreationModal;


