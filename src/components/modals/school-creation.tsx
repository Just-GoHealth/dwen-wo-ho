/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDown, Upload, X, MapPin } from "lucide-react";
import Image from "next/image";
import { useCreateSchool } from "@/hooks/queries/useSchoolsQuery";
import { ICreateSchool } from "@/types/school";
import { useClickOutside } from "@/hooks/useClickOutside";

interface SchoolCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchoolCreated?: (school: any) => void;
}

const campusOptions = [
  "Accra",
  "Kumasi",
  "Cape Coast",
  "Takoradi",
  "Tamale",
  "Ho",
  "Koforidua",
  "Sunyani",
];

const schoolTypes = ["JHS", "SHS", "NMTC", "University"];

type SchoolFormData = {
  name: string;
  nickname: string;
  campuses: string[];
  type: string;
  logo: File | undefined;
};

const SchoolCreationModal = ({
  isOpen,
  onClose,
  onSchoolCreated,
}: SchoolCreationModalProps) => {
  const [showCampusDropdown, setShowCampusDropdown] = useState(false);
  const [selectedCampuses, setSelectedCampuses] = useState<string[]>([]);
  const [formData, setFormData] = useState<SchoolFormData>({
    name: "",
    nickname: "",
    campuses: [] as string[],
    type: "",
    logo: undefined,
  });

  const createSchoolMutation = useCreateSchool();
  const campusDropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(campusDropdownRef, () => {
    setShowCampusDropdown(false);
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCampusToggle = (campus: string) => {
    setSelectedCampuses((prev) =>
      prev.includes(campus)
        ? prev.filter((c) => c !== campus)
        : [...prev, campus]
    );
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    const file = input.files?.[0];
    setFormData((prev) => ({
      ...prev,
      logo: file,
    }));
  };

  const handleRemoveLogo = () => {
    setFormData((prev) => ({ ...prev, logo: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.type) {
      return;
    }

    const schoolData: ICreateSchool = {
      name: formData.name,
      nickname: formData.nickname,
      type: formData.type,
      baseline: "",
      campuses: selectedCampuses,
      logo: formData.logo ?? null,
    };

    createSchoolMutation.mutate(schoolData, {
      onSuccess: () => {
        onSchoolCreated?.(schoolData);
        onClose();
        
        setFormData({
          name: "",
          nickname: "",
          campuses: [],
          type: "",
          logo: undefined,
        });
        setSelectedCampuses([]);
      },
    });
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
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-auto overflow-hidden flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">New School</h2>
                    <p className="text-sm text-gray-500">Add a new educational institution</p>
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
              <div className="flex-1 overflow-y-auto p-8">
                <form id="school-form" onSubmit={handleSubmit} className="space-y-8">
                  {/* Name & Nickname */}
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">School Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#955aa4]/20 focus:border-[#955aa4] transition-all"
                        placeholder="e.g. Achimota School"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Nickname (Optional)</label>
                      <input
                        type="text"
                        value={formData.nickname}
                        onChange={(e) => handleInputChange("nickname", e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#955aa4]/20 focus:border-[#955aa4] transition-all"
                        placeholder="e.g. Motown"
                      />
                    </div>
                  </div>

                {/* Type */}
                <div className="flex items-center gap-6">
                  <label className="text-lg font-bold text-gray-900 w-24">
                    Type
                  </label>
                  <div className="flex-1 flex gap-4">
                    {schoolTypes.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleInputChange("type", type)}
                        className={`px-6 py-2 rounded-lg font-bold transition-colors ${formData.type === type
                          ? "bg-[#955aa4] text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Campuses */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-gray-700">Campuses</label>
                    {selectedCampuses.length > 0 && (
                      <span className="text-xs font-medium text-[#955aa4] bg-[#955aa4]/10 px-2 py-1 rounded-full">
                        {selectedCampuses.length} selected
                      </span>
                    )}
                  </div>
                  <div className="relative" ref={campusDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setShowCampusDropdown(!showCampusDropdown)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-left flex items-center justify-between hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className={selectedCampuses.length > 0 ? "text-gray-900" : "text-gray-500"}>
                          {selectedCampuses.length > 0 
                            ? selectedCampuses.join(", ")
                            : "Select campus locations"
                          }
                        </span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showCampusDropdown ? "rotate-180" : ""}`} />
                    </button>
                    
                    <AnimatePresence>
                      {showCampusDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-20 overflow-hidden"
                        >
                          <div className="max-h-48 overflow-y-auto p-2">
                            {campusOptions.map((campus) => (
                              <button
                                key={campus}
                                type="button"
                                onClick={() => handleCampusToggle(campus)}
                                className={`w-full text-left px-4 py-2.5 rounded-lg transition-colors ${
                                  selectedCampuses.includes(campus)
                                    ? "bg-gray-100 text-gray-900 font-medium"
                                    : "hover:bg-gray-50 text-gray-700"
                                }`}
                              >
                                <span>{campus}</span>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Logo */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700">School Logo</label>
                  <div className="flex items-center gap-6">
                    <div className="flex-1">
                      {formData.logo ? (
                        <div className="relative inline-block">
                          <Image
                            src={URL.createObjectURL(formData.logo)}
                            alt="Uploaded logo"
                            width={128}
                            height={128}
                            className="w-32 h-32 object-cover rounded-lg border shadow-sm"
                          />
                          <div className="absolute top-1 right-1 flex gap-1">
                            <input
                              type="file"
                              id="logo-change"
                              accept="image/*"
                              onChange={handleLogoUpload}
                              className="hidden"
                            />
                            <label
                              htmlFor="logo-change"
                              className="bg-[#955aa4]/80 hover:bg-[#955aa4] text-white rounded-full p-1.5 cursor-pointer transition-colors"
                              title="Change logo"
                            >
                              <Upload size={12} />
                            </label>
                            <button
                              type="button"
                              onClick={handleRemoveLogo}
                              className="bg-black/60 hover:bg-black/80 text-white rounded-full p-1 transition-colors"
                              title="Remove logo"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <input
                            type="file"
                            id="logo-upload"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                          />
                          <label
                            htmlFor="logo-upload"
                            className="w-full h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 hover:border-[#955aa4]/30 transition-all group"
                          >
                            <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                              <Upload className="w-5 h-5 text-[#955aa4]" />
                            </div>
                            <span className="text-sm font-medium text-gray-600 group-hover:text-[#955aa4] transition-colors">Click to upload logo</span>
                            <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</span>
                          </label>
                        </>
                      )}
                    </div>
                  </div>
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
                  form="school-form"
                  className="px-8 bg-[#955aa4] hover:bg-[#8a4d99] text-white font-semibold shadow-lg shadow-[#955aa4]/20"
                >
                  Create School
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SchoolCreationModal;
