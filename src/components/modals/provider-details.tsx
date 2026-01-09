"use client";

import { useState, useEffect, useMemo } from "react";
import { FiX, FiMail, FiPhone, FiCalendar, FiAward, FiUsers, FiFileText, FiPlus, FiMinus, FiSearch, FiCheck } from "react-icons/fi";
import { MdVerified } from "react-icons/md";
import Image from "next/image";
import { timeAgo } from "@/lib/utils/timeAgo";
import { useProvidersQuery } from "@/hooks/queries/useProvidersQuery";
import { useSchools } from "@/hooks/queries/useSchoolsQuery";
import { ProviderDetails, AssociatedSchool, AssociatedPartner } from "@/types/provider";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { api } from "@/lib/api";
import { ENDPOINTS } from "@/constants/endpoints";
import { toast } from "sonner";
import { School } from "@/types/school";

interface ProviderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  providerEmail: string;
  provider?: ProviderDetails;
  onShowApproveModal?: (email: string) => void;
  onShowRejectModal?: (email: string) => void;
  isModerating?: boolean;
  currentAction?: "approving" | "rejecting" | null;
}

type TabType = "overview" | "schools" | "partners";

const ProviderDetailsModal = ({
  isOpen,
  onClose,
  providerEmail,
  provider: providerProp,
  onShowApproveModal,
  onShowRejectModal,
  isModerating = false,
  currentAction = null,
}: ProviderDetailsModalProps) => {
  const { useProvider, approveProvider, rejectProvider } = useProvidersQuery();
  const { data: providerData, isLoading: isQueryLoading } = useProvider(providerEmail);
  const { data: allSchools = [] } = useSchools();
  
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [associatedSchools, setAssociatedSchools] = useState<AssociatedSchool[]>([]);
  const [availableSchools, setAvailableSchools] = useState<AssociatedSchool[]>([]);
  const [associatedPartners, setAssociatedPartners] = useState<AssociatedPartner[]>([]);
  const [availablePartners, setAvailablePartners] = useState<AssociatedPartner[]>([]);
  const [allPartners, setAllPartners] = useState<AssociatedPartner[]>([]);
  const [schoolSearchQuery, setSchoolSearchQuery] = useState("");
  const [partnerSearchQuery, setPartnerSearchQuery] = useState("");
  const [schoolToAdd, setSchoolToAdd] = useState<AssociatedSchool | null>(null);
  const [schoolToRemove, setSchoolToRemove] = useState<AssociatedSchool | null>(null);
  const [partnerToAdd, setPartnerToAdd] = useState<AssociatedPartner | null>(null);
  const [partnerToRemove, setPartnerToRemove] = useState<AssociatedPartner | null>(null);
  const [isLoadingSchools, setIsLoadingSchools] = useState(false);
  const [isLoadingPartners, setIsLoadingPartners] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    if (isOpen && providerEmail) {
      loadProviderSchools();
      loadAllPartners();
    }
  }, [isOpen, providerEmail]);

  useEffect(() => {
    if (isOpen && providerEmail && allPartners.length > 0) {
      loadProviderPartners(allPartners);
    }
  }, [allPartners.length, isOpen, providerEmail]);

  useEffect(() => {
    if (isOpen) {
      setActiveTab("overview");
      setSchoolSearchQuery("");
      setPartnerSearchQuery("");
    }
  }, [isOpen]);

  const loadProviderSchools = async () => {
    setIsLoadingSchools(true);
    try {
      const response = await api(ENDPOINTS.provider(providerEmail));
      if (response?.success && response.data) {
        const providerSchools = response.data.schools || [];
        const associatedIds = new Set(providerSchools.map((s: { id: string }) => s.id));
        
        const associated: AssociatedSchool[] = providerSchools.map((s: School) => ({
          id: String(s.id),
          name: s.name,
          logo: s.logo,
          isAssociated: true,
        }));

        const available: AssociatedSchool[] = allSchools
          .filter((s) => !associatedIds.has(String(s.id)))
          .map((s) => ({
            id: String(s.id),
            name: s.name,
            logo: s.logo,
            isAssociated: false,
          }));

        setAssociatedSchools(associated);
        setAvailableSchools(available);
      }
    } catch (error) {
      console.error("Failed to load provider schools:", error);
    } finally {
      setIsLoadingSchools(false);
    }
  };

  const loadAllPartners = async () => {
    try {
      const response = await api(ENDPOINTS.partners);
      if (response?.success && response.data) {
        const partnersList = Array.isArray(response.data) ? response.data : [];
        setAllPartners(partnersList.map((p: { id: string | number; name: string; logo?: string }) => ({
          id: String(p.id),
          name: p.name,
          logo: p.logo,
          isAssociated: false,
        })));
      }
    } catch (error) {
      console.error("Failed to load all partners:", error);
    }
  };

  const loadProviderPartners = async (partnersList: AssociatedPartner[] = allPartners) => {
    setIsLoadingPartners(true);
    try {
      const response = await api(ENDPOINTS.provider(providerEmail));
      if (response?.success && response.data) {
        const providerPartners = response.data.partners || [];
        const associatedIds = new Set(providerPartners.map((p: { id: string | number }) => String(p.id)));
        
        const associated: AssociatedPartner[] = providerPartners.map((p: { id: string | number; name: string; logo?: string }) => ({
          id: String(p.id),
          name: p.name,
          logo: p.logo,
          isAssociated: true,
        }));

        const available: AssociatedPartner[] = partnersList.length > 0
          ? partnersList.filter((p) => !associatedIds.has(p.id))
          : [];

        setAssociatedPartners(associated);
        setAvailablePartners(available);
      }
    } catch (error) {
      console.error("Failed to load provider partners:", error);
    } finally {
      setIsLoadingPartners(false);
    }
  };

  const filteredAvailableSchools = useMemo(() => {
    if (!schoolSearchQuery.trim()) return availableSchools;
    const query = schoolSearchQuery.toLowerCase();
    return availableSchools.filter((school) =>
      school.name.toLowerCase().includes(query)
    );
  }, [availableSchools, schoolSearchQuery]);

  const filteredAvailablePartners = useMemo(() => {
    if (!partnerSearchQuery.trim()) return availablePartners;
    const query = partnerSearchQuery.toLowerCase();
    return availablePartners.filter((partner) =>
      partner.name.toLowerCase().includes(query)
    );
  }, [availablePartners, partnerSearchQuery]);

  const provider: ProviderDetails | null = providerData
    ? {
        id: providerData.id || providerData.email,
        email: providerData.email,
        fullName: providerData.providerName,
        professionalTitle: providerData.specialty || "",
        profileImage: providerData.profilePhotoURL || undefined,
        status: providerData.bio || undefined, // Use bio from API if available, otherwise undefined
        officePhoneNumber: providerData.officePhoneNumber || undefined,
        specialties: providerData.specialty ? [providerData.specialty] : undefined,
        createdAt: providerData.applicationDate,
        updatedAt: providerData.lastActive || providerData.applicationDate,
        applicationStatus: providerData.applicationStatus,
        applicationDate: providerData.applicationDate,
      }
    : providerProp ?? null;

  const showLoading = isQueryLoading && !provider;

  if (!isOpen) return null;

  const tabs = [
    { id: "overview" as TabType, label: "Overview", icon: FiFileText },
    { 
      id: "schools" as TabType, 
      label: "Schools", 
      icon: FiAward, 
      count: associatedSchools.length 
    },
    { 
      id: "partners" as TabType, 
      label: "Partners", 
      icon: FiUsers, 
      count: associatedPartners.length 
    },
  ];

  const handleAddSchool = async (school: AssociatedSchool) => {
    try {
      const response = await api(ENDPOINTS.addSchoolToProvider(providerEmail), {
        method: "POST",
        body: JSON.stringify({ schoolId: school.id }),
      });
      
      if (response?.success) {
        toast.success(`School "${school.name}" added successfully`);
        await loadProviderSchools();
        setSchoolToAdd(null);
      }
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || "Failed to add school");
    }
  };

  const handleRemoveSchool = async (school: AssociatedSchool) => {
    try {
      const response = await api(ENDPOINTS.removeSchoolFromProvider(providerEmail), {
        method: "POST",
        body: JSON.stringify({ schoolId: school.id }),
      });
      
      if (response?.success) {
        toast.success(`School "${school.name}" removed successfully`);
        await loadProviderSchools();
        setSchoolToRemove(null);
      }
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || "Failed to remove school");
    }
  };

  const handleAddPartner = async (partner: AssociatedPartner) => {
    try {
      const response = await api(ENDPOINTS.addPartnerToProvider(providerEmail), {
        method: "POST",
        body: JSON.stringify({ partnerId: partner.id }),
      });
      
      if (response?.success) {
        toast.success(`Partner "${partner.name}" added successfully`);
        await loadProviderPartners(allPartners);
        setPartnerToAdd(null);
      }
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || "Failed to add partner");
    }
  };

  const handleRemovePartner = async (partner: AssociatedPartner) => {
    try {
      const response = await api(ENDPOINTS.removePartnerFromProvider(providerEmail), {
        method: "POST",
        body: JSON.stringify({ partnerId: partner.id }),
      });
      
      if (response?.success) {
        toast.success(`Partner "${partner.name}" removed successfully`);
        await loadProviderPartners(allPartners);
        setPartnerToRemove(null);
      }
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || "Failed to remove partner");
    }
  };

  useEffect(() => {
    if (allPartners.length > 0) {
      loadProviderPartners();
    }
  }, [allPartners.length]);

  const handleApproveClick = () => {
    if (onShowApproveModal) {
      onShowApproveModal(providerEmail);
    } else {
      setShowApproveModal(true);
    }
  };

  const handleRejectClick = () => {
    if (onShowRejectModal) {
      onShowRejectModal(providerEmail);
    } else {
      setShowRejectModal(true);
    }
  };

  const handleApproveConfirm = () => {
    setShowApproveModal(false);
    approveProvider(providerEmail, {
      onSettled: () => {
        if (providerData) {
          loadProviderSchools();
        }
      },
    });
  };

  const handleRejectConfirm = () => {
    setShowRejectModal(false);
    rejectProvider(providerEmail, {
      onSettled: () => {
        if (providerData) {
          loadProviderSchools();
        }
      },
    });
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
    <>
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
                src={provider?.profileImage ?? "/auth/lawyer.jpg"}
                alt={provider?.fullName ?? "Provider"}
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="text-white flex-1">
              <h2 className="text-2xl font-bold mb-1">
                {provider?.fullName ?? "Provider"}
              </h2>
              {provider?.professionalTitle && (
                <p className="text-white/90 text-sm mb-2">
                  {provider.professionalTitle}
                </p>
              )}
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

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            {showLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#955aa4] mb-4"></div>
                <p className="text-gray-500 font-medium">Loading provider details...</p>
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
                    {provider?.specialties && provider.specialties.length > 0 && provider.specialties.some(s => s && s.trim()) && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <FiAward className="w-5 h-5 text-[#955aa4]" />
                          Specialties
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {provider.specialties.filter(s => s && s.trim()).map((specialty, index) => (
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
                  <div className="space-y-6">
                    {/* Associated Schools */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Associated Schools</h4>
                      {isLoadingSchools ? (
                        <div className="text-center py-8 text-gray-500">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#955aa4] mx-auto mb-2"></div>
                          <p>Loading schools...</p>
                        </div>
                      ) : associatedSchools.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <FiAward className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                          <p>No schools associated yet</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {associatedSchools.map((school) => (
                            <div key={school.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-[#955aa4]/30 transition-colors">
                              <div className="flex items-center gap-3">
                                {school.logo ? (
                                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                                    <Image
                                      src={school.logo}
                                      alt={school.name}
                                      width={48}
                                      height={48}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="w-12 h-12 bg-gradient-to-br from-[#955aa4] to-[#7C4DFF] rounded-lg flex items-center justify-center flex-shrink-0">
                                    <FiAward className="w-6 h-6 text-white" />
                                  </div>
                                )}
                                <div>
                                  <p className="font-semibold text-gray-900">{school.name}</p>
                                </div>
                              </div>
                              <button 
                                onClick={() => setSchoolToRemove(school)} 
                                className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-red-400 text-red-500 hover:bg-red-50 transition-colors" 
                                aria-label="Remove school"
                              >
                                <FiMinus className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Available Schools */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Available Schools</h4>
                      {isLoadingSchools ? (
                        <div className="text-center py-4 text-gray-500">
                          <p>Loading...</p>
                        </div>
                      ) : (
                        <>
                          {/* Search Bar */}
                          <div className="relative mb-4">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FiSearch className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="text"
                              placeholder="Search schools..."
                              value={schoolSearchQuery}
                              onChange={(e) => setSchoolSearchQuery(e.target.value)}
                              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#955aa4]/20 focus:border-[#955aa4] transition-all text-gray-900 placeholder-gray-400"
                            />
                          </div>

                          {filteredAvailableSchools.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">
                              {schoolSearchQuery ? "No schools found matching your search." : "All schools are already associated."}
                            </p>
                          ) : (
                            <div className="space-y-3">
                              {filteredAvailableSchools.map((school) => (
                                <div key={school.id} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                                  <div className="flex items-center gap-3">
                                    {school.logo ? (
                                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                                        <Image
                                          src={school.logo}
                                          alt={school.name}
                                          width={48}
                                          height={48}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                    ) : (
                                      <div className="w-12 h-12 bg-gray-300 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <FiAward className="w-6 h-6 text-gray-600" />
                                      </div>
                                    )}
                                    <div>
                                      <p className="font-semibold text-gray-900">{school.name}</p>
                                    </div>
                                  </div>
                                  <button 
                                    onClick={() => setSchoolToAdd(school)} 
                                    className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-green-400 text-green-500 hover:bg-green-50 transition-colors" 
                                    aria-label="Add school"
                                  >
                                    <FiPlus className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Partners Tab */}
                {activeTab === "partners" && (
                  <div className="space-y-6">
                    {/* Associated Partners */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Associated Partners</h4>
                      {isLoadingPartners ? (
                        <div className="text-center py-8 text-gray-500">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#955aa4] mx-auto mb-2"></div>
                          <p>Loading partners...</p>
                        </div>
                      ) : associatedPartners.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <FiUsers className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                          <p>No partners associated yet</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {associatedPartners.map((partner) => (
                            <div key={partner.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-[#955aa4]/30 transition-colors">
                              <div className="flex items-center gap-3">
                                {partner.logo ? (
                                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                                    <Image
                                      src={partner.logo}
                                      alt={partner.name}
                                      width={48}
                                      height={48}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <FiUsers className="w-6 h-6 text-white" />
                                  </div>
                                )}
                                <div>
                                  <p className="font-semibold text-gray-900">{partner.name}</p>
                                </div>
                              </div>
                              <button 
                                onClick={() => setPartnerToRemove(partner)} 
                                className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-red-400 text-red-500 hover:bg-red-50 transition-colors" 
                                aria-label="Remove partner"
                              >
                                <FiMinus className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Available Partners */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Available Partners</h4>
                      {isLoadingPartners ? (
                        <div className="text-center py-4 text-gray-500">
                          <p>Loading...</p>
                        </div>
                      ) : (
                        <>
                          {/* Search Bar */}
                          <div className="relative mb-4">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FiSearch className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="text"
                              placeholder="Search partners..."
                              value={partnerSearchQuery}
                              onChange={(e) => setPartnerSearchQuery(e.target.value)}
                              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#955aa4]/20 focus:border-[#955aa4] transition-all text-gray-900 placeholder-gray-400"
                            />
                          </div>

                          {filteredAvailablePartners.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">
                              {partnerSearchQuery ? "No partners found matching your search." : "All partners are already associated."}
                            </p>
                          ) : (
                            <div className="space-y-3">
                              {filteredAvailablePartners.map((partner) => (
                                <div key={partner.id} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                                  <div className="flex items-center gap-3">
                                    {partner.logo ? (
                                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                                        <Image
                                          src={partner.logo}
                                          alt={partner.name}
                                          width={48}
                                          height={48}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                    ) : (
                                      <div className="w-12 h-12 bg-gray-300 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <FiUsers className="w-6 h-6 text-gray-600" />
                                      </div>
                                    )}
                                    <div>
                                      <p className="font-semibold text-gray-900">{partner.name}</p>
                                    </div>
                                  </div>
                                  <button 
                                    onClick={() => setPartnerToAdd(partner)} 
                                    className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-green-400 text-green-500 hover:bg-green-50 transition-colors" 
                                    aria-label="Add partner"
                                  >
                                    <FiPlus className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex justify-between items-center gap-3">
              {provider?.applicationStatus === "PENDING" && (
                <div className="flex gap-2 flex-1">
                  <button
                    onClick={handleApproveClick}
                    disabled={isModerating}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-black hover:bg-gray-900 text-white rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {currentAction === "approving" ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Approving...
                      </>
                    ) : (
                      <>
                        <FiCheck className="w-4 h-4" />
                        Approve
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleRejectClick}
                    disabled={isModerating}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-red-600 rounded-lg font-semibold transition-all duration-200 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {currentAction === "rejecting" ? (
                      <>
                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                        Rejecting...
                      </>
                    ) : (
                      <>
                        <FiX className="w-4 h-4" />
                        Reject
                      </>
                    )}
                  </button>
                </div>
              )}
              {provider?.applicationStatus === "APPROVED" && (
                <div className="flex gap-2 flex-1">
                  <div className="flex-1 flex items-center justify-center gap-1 px-4 py-2.5 bg-green-100 text-green-700 rounded-lg font-semibold text-sm border border-green-200">
                    <FiCheck className="w-4 h-4" />
                    Approved
                  </div>
                  <button
                    onClick={handleRejectClick}
                    disabled={isModerating}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-red-600 rounded-lg font-semibold transition-all duration-200 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {currentAction === "rejecting" ? (
                      <>
                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                        Rejecting...
                      </>
                    ) : (
                      <>
                        <FiX className="w-4 h-4" />
                        Reject
                      </>
                    )}
                  </button>
                </div>
              )}
              {provider?.applicationStatus === "REJECTED" && (
                <div className="flex gap-2 flex-1">
                  <button
                    onClick={handleApproveClick}
                    disabled={isModerating}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-black hover:bg-gray-900 text-white rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {currentAction === "approving" ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Approving...
                      </>
                    ) : (
                      <>
                        <FiCheck className="w-4 h-4" />
                        Approve
                      </>
                    )}
                  </button>
                  <div className="flex-1 flex items-center justify-center gap-1 px-4 py-2.5 bg-red-100 text-red-700 rounded-lg font-semibold text-sm border border-red-200">
                    <FiX className="w-4 h-4" />
                    Rejected
                  </div>
                </div>
              )}
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

      {/* Add School Confirmation Modal */}
      <ConfirmationModal
        isOpen={schoolToAdd !== null}
        onClose={() => setSchoolToAdd(null)}
        onConfirm={() => schoolToAdd && handleAddSchool(schoolToAdd)}
        title="Add School Confirmation"
        message={`Are you sure you want to add ${schoolToAdd?.name} to ${provider?.fullName || "this provider"}?`}
        confirmText="Yes, Add School"
        variant="success"
      />

      {/* Remove School Confirmation Modal */}
      <ConfirmationModal
        isOpen={schoolToRemove !== null}
        onClose={() => setSchoolToRemove(null)}
        onConfirm={() => schoolToRemove && handleRemoveSchool(schoolToRemove)}
        title="Remove School Confirmation"
        message={`Are you sure you want to remove ${schoolToRemove?.name} from ${provider?.fullName || "this provider"}?`}
        confirmText="Yes, Remove School"
        variant="danger"
      />

      {/* Add Partner Confirmation Modal */}
      <ConfirmationModal
        isOpen={partnerToAdd !== null}
        onClose={() => setPartnerToAdd(null)}
        onConfirm={() => partnerToAdd && handleAddPartner(partnerToAdd)}
        title="Add Partner Confirmation"
        message={`Are you sure you want to add ${partnerToAdd?.name} to ${provider?.fullName || "this provider"}?`}
        confirmText="Yes, Add Partner"
        variant="success"
      />

      {/* Remove Partner Confirmation Modal */}
      <ConfirmationModal
        isOpen={partnerToRemove !== null}
        onClose={() => setPartnerToRemove(null)}
        onConfirm={() => partnerToRemove && handleRemovePartner(partnerToRemove)}
        title="Remove Partner Confirmation"
        message={`Are you sure you want to remove ${partnerToRemove?.name} from ${provider?.fullName || "this provider"}?`}
        confirmText="Yes, Remove Partner"
        variant="danger"
      />

      {/* Approve Provider Confirmation Modal */}
      <ConfirmationModal
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        onConfirm={handleApproveConfirm}
        title="Approve Provider Confirmation"
        message={`Are you sure you want to approve ${provider?.fullName || "this provider"} as a provider?`}
        confirmText="Yes, Approve"
        variant="success"
        isLoading={currentAction === "approving"}
      />

      {/* Reject Provider Confirmation Modal */}
      <ConfirmationModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onConfirm={handleRejectConfirm}
        title="Reject Provider Confirmation"
        message={`Are you sure you want to reject ${provider?.fullName || "this provider"}'s provider application?`}
        confirmText="Yes, Reject"
        variant="danger"
        isLoading={currentAction === "rejecting"}
      />
    </>
  );
};

export default ProviderDetailsModal;
