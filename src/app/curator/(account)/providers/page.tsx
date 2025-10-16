"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MdHealthAndSafety } from "react-icons/md";
import { FiChevronDown } from "react-icons/fi";
import WidthConstraint from "@/components/ui/width-constraint";
import { api } from "@/lib/api";
import { ROUTES } from "@/constants/routes";
import ProviderDetailsModal from "@/components/modals/provider-details";

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

export default function ProvidersPage() {
  const [filter, setFilter] = useState("All");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showProviderModal, setShowProviderModal] = useState(false);
  const [selectedProviderEmail, setSelectedProviderEmail] = useState("");
  const [providers, setProviders] = useState<Provider[]>([]);
  const router = useRouter();

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

        const response = await api.getProviders({ token });

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

  const handleProviderSelect = (providerEmail: string) => {
    setSelectedProviderEmail(providerEmail);
    setShowProviderModal(true);
  };

  const filteredProviders = providers.filter((provider) => {
    if (filter === "All") return true;
    return provider.status.toLowerCase() === filter.toLowerCase();
  });

  return (
    <WidthConstraint>
      <div className="flex flex-col gap-6 p-6">
        {/* Header */}
        <div className="flex items-center mb-4 lg:mb-6 gap-4">
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-lg px-4 lg:px-6 py-3 lg:py-4 shadow-sm border w-full">
              <h1 className="text-xl lg:text-2xl font-bold text-[#955aa4] flex items-center gap-2">
                <MdHealthAndSafety className="text-xl lg:text-2xl" />
                <span className="hidden sm:inline">All Providers</span>
                <span className="sm:hidden">Providers</span>
                <span>· {filteredProviders.length}</span>
              </h1>
            </div>
          </div>

          {/* Filter Dropdown */}
          <div className="relative ml-2 flex-shrink-0">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center gap-2 px-4 lg:px-6 py-2 lg:py-3 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200 justify-between min-w-[120px]"
            >
              <span>{filter}</span>
              <FiChevronDown
                className="w-4 h-4 transition-transform duration-200"
                style={{
                  transform: showFilterDropdown
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                }}
              />
            </button>

            {showFilterDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden">
                <button
                  onClick={() => {
                    setFilter("All");
                    setShowFilterDropdown(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center justify-between transition-colors"
                >
                  <span className="font-medium">All</span>
                  {filter === "All" && (
                    <span className="text-[#955aa4] text-lg">✓</span>
                  )}
                </button>
                <button
                  onClick={() => {
                    setFilter("Active");
                    setShowFilterDropdown(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium">Active</span>
                </button>
                <button
                  onClick={() => {
                    setFilter("Inactive");
                    setShowFilterDropdown(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium">Inactive</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Providers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4">
          {filteredProviders.map((provider) => (
            <div
              key={provider.id}
              onClick={() => handleProviderSelect(provider.email)}
              className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-[#955aa4]/50 group hover:scale-[1.02]"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#955aa4] to-[#7C4DFF] flex items-center justify-center flex-shrink-0 shadow-md">
                  <MdHealthAndSafety className="text-white text-xl" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 group-hover:text-[#955aa4] transition-colors text-base lg:text-lg truncate mb-1">
                    {provider.fullName}
                  </h3>
                  <p className="text-gray-600 text-sm lg:text-base truncate mb-1">
                    {provider.professionalTitle}
                  </p>
                  {provider.lastActive && (
                    <p className="text-orange-500 text-xs lg:text-sm font-medium">
                      {provider.lastActive}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex justify-center">
                <div
                  className={`px-4 py-2 rounded-full font-semibold text-sm shadow-sm ${
                    provider.status === "Active"
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : provider.status === "Inactive"
                      ? "bg-gray-100 text-gray-600 border border-gray-200"
                      : "bg-gray-100 text-gray-600 border border-gray-200"
                  }`}
                >
                  {provider.status}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Provider Details Modal */}
        <ProviderDetailsModal
          isOpen={showProviderModal}
          onClose={() => setShowProviderModal(false)}
          providerEmail={selectedProviderEmail}
        />
      </div>
    </WidthConstraint>
  );
}
