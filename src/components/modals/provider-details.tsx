/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, useCallback } from "react";
import { FiX, FiMail, FiPhone, FiCalendar, FiMapPin, FiAward, FiUsers, FiFileText, FiPlus, FiMinus } from "react-icons/fi";
import { MdVerified } from "react-icons/md";
import Image from "next/image";
import { api } from "@/lib/api";
import { timeAgo } from "@/lib/utils/timeAgo";
import { useProvidersQuery } from "@/hooks/queries/useProvidersQuery";
import { ProviderDetails, AssociatedSchool, AssociatedPartner } from "@/types/provider";
import { mockSchools, mockPartners } from "@/data/mock-provider-data";

interface ProviderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  providerEmail: string;
  provider?: ProviderDetails;
}

type TabType = "overview" | "schools" | "partners";

const ProviderDetailsModal = ({
  isOpen,
  onClose,
  providerEmail,
  provider: providerProp,
}: ProviderDetailsModalProps) => {
  const { useProvider } = useProvidersQuery();
  const { data: providerData, isLoading: isQueryLoading } = useProvider(providerEmail);
  
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [schools, setSchools] = useState<AssociatedSchool[]>([]);
  const [partners, setPartners] = useState<AssociatedPartner[]>([]);

  // Update local state when provider data is loaded
  useEffect(() => {
    if (providerData) {
      setSchools(mockSchools);
      setPartners(mockPartners);
    }
  }, [providerData]);

  // Reset tab when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab("overview");
    }
  }, [isOpen]);

  // Map providerData to the shape expected by the UI, or use passed prop
  const provider: ProviderDetails | null = providerData
    ? {
        ...providerData,
        fullName: providerData.providerName,
        professionalTitle: providerData.specialty,
        profileImage: providerData.profilePhotoURL,
        status: "We're all alone in this together. Let's talk!",
        officePhoneNumber: "0538920991",
        specialties: [providerData.specialty],
        createdAt: providerData.applicationDate,
        updatedAt: providerData.lastActive || providerData.applicationDate,
      }
    : providerProp || null;

  const showLoading = isQueryLoading && !provider;

  if (!isOpen) return null;

  const tabs = [
    { id: "overview" as TabType, label: "Overview", icon: FiFileText },
    { id: "schools" as TabType, label: "Schools", icon: FiAward, count: schools.filter(s => s.isAssociated).length },
    { id: "partners" as TabType, label: "Partners", icon: FiUsers, count: partners.filter(p => p.isAssociated).length },
  ];

  const handleToggleSchool = (id: string) => {
    setSchools((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isAssociated: !s.isAssociated } : s))
    );
  };

  const handleTogglePartner = (id: string) => {
    setPartners((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isAssociated: !p.isAssociated } : p))
    );
  };

  const getStatusBadge = () => {
    if (!provider?.applicationStatus) return null;
    
    const statusConfig = {
      PENDING: { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-200" },
      APPROVED: { bg: "bg-green-100", text: "text-green-700", border: "border-green-200" },
      REJECTED: { bg: "bg-red-100", text: "text-red-700", border: "border-red-200" },
    };

    const config = statusConfig[provider.applicationStatus];

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${config.bg} ${config.text} border ${config.border}`}>
        {provider.applicationStatus}
      </span>
    );
  };

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gray-900 p-6 flex items-center gap-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all duration-200 hover:rotate-90"
            aria-label="Close modal"
          >
            <FiX className="w-5 h-5" />
          </button>

          <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-white/30 shadow-lg shrink-0">

              <Image
                src={provider?.profileImage || "/auth/lawyer.jpg"}
                alt={provider?.fullName || "Provider"}
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            
          </div>

          <div className="text-white">
            <h2 className="text-2xl font-bold mb-1">
              {provider?.fullName || "Provider"}
            </h2>
            <p className="text-white/90 text-sm mb-2">
              {provider?.professionalTitle}
            </p>
            {getStatusBadge()}
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 mt-4 mb-4">
          <div className="flex gap-2 border-b border-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 font-semibold text-sm transition-all duration-200 border-b-2 ${
                    activeTab === tab.id
                      ? "border-[#955aa4] text-[#955aa4]"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      activeTab === tab.id
                        ? "bg-[#955aa4]/10 text-[#955aa4]"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {showLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-[#955aa4] rounded-full border-t-transparent animate-spin"></div>
              </div>
              <p className="text-gray-500 font-medium animate-pulse">Loading details...</p>
            </div>
          ) : (
            <>
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Status Message */}
                  {provider?.status && (
                    <div className="bg-gradient-to-r from-[#955aa4]/5 to-purple-50 rounded-xl p-4 border border-[#955aa4]/10">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <span className="text-lg">💬</span>
                        Status Message
                      </h4>
                      <p className="text-gray-700 italic">"{provider.status}"</p>
                    </div>
                  )}

                  {/* Contact Info Section */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <FiUsers className="w-5 h-5 text-[#955aa4]" />
                      Contact Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-500">
                          <FiMail className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Email Address</p>
                          <p className="text-sm font-medium text-gray-900">{provider?.email}</p>
                        </div>
                      </div>
                      {provider?.officePhoneNumber && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-500">
                            <FiPhone className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Phone Number</p>
                            <p className="text-sm font-medium text-gray-900">{provider.officePhoneNumber}</p>
                          </div>
                        </div>
                      )}
                      {provider?.applicationDate && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-500">
                            <FiCalendar className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Application Date</p>
                            <p className="text-sm font-medium text-gray-900">{timeAgo(provider.applicationDate)}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Specialties */}
                  {provider?.specialties && provider.specialties.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <FiAward className="w-5 h-5 text-[#955aa4]" />
                        Specialties
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {provider.specialties.map((specialty, index) => (
                          <span
                            key={index}
                            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-[#955aa4]/30 transition-colors"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Additional Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500 mb-1">Member Since</p>
                      <p className="font-semibold text-gray-900">
                        {provider?.createdAt ? new Date(provider.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        }) : 'N/A'}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500 mb-1">Last Updated</p>
                      <p className="font-semibold text-gray-900">
                        {provider?.updatedAt ? timeAgo(provider.updatedAt) : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Schools Tab */}
              {activeTab === "schools" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-gray-900">Associated Schools</h4>
                  </div>
                  {schools.filter((s) => s.isAssociated).length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <FiAward className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>No schools associated yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {schools.filter((s) => s.isAssociated).map((school) => (
                        <div key={school.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-[#955aa4]/30 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#955aa4] to-[#7C4DFF] rounded-lg flex items-center justify-center">
                              <span className="text-white text-lg">🏫</span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{school.name}</p>
                              <p className="text-sm text-gray-500">Joined {school.joinedDate}</p>
                            </div>
                          </div>
                          <button onClick={() => handleToggleSchool(school.id)} className="w-6 h-6 flex items-center justify-center rounded-full border-2 border-red-400 text-red-500 hover:bg-red-50 transition-colors" aria-label="Remove school">
                            <FiMinus className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Available Schools</h4>
                    {schools.filter((s) => !s.isAssociated).length === 0 ? (
                      <p className="text-gray-500">All schools are already associated.</p>
                    ) : (
                      <div className="space-y-3">
                        {schools.filter((s) => !s.isAssociated).map((school) => (
                          <div key={school.id} className="flex items-center justify-between p-4 bg-gray-100 border border-gray-200 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-300 rounded-lg flex items-center justify-center">
                                <span className="text-gray-600 text-lg">🏫</span>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">{school.name}</p>
                                <p className="text-sm text-gray-500">Joined {school.joinedDate}</p>
                              </div>
                            </div>
                            <button onClick={() => handleToggleSchool(school.id)} className="w-6 h-6 flex items-center justify-center rounded-full border-2 border-green-400 text-green-500 hover:bg-green-50 transition-colors" aria-label="Add school">
                              <FiPlus className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Partners Tab */}
              {activeTab === "partners" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-gray-900">Associated Partners</h4>
                  </div>
                  {partners.filter((p) => p.isAssociated).length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <FiUsers className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>No partners associated yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {partners.filter((p) => p.isAssociated).map((partner) => (
                        <div key={partner.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-[#955aa4]/30 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                              <span className="text-white text-lg">🤝</span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{partner.name}</p>
                              <p className="text-sm text-gray-500">Joined {partner.joinedDate}</p>
                            </div>
                          </div>
                          <button onClick={() => handleTogglePartner(partner.id)} className="w-6 h-6 flex items-center justify-center rounded-full border-2 border-red-400 text-red-500 hover:bg-red-50 transition-colors" aria-label="Remove partner">
                            <FiMinus className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Available Partners</h4>
                    {partners.filter((p) => !p.isAssociated).length === 0 ? (
                      <p className="text-gray-500">All partners are already associated.</p>
                    ) : (
                      <div className="space-y-3">
                        {partners.filter((p) => !p.isAssociated).map((partner) => (
                          <div key={partner.id} className="flex items-center justify-between p-4 bg-gray-100 border border-gray-200 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-300 rounded-lg flex items-center justify-center">
                                <span className="text-gray-600 text-lg">🤝</span>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">{partner.name}</p>
                                <p className="text-sm text-gray-500">Joined {partner.joinedDate}</p>
                              </div>
                            </div>
                            <button onClick={() => handleTogglePartner(partner.id)} className="w-6 h-6 flex items-center justify-center rounded-full border-2 border-green-400 text-green-500 hover:bg-green-50 transition-colors" aria-label="Add partner">
                              <FiPlus className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDetailsModal;
