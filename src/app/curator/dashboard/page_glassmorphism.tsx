/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import JustGoHealth from "@/components/logo-purple";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { ENDPOINTS } from "@/constants/endpoints";
import { ROUTES } from "@/constants/routes";
import { ChevronDown, Plus, X } from "lucide-react";
import SchoolCreationModal from "@/components/modals/school-creation";
import MemberCreationModal from "@/components/modals/member-creation";
import ReachModal from "@/components/modals/reach";
import LineupModal from "@/components/modals/lineup";
import PartnerCreationModal from "@/components/modals/partner-creation";
import ProviderDetailsModal from "@/components/modals/provider-details";
import Image from "next/image";

interface School {
  id: string;
  name: string;
  nickname?: string;
  status: "Active" | "Inactive";
  lastActivity: string;
  activityType: string;
  avatar?: string;
}

interface Provider {
  id: string;
  email: string;
  fullName: string;
  professionalTitle: string;
  status: "Active" | "Inactive";
  createdAt: string;
  updatedAt: string;
  lastActive?: string;
}

const mockSchools: School[] = [
  {
    id: "1",
    name: "Achimota High School",
    status: "Active",
    lastActivity: "2m ago",
    activityType: "New Visit",
    avatar: "/auth/lawyer.jpg",
  },
  {
    id: "2",
    name: "Ashesi University",
    status: "Active",
    lastActivity: "2d ago",
    activityType: "New Provider",
  },
  {
    id: "3",
    name: "Korle-Bu NMTC",
    status: "Inactive",
    lastActivity: "2h ago",
    activityType: "New Screen",
    avatar: "/auth/man.jpg",
  },
  {
    id: "4",
    name: "Accra Technical Uni.",
    status: "Active",
    lastActivity: "Now",
    activityType: "New Results",
  },
  {
    id: "5",
    name: "KNUST",
    status: "Inactive",
    lastActivity: "2w ago",
    activityType: "Provider Visit",
  },
  {
    id: "6",
    name: "Achimota High School",
    status: "Active",
    lastActivity: "2m ago",
    activityType: "New Visit",
    avatar: "/auth/lawyer.jpg",
  },
];

const mockProviders: Provider[] = [
  {
    id: "1",
    email: "frances.kwame@example.com",
    fullName: "Dr. Frances Kwame Nkrumah",
    professionalTitle: "Clinical Psychologist",
    status: "Active",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
    lastActive: "2m ago",
  },
  {
    id: "2",
    email: "emily.owusu@example.com",
    fullName: "Prof. Emily Owusu",
    professionalTitle: "Clinical Psychologist",
    status: "Active",
    createdAt: "2024-01-14T14:20:00Z",
    updatedAt: "2024-01-14T14:20:00Z",
    lastActive: "3m ago",
  },
  {
    id: "3",
    email: "hannah.asan@example.com",
    fullName: "Ms. Hannah Yaa Asante",
    professionalTitle: "Mental Health Nurse",
    status: "Active",
    createdAt: "2024-01-13T09:15:00Z",
    updatedAt: "2024-01-13T09:15:00Z",
    lastActive: "5m ago",
  },
  {
    id: "4",
    email: "john.doe@example.com",
    fullName: "Dr. John Doe",
    professionalTitle: "Psychiatrist",
    status: "Active",
    createdAt: "2024-01-12T16:45:00Z",
    updatedAt: "2024-01-12T16:45:00Z",
    lastActive: "1h ago",
  },
  {
    id: "5",
    email: "sarah.smith@example.com",
    fullName: "Ms. Sarah Smith",
    professionalTitle: "Therapist",
    status: "Active",
    createdAt: "2024-01-11T11:30:00Z",
    updatedAt: "2024-01-11T11:30:00Z",
    lastActive: "2h ago",
  },
  {
    id: "6",
    email: "michael.brown@example.com",
    fullName: "Dr. Michael Brown",
    professionalTitle: "Family Medicine",
    status: "Inactive",
    createdAt: "2024-01-10T13:20:00Z",
    updatedAt: "2024-01-10T13:20:00Z",
    lastActive: "1d ago",
  },
];

const CuratorDashboard = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [filter, setFilter] = useState("All");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSchoolModal, setShowSchoolModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showReachModal, setShowReachModal] = useState(false);
  const [showLineupModal, setShowLineupModal] = useState(false);
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [showProviderModal, setShowProviderModal] = useState(false);
  const [selectedProviderEmail, setSelectedProviderEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    const savedTab = localStorage.getItem("curatorActiveTab");
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    localStorage.setItem("curatorActiveTab", tab);
  };

  const handleProviderSelect = (providerEmail: string) => {
    setSelectedProviderEmail(providerEmail);
    setShowProviderModal(true);
  };



  const [schools] = useState<School[]>(mockSchools);
  const [providers, setProviders] = useState<Provider[]>([]);



  useEffect(() => {
    const loadProviders = async () => {
      try {
        const token = localStorage.getItem("curatorToken");
        if (!token) {
          router.push(ROUTES.curator.signIn);
          return;
        }

        if (token.startsWith("temp-curator-token-")) {
          setProviders(mockProviders);
          return;
        }

        const response = await api(ENDPOINTS.providers, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.success) {
          setProviders(response.data || []);
        } else {
          setProviders(mockProviders);
        }
      } catch (error: any) {
        console.error("Error loading providers:", error);
        setProviders(mockProviders);
      }
    };

    loadProviders();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("curatorToken");
    router.push(ROUTES.curator.signIn);
  };

  const filteredSchools = schools.filter((school) => {
    if (filter === "All") return true;
    return school.status.toLowerCase() === filter.toLowerCase();
  });

  const filteredProviders = providers.filter((provider) => {
    if (filter === "All") return true;
    return provider.status.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 via-purple-500/10 to-cyan-500/20"></div>
      <div className="absolute inset-0 backdrop-blur-[100px]"></div>

      <div className="relative z-10 flex min-h-screen">
        <div className="w-72 backdrop-blur-xl bg-white/10 border-r border-white/20 flex flex-col fixed h-full shadow-2xl">
          <div className="p-8 border-b border-white/20">
            <div className="transform hover:scale-105 transition-transform duration-300">
              <JustGoHealth />
            </div>
          </div>

          <div className="flex-1 px-6 py-8">
            <nav className="space-y-4">
              <button
                onClick={() => handleTabChange("home")}
                className={`w-full text-left px-6 py-4 font-bold transition-all duration-300 transform hover:scale-105 ${activeTab === "home"
                  ? "bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-lg rounded-2xl"
                  : "text-gray-700 hover:bg-white/20 rounded-xl backdrop-blur-sm"
                  }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xl">🏠 Schools</span>
                  <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                    {schools.length}
                  </span>
                </div>
              </button>

              <button
                onClick={() => handleTabChange("providers")}
                className={`w-full text-left px-6 py-4 font-bold transition-all duration-300 transform hover:scale-105 ${activeTab === "providers"
                  ? "bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-lg rounded-2xl"
                  : "text-gray-700 hover:bg-white/20 rounded-xl backdrop-blur-sm"
                  }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xl">👩‍⚕️ Providers</span>
                  <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                    {providers.length}
                  </span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("pages")}
                className="w-full text-left px-6 py-4 rounded-xl font-bold text-gray-700 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
                <span className="text-xl">📄 Pages</span>
              </button>

              <button
                onClick={() => setShowCreateModal(true)}
                className="w-full text-left px-6 py-4 rounded-xl font-bold text-gray-700 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
                <span className="text-xl">✨ Create</span>
              </button>
            </nav>
          </div>

          <div className="p-6 border-t border-white/20">
            <Button
              onClick={() => setShowLogoutModal(true)}
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between w-full">
                <span>🚪 Logout</span>
                <Image
                  src="/arrow-diagonal-black.svg"
                  alt="Arrow right"
                  width={20}
                  height={20}
                  className="w-5 h-5 filter invert"
                />
              </div>
            </Button>
          </div>
        </div>

        <div className="flex-1 ml-72 overflow-y-auto">
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl px-8 py-4 shadow-lg">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                  {activeTab === "home"
                    ? `🏫 All Schools · ${filteredSchools.length}`
                    : `👩‍⚕️ All Providers · ${filteredProviders.length}`}
                </h1>
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  className="flex items-center gap-3 px-8 py-4 backdrop-blur-xl bg-white/10 border border-white/20 text-gray-700 rounded-2xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  <span className="text-lg">{filter}</span>
                  <ChevronDown
                    className="w-5 h-5 transition-transform duration-200"
                    style={{
                      transform: showFilterDropdown
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                    }}
                  />
                </button>

                {showFilterDropdown && (
                  <div className="absolute right-0 mt-2 w-48 backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-2xl z-20 overflow-hidden">
                    <button
                      onClick={() => {
                        setFilter("All");
                        setShowFilterDropdown(false);
                      }}
                      className="w-full text-left px-6 py-4 hover:bg-white/20 flex items-center justify-between transition-all duration-200">
                      <span className="font-medium">All</span>
                      {filter === "All" && (
                        <span className="text-purple-600 text-xl">✓</span>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setFilter("Active");
                        setShowFilterDropdown(false);
                      }}
                      className="w-full text-left px-6 py-4 hover:bg-white/20 transition-all duration-200">
                      <span className="font-medium">Active</span>
                    </button>
                    <button
                      onClick={() => {
                        setFilter("Inactive");
                        setShowFilterDropdown(false);
                      }}
                      className="w-full text-left px-6 py-4 hover:bg-white/20 transition-all duration-200">
                      <span className="font-medium">Inactive</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeTab === "home"
                ? filteredSchools.map((school) => (
                  <div
                    key={school.id}
                    className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 to-violet-500 flex items-center justify-center overflow-hidden shadow-lg">
                        {school.avatar ? (
                          <Image
                            width={56}
                            height={56}
                            src={school.avatar}
                            alt={school.name}
                            className="w-full h-full object-cover rounded-2xl"
                          />
                        ) : (
                          <span className="text-white text-2xl">🏫</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-800 group-hover:text-purple-600 transition-colors">
                          {school.name}
                        </h3>
                        <p className="text-red-500 text-sm font-medium">
                          📍 {school.activityType} • {school.lastActivity}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <button
                        className={`px-6 py-2 rounded-xl font-bold text-sm shadow-lg transform hover:scale-105 transition-all duration-300 ${school.status === "Active"
                          ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                          : "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
                          }`}>
                        {school.status}
                      </button>
                    </div>
                  </div>
                ))
                : filteredProviders.map((provider) => (
                  <div
                    key={provider.id}
                    onClick={() => handleProviderSelect(provider.email)}
                    className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer group">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center overflow-hidden shadow-lg">
                        <span className="text-white text-2xl">👩‍⚕️</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-800 group-hover:text-purple-600 transition-colors">
                          {provider.fullName}
                        </h3>
                        <p className="text-gray-600 text-sm font-medium">
                          {provider.professionalTitle}
                        </p>
                        {provider.lastActive && (
                          <p className="text-red-500 text-sm">
                            🕒 {provider.lastActive}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <div
                        className={`px-6 py-2 rounded-xl font-bold text-sm text-center shadow-lg transform hover:scale-105 transition-all duration-300 ${provider.status === "Active"
                          ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                          : provider.status === "Inactive"
                            ? "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
                            : "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
                          }`}>
                        {provider.status}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 backdrop-blur-lg bg-black/30 flex items-center justify-center z-50">
          <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
              Logout Confirmation
            </h2>
            <p className="text-center text-gray-600 mb-6">
              Are you sure you want to log out of JustGo Health?
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleLogout}
                className="flex-1 py-3 text-center font-bold text-lg bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300">
                Yes, Logout
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-3 text-center font-bold text-lg backdrop-blur-sm bg-white/20 border border-white/30 text-gray-700 rounded-xl hover:bg-white/30 transition-all duration-300">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 backdrop-blur-lg bg-black/30 flex items-center justify-center z-50">
          <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl p-8 max-w-4xl w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                  Creative Studios
                </h2>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-white/20 rounded-xl">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setShowSchoolModal(true);
                }}
                className="p-6 backdrop-blur-sm bg-white/10 border border-white/20 rounded-2xl hover:bg-white/20 transition-all duration-300 text-center group transform hover:scale-105">
                <div className="text-4xl mb-3">🏫</div>
                <h3 className="font-bold text-lg text-gray-800 group-hover:text-purple-600 transition-colors">
                  New Schools
                </h3>
              </button>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setShowMemberModal(true);
                }}
                className="p-6 backdrop-blur-sm bg-white/10 border border-white/20 rounded-2xl hover:bg-white/20 transition-all duration-300 text-center group transform hover:scale-105">
                <div className="text-4xl mb-3">👥</div>
                <h3 className="font-bold text-lg text-gray-800 group-hover:text-purple-600 transition-colors">
                  Our Team
                </h3>
              </button>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setShowPartnerModal(true);
                }}
                className="p-6 backdrop-blur-sm bg-white/10 border border-white/20 rounded-2xl hover:bg-white/20 transition-all duration-300 text-center group transform hover:scale-105">
                <div className="text-4xl mb-3">🤝</div>
                <h3 className="font-bold text-lg text-gray-800 group-hover:text-purple-600 transition-colors">
                  New Partners
                </h3>
              </button>
              <button className="p-6 backdrop-blur-sm bg-white/10 border border-white/20 rounded-2xl hover:bg-white/20 transition-all duration-300 text-center group transform hover:scale-105">
                <div className="text-4xl mb-3">📻</div>
                <h3 className="font-bold text-lg text-gray-800 group-hover:text-purple-600 transition-colors">
                  Radio
                </h3>
              </button>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setShowLineupModal(true);
                }}
                className="p-6 backdrop-blur-sm bg-white/10 border border-white/20 rounded-2xl hover:bg-white/20 transition-all duration-300 text-center group transform hover:scale-105">
                <div className="text-4xl mb-3">🏥</div>
                <h3 className="font-bold text-lg text-gray-800 group-hover:text-purple-600 transition-colors">
                  Health Lineup
                </h3>
              </button>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setShowReachModal(true);
                }}
                className="p-6 backdrop-blur-sm bg-white/10 border border-white/20 rounded-2xl hover:bg-white/20 transition-all duration-300 text-center group transform hover:scale-105">
                <div className="text-4xl mb-3">📢</div>
                <h3 className="font-bold text-lg text-gray-800 group-hover:text-purple-600 transition-colors">
                  Reach
                </h3>
              </button>
              <button className="p-6 backdrop-blur-sm bg-white/10 border border-white/20 rounded-2xl hover:bg-white/20 transition-all duration-300 text-center group transform hover:scale-105">
                <div className="text-4xl mb-3">🎨</div>
                <h3 className="font-bold text-lg text-gray-800 group-hover:text-purple-600 transition-colors">
                  Banner
                </h3>
              </button>
              <button className="p-6 backdrop-blur-sm bg-white/10 border border-white/20 rounded-2xl hover:bg-white/20 transition-all duration-300 text-center group transform hover:scale-105">
                <div className="text-4xl mb-3">🎉</div>
                <h3 className="font-bold text-lg text-gray-800 group-hover:text-purple-600 transition-colors">
                  Events
                </h3>
              </button>
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-8 py-3 backdrop-blur-sm bg-white/20 border border-white/30 text-gray-700 rounded-xl font-bold hover:bg-white/30 transition-all duration-300">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <SchoolCreationModal
        isOpen={showSchoolModal}
        onClose={() => {
          setShowSchoolModal(false);
          setShowCreateModal(true);
        }}
        onSchoolCreated={(school) => {
          console.log("School created:", school);
          setShowSchoolModal(false);
          setShowCreateModal(true);
        }}
      />

      <MemberCreationModal
        isOpen={showMemberModal}
        onClose={() => {
          setShowMemberModal(false);
          setShowCreateModal(true);
        }}
        onMemberCreated={(member) => {
          console.log("Member created:", member);
          setShowMemberModal(false);
          setShowCreateModal(true);
        }}
      />

      <ProviderDetailsModal
        isOpen={showProviderModal}
        onClose={() => setShowProviderModal(false)}
        providerEmail={selectedProviderEmail}
      />

      <ReachModal
        isOpen={showReachModal}
        onClose={() => {
          setShowReachModal(false);
          setShowCreateModal(true);
        }}
      />

      <LineupModal
        isOpen={showLineupModal}
        onClose={() => {
          setShowLineupModal(false);
          setShowCreateModal(true);
        }}
      />

      <PartnerCreationModal
        isOpen={showPartnerModal}
        onClose={() => {
          setShowPartnerModal(false);
          setShowCreateModal(true);
        }}
        onPartnerCreated={(partner) => {
          console.log("Partner created:", partner);
          setShowPartnerModal(false);
          setShowCreateModal(true);
        }}
      />
    </div>
  );
};

export default CuratorDashboard;
