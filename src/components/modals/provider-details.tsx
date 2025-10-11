/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, useCallback } from "react";
import { FiX, FiPlus, FiMinus } from "react-icons/fi";
import { MdVerified } from "react-icons/md";
import Image from "next/image";
import { api } from "@/lib/api";

interface ProviderDetails {
  id: string;
  email: string;
  fullName: string;
  professionalTitle: string;
  status?: string;
  officePhoneNumber?: string;
  specialties?: string[];
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

interface School {
  id: string;
  name: string;
  joinedDate: string;
  isAssociated: boolean;
}

interface Partner {
  id: string;
  name: string;
  joinedDate: string;
  isAssociated: boolean;
}

interface ProviderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  providerEmail: string;
}

const ProviderDetailsModal = ({
  isOpen,
  onClose,
  providerEmail,
}: ProviderDetailsModalProps) => {
  const [provider, setProvider] = useState<ProviderDetails | null>(null);
  const [schools, setSchools] = useState<School[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for schools and partners
  const mockSchools: School[] = [
    {
      id: "1",
      name: "Achimota High School",
      joinedDate: "3d ago",
      isAssociated: true,
    },
    {
      id: "2",
      name: "Achimota High School",
      joinedDate: "3d ago",
      isAssociated: false,
    },
    {
      id: "3",
      name: "Achimota High School",
      joinedDate: "3d ago",
      isAssociated: false,
    },
  ];

  const mockPartners: Partner[] = [
    {
      id: "1",
      name: "SRC Prempeh College",
      joinedDate: "3d ago",
      isAssociated: true,
    },
    {
      id: "2",
      name: "OKB Hope Foundation",
      joinedDate: "3d ago",
      isAssociated: true,
    },
    {
      id: "3",
      name: "Mental Health Authority",
      joinedDate: "3d ago",
      isAssociated: false,
    },
    {
      id: "4",
      name: "SRC Prempeh College",
      joinedDate: "3d ago",
      isAssociated: false,
    },
    {
      id: "5",
      name: "OKB Hope Foundation",
      joinedDate: "3d ago",
      isAssociated: false,
    },
  ];

  const loadProviderDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("curatorToken");
      if (!token) return;

      // Load provider details
      const response = await api.getProvider(providerEmail, { token });
      if (response.success) {
        setProvider(response.data);
      } else {
        // Use mock data for testing
        setProvider({
          id: "1",
          email: providerEmail,
          fullName: "Prof. Frances Kwame Nkrumah",
          professionalTitle: "Clinical Psychologist",
          status: "We're all alone in this together. Let's talk!",
          officePhoneNumber: "0538920991",
          specialties: ["Clinical Psychology", "Mental Health"],
          profileImage: "/auth/lawyer.jpg",
          createdAt: "2024-01-15T10:30:00Z",
          updatedAt: "2024-01-15T10:30:00Z",
        });
      }

      // Set mock data for schools and partners
      setSchools(mockSchools);
      setPartners(mockPartners);
    } catch (error) {
      console.error("Error loading provider details:", error);
      // Use mock data as fallback
      setProvider({
        id: "1",
        email: providerEmail,
        fullName: "Prof. Frances Kwame Nkrumah",
        professionalTitle: "Clinical Psychologist",
        status: "We're all alone in this together. Let's talk!",
        officePhoneNumber: "0538920991",
        specialties: ["Clinical Psychology", "Mental Health"],
        profileImage: "/auth/lawyer.jpg",
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-15T10:30:00Z",
      });
      setSchools(mockSchools);
      setPartners(mockPartners);
    } finally {
      setIsLoading(false);
    }
  }, [providerEmail, api]);

  useEffect(() => {
    if (isOpen && providerEmail) {
      loadProviderDetails();
    }
  }, [isOpen, providerEmail, loadProviderDetails]);

  const handleToggleAssociation = (type: "school" | "partner", id: string) => {
    if (type === "school") {
      setSchools((prev) =>
        prev.map((school) =>
          school.id === id
            ? { ...school, isAssociated: !school.isAssociated }
            : school
        )
      );
    } else {
      setPartners((prev) =>
        prev.map((partner) =>
          partner.id === id
            ? { ...partner, isAssociated: !partner.isAssociated }
            : partner
        )
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-md bg-black/30 flex items-center justify-center z-50 p-2 sm:p-4"
      onClick={onClose}>
      {/* Modal Container Wrapper */}
      <div className="relative max-w-4xl w-full">
        {/* Close Button - Positioned Above Modal */}
        <button
          title="Close"
          aria-label="Close modal"
          className="absolute -top-5 -right-5 sm:-top-6 sm:-right-6 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-red-500 via-red-600 to-rose-600 hover:from-red-600 hover:via-red-700 hover:to-rose-700 text-white rounded-full shadow-[0_4px_20px_rgba(239,68,68,0.6)] hover:shadow-[0_8px_30px_rgba(239,68,68,0.8)] transition-all duration-300 flex items-center justify-center z-[100] border-[6px] border-white group hover:scale-110 active:scale-95 ring-4 ring-red-300/50 hover:ring-red-400/70 animate-pulse-subtle backdrop-blur-sm"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}>
          <FiX className="w-7 h-7 sm:w-8 sm:h-8 font-bold stroke-[3.5] group-hover:rotate-180 transition-transform duration-300 drop-shadow-lg" />
          {/* Ripple effect on hover */}
          <span className="absolute inset-0 rounded-full bg-white/20 scale-0 group-hover:scale-100 group-hover:opacity-0 transition-all duration-500"></span>
        </button>

        {/* Modal Content */}
        <div
          className="bg-white/95 backdrop-blur-lg rounded-2xl border border-white/30 p-4 sm:p-6 lg:p-8 w-full shadow-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto scrollbar-hide"
          onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 lg:mb-8 gap-4 sm:gap-6 pr-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full">
              {/* Profile Image */}
              <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden flex-shrink-0 mx-auto sm:mx-0 shadow-2xl ring-4 ring-[#955aa4]/20">
                {provider?.profileImage ? (
                  <Image
                    src={provider.profileImage}
                    alt={provider.fullName}
                    width={192}
                    height={192}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#955aa4] to-[#7C4DFF] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-3xl sm:text-4xl lg:text-6xl">
                      {provider?.fullName?.charAt(0) || "P"}
                    </span>
                  </div>
                )}
              </div>

              {/* Provider Info */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-3">
                  <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold text-gray-800">
                    {provider?.fullName}
                  </h2>
                  <MdVerified className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-[#955aa4]" />
                </div>
                <p className="text-base sm:text-lg lg:text-xl text-[#955aa4] font-semibold mt-1 sm:mt-2">
                  {provider?.professionalTitle}
                </p>
                <p className="text-sm sm:text-base lg:text-lg text-gray-700 mt-1">
                  📞 {provider?.officePhoneNumber}
                </p>
                <p className="text-sm sm:text-base lg:text-lg text-gray-700 mt-1 break-words">{`Status: "${
                  provider?.status ||
                  "We're all alone in this together. Let's talk!"
                }"`}</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200/60 mb-6 lg:mb-8"></div>

          {/* Content Sections */}
          {(() => {
            const associatedSchools = schools.filter((s) => s.isAssociated);
            const availableSchools = schools.filter((s) => !s.isAssociated);
            const associatedPartners = partners.filter((p) => p.isAssociated);
            const availablePartners = partners.filter((p) => !p.isAssociated);

            return (
              <div className="space-y-6 lg:space-y-8">
                {/* Current Associations */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                  {/* Schools */}
                  <div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-3 lg:mb-4">
                      Schools ({associatedSchools.length})
                    </h3>
                    <div className="space-y-2 lg:space-y-3">
                      {associatedSchools.map((school) => (
                        <div
                          key={school.id}
                          className="flex items-center justify-between p-2 sm:p-3 bg-white/70 backdrop-blur-sm rounded-xl border border-white/30 shadow-sm">
                          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-[#955aa4] to-[#7C4DFF] rounded-lg flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-sm sm:text-base lg:text-lg">
                                🏫
                              </span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-sm sm:text-base lg:text-lg text-gray-900 truncate">
                                {school.name}
                              </p>
                              <p className="text-xs sm:text-sm text-gray-500">
                                Joined {school.joinedDate}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              handleToggleAssociation("school", school.id)
                            }
                            className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-full border-2 border-red-400 text-red-500 flex items-center justify-center hover:bg-red-50 transition-colors flex-shrink-0"
                            aria-label="Remove school">
                            <FiMinus className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Partners */}
                  <div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-3 lg:mb-4">
                      Partners ({associatedPartners.length})
                    </h3>
                    <div className="space-y-2 lg:space-y-3">
                      {associatedPartners.map((partner) => (
                        <div
                          key={partner.id}
                          className="flex items-center justify-between p-2 sm:p-3 bg-white/70 backdrop-blur-sm rounded-xl border border-white/30 shadow-sm">
                          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-sm sm:text-base lg:text-lg">
                                🤝
                              </span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-sm sm:text-base lg:text-lg text-gray-900 truncate">
                                {partner.name}
                              </p>
                              <p className="text-xs sm:text-sm text-gray-500">
                                Joined {partner.joinedDate}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              handleToggleAssociation("partner", partner.id)
                            }
                            className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-full border-2 border-red-400 text-red-500 flex items-center justify-center hover:bg-red-50 transition-colors flex-shrink-0"
                            aria-label="Remove partner">
                            <FiMinus className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200/60" />

                {/* Add More Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                  {/* Add More Schools */}
                  <div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-3 lg:mb-4">
                      Add More Schools ({availableSchools.length})
                    </h3>
                    <div className="space-y-2 lg:space-y-3">
                      {availableSchools.map((school) => (
                        <div
                          key={school.id}
                          className="flex items-center justify-between p-2 sm:p-3 bg-gray-100/50 backdrop-blur-sm rounded-xl border border-gray-200/50 opacity-60">
                          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gray-300/70 rounded-lg flex items-center justify-center flex-shrink-0">
                              <span className="text-gray-400 text-sm sm:text-base lg:text-lg">
                                🏫
                              </span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-sm sm:text-base lg:text-lg text-gray-400 truncate">
                                {school.name}
                              </p>
                              <p className="text-xs sm:text-sm text-gray-300">
                                Joined {school.joinedDate}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              handleToggleAssociation("school", school.id)
                            }
                            className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-full border-2 border-gray-400 text-gray-400 flex items-center justify-center hover:bg-gray-400/10 transition-colors flex-shrink-0"
                            aria-label="Add school">
                            <FiPlus className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Add More Partners */}
                  <div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-3 lg:mb-4">
                      Add More Partners ({availablePartners.length})
                    </h3>
                    <div className="space-y-2 lg:space-y-3">
                      {availablePartners.map((partner) => (
                        <div
                          key={partner.id}
                          className="flex items-center justify-between p-2 sm:p-3 bg-gray-100/50 backdrop-blur-sm rounded-xl border border-gray-200/50 opacity-60">
                          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gray-300/70 rounded-lg flex items-center justify-center flex-shrink-0">
                              <span className="text-gray-400 text-sm sm:text-base lg:text-lg">
                                🤝
                              </span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-sm sm:text-base lg:text-lg text-gray-400 truncate">
                                {partner.name}
                              </p>
                              <p className="text-xs sm:text-sm text-gray-300">
                                Joined {partner.joinedDate}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              handleToggleAssociation("partner", partner.id)
                            }
                            className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-full border-2 border-gray-400 text-gray-400 flex items-center justify-center hover:bg-gray-400/10 transition-colors flex-shrink-0"
                            aria-label="Add partner">
                            <FiPlus className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-6 lg:mt-8 pt-4 lg:pt-6 border-t border-gray-200/60">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-gray-200/70 backdrop-blur-sm text-gray-700 rounded-xl font-bold hover:bg-gray-300/70 transition-all duration-200 text-center">
              Close
            </button>
            <button
              onClick={() => {
                // Handle save changes
                console.log("Saving changes...");
                onClose();
              }}
              className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-[#955aa4] text-white rounded-xl font-bold hover:bg-[#955aa4]/80 transition-all duration-200 shadow-lg hover:shadow-xl text-center">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDetailsModal;
