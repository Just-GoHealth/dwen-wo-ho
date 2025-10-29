/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import JustGoHealth from "@/components/logo-purple";
import { Button } from "@/components/ui/button";
import { ChevronDown, Upload, X } from "lucide-react";
import { useSchoolsQuery } from "@/hooks/queries/useSchoolsQuery";
import { ICreateSchool } from "@/types/school";

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

const schoolTypes = ["High School", "NMTC", "University"];

type FormData = {
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
  const [formData, setFormData] = useState<FormData>({
    name: "",
    nickname: "",
    // baseline: "",
    campuses: [] as string[],
    type: "",
    logo: undefined,
  });

  const { createSchoolMutation } = useSchoolsQuery();

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
    console.log(file);
    setFormData((prev) => ({
      ...prev,
      logo: file,
    }));
  };

  const handleRemoveLogo = () => {
    setFormData((prev) => ({ ...prev, logo: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const schoolData = {
      ...formData,
      campuses: selectedCampuses,
    };
    createSchoolMutation.mutate(schoolData as ICreateSchool, {
      onSuccess: (success) => {
        onSchoolCreated?.(formData);
        onClose();
        console.log(success);
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl border-2 border-[#955aa4] w-full max-w-2xl mx-auto">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <JustGoHealth />
                  <h2 className="text-3xl font-bold text-[#955aa4]">
                    New School
                  </h2>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Name */}
                <div className="flex items-center gap-6">
                  <label className="text-lg font-bold text-gray-900 w-24">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#955aa4]"
                    placeholder="Enter school name"
                  />
                </div>

                {/* Nickname */}
                <div className="flex items-center gap-6">
                  <label className="text-lg font-bold text-gray-900 w-24">
                    Nickname
                  </label>
                  <input
                    type="text"
                    value={formData.nickname}
                    onChange={(e) =>
                      handleInputChange("nickname", e.target.value)
                    }
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#955aa4]"
                    placeholder="Enter school nickname"
                  />
                </div>

                {/* Campuses */}
                <div className="flex items-start gap-6">
                  <label className="text-lg font-bold text-gray-900 w-24 pt-2">
                    Campuses{" "}
                    {selectedCampuses.length > 0 &&
                      `· ${selectedCampuses.length}`}
                  </label>
                  <div className="flex-1 relative">
                    <button
                      type="button"
                      onClick={() => setShowCampusDropdown(!showCampusDropdown)}
                      className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-left flex items-center justify-between"
                    >
                      <span className="text-gray-500">
                        {selectedCampuses.length > 0
                          ? selectedCampuses.join(", ")
                          : "Select locations"}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>

                    {showCampusDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                        {campusOptions.map((campus) => (
                          <button
                            key={campus}
                            type="button"
                            onClick={() => handleCampusToggle(campus)}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center justify-between"
                          >
                            <span
                              className={
                                selectedCampuses.includes(campus)
                                  ? "text-[#955aa4]"
                                  : "text-gray-900"
                              }
                            >
                              {campus}
                            </span>
                            {selectedCampuses.includes(campus) && (
                              <span className="text-[#955aa4]">✓</span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      You can add multiple campuses.
                    </p>
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
                        className={`px-6 py-2 rounded-lg font-bold transition-colors ${
                          formData.type === type
                            ? "bg-[#955aa4] text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Logo */}
                <div className="flex items-center gap-6">
                  <label className="text-lg font-bold text-gray-900 w-24">
                    Logo
                  </label>
                  <div className="flex-1">
                    {formData.logo ? (
                      <div className="relative inline-block">
                        <img
                          src={formData.logo}
                          alt="Uploaded logo"
                          className="w-32 h-32 object-cover rounded-lg border shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveLogo}
                          className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full p-1"
                        >
                          <X size={14} />
                        </button>
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
                          className="w-full h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                        >
                          <div className="text-center">
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <span className="text-gray-500 font-bold">
                              + Photo
                            </span>
                          </div>
                        </label>
                      </>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                  <Button
                    type="button"
                    onClick={onClose}
                    variant="outline"
                    className="px-6 py-2 border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="px-6 py-2 bg-[#955aa4] text-white hover:bg-[#955aa4]/90"
                  >
                    {!createSchoolMutation.isPending
                      ? "Create School"
                      : "Creating School..."}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SchoolCreationModal;
