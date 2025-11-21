"use client";

import React, { useState } from "react";
import { MdHealthAndSafety } from "react-icons/md";
import { FiChevronDown } from "react-icons/fi";
import WidthConstraint from "@/components/ui/width-constraint";
import ProviderDetailsModal from "@/components/modals/provider-details";
import { useProvidersQuery } from "@/hooks/queries/useProvidersQuery";
import { IProvider } from "@/types/provider.type";

export default function ProvidersPage() {
  const [filter, setFilter] = useState("All");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showProviderModal, setShowProviderModal] = useState(false);
  const [selectedProviderEmail, setSelectedProviderEmail] = useState("");

  // Fetch providers using the query hook
  const { providers, isLoading, isError, error } = useProvidersQuery();

  // Use providers data or empty array
  const providersList: IProvider[] = providers?.data || [];

  const handleProviderSelect = (providerEmail: string) => {
    setSelectedProviderEmail(providerEmail);
    setShowProviderModal(true);
  };

  const filteredProviders = providersList?.filter((provider) => {
    if (filter === "All") return true;
    return provider.applicationStatus.toLowerCase() === filter.toLowerCase();
  });

  // Loading state
  if (isLoading) {
    return (
      <WidthConstraint>
        <div className="flex flex-col gap-6 p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#955aa4] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading providers...</p>
            </div>
          </div>
        </div>
      </WidthConstraint>
    );
  }

  // Error state
  if (isError) {
    return (
      <WidthConstraint>
        <div className="flex flex-col gap-6 p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 font-medium mb-2">
              Failed to load providers
            </p>
            <p className="text-red-500 text-sm">
              {error?.message || "An error occurred"}
            </p>
          </div>
        </div>
      </WidthConstraint>
    );
  }

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
                    setFilter("APPROVED");
                    setShowFilterDropdown(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium">Approved</span>
                </button>
                <button
                  onClick={() => {
                    setFilter("PENDING");
                    setShowFilterDropdown(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium">Pending</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Providers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4">
          {filteredProviders.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <MdHealthAndSafety className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg font-medium">
                No providers found
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Providers will appear here once they are registered
              </p>
            </div>
          ) : (
            filteredProviders.map((provider) => (
              <div
                key={provider.email}
                onClick={() => handleProviderSelect(provider.email)}
                className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-[#955aa4]/50 group hover:scale-[1.02]"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#955aa4] to-[#7C4DFF] flex items-center justify-center flex-shrink-0 shadow-md">
                    <MdHealthAndSafety className="text-white text-xl" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 group-hover:text-[#955aa4] transition-colors text-base lg:text-lg truncate mb-1">
                      {provider.providerName}
                    </h3>
                    <p className="text-gray-600 text-sm lg:text-base truncate mb-1">
                      {provider.specialty}
                    </p>
                    {provider.applicationDate && (
                      <p className="text-orange-500 text-xs lg:text-sm font-medium">
                        {provider.applicationDate}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex justify-center">
                  <div
                    className={`px-4 py-2 rounded-full font-semibold text-sm shadow-sm ${
                      provider.applicationStatus === "APPROVED"
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : provider.applicationStatus === "PENDING"
                        ? "bg-gray-100 text-gray-600 border border-gray-200"
                        : "bg-gray-100 text-gray-600 border border-gray-200"
                    }`}
                  >
                    {provider.applicationStatus}
                  </div>
                </div>
              </div>
            ))
          )}
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
