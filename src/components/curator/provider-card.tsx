"use client";

import Image from "next/image";
import { timeAgo } from "@/lib/utils/timeAgo";
import { Provider } from "@/hooks/queries/useProvidersQuery";
import { FiCheck, FiX, FiChevronRight } from "react-icons/fi";

interface ProviderCardProps {
  provider: Provider;
  onViewDetails: (email: string) => void;
  onShowApproveModal: (email: string) => void;
  onShowRejectModal: (email: string) => void;
  isModerating?: boolean;
  currentAction?: "approving" | "rejecting" | null;
}

const ProviderCard = ({ 
  provider, 
  onViewDetails,
  onShowApproveModal,
  onShowRejectModal,
  isModerating = false,
  currentAction = null,
}: ProviderCardProps) => {
  const defaultImage = "/auth/lawyer.jpg";

  const handleApproveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShowApproveModal(provider.email);
  };

  const handleRejectClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShowRejectModal(provider.email);
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewDetails(provider.email);
  };

  return (
    <div
      className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-[#955aa4]/50 group hover:scale-[1.02] flex flex-col items-center w-full"
    >
      {/* Provider Image - Centered at Top */}
      <div className="w-16 h-16 rounded-full overflow-hidden mb-4 ring-4 ring-gray-100 group-hover:ring-[#955aa4]/20 transition-all duration-300">
        <Image
          src={provider.profilePhotoURL || defaultImage}
          alt={provider.providerName}
          width={64}
          height={64}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Provider Info - Centered */}
      <div className="text-center w-full">
        <h3 className="font-bold text-gray-900 group-hover:text-[#955aa4] transition-colors text-lg mb-2 truncate px-1">
          {provider.providerName}
        </h3>
        <p className="text-gray-600 text-sm mb-3 truncate px-1">
          {provider.specialty || "General Practice"}
        </p>
        
        {/* Time Added */}
        <p className="text-orange-500 text-xs font-medium mb-4">
          Added {timeAgo(provider.applicationDate)}
        </p>

        {/* Status Badge or Action Buttons */}
        <div className="flex gap-2 justify-center w-full px-1">
          {provider.applicationStatus === "APPROVED" ? (
            <>
              <div className="flex-1 flex items-center justify-center gap-1 px-4 py-2 bg-green-100 text-green-700 rounded-lg font-semibold text-sm border border-green-200">
                <FiCheck className="w-4 h-4" />
                Approved
              </div>
              <button
                onClick={handleRejectClick}
                disabled={isModerating}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-red-600 rounded-lg font-semibold text-sm transition-all duration-200 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
            </>
          ) : provider.applicationStatus === "REJECTED" ? (
            <>
              <button
                onClick={handleApproveClick}
                disabled={isModerating}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-black hover:bg-gray-900 text-white rounded-lg font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
              <div className="flex-1 flex items-center justify-center gap-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold text-sm border border-red-200">
                <FiX className="w-4 h-4" />
                Rejected
              </div>
            </>
          ) : (
            <>
              <button
                onClick={handleApproveClick}
                disabled={isModerating}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-black hover:bg-gray-900 text-white rounded-lg font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-red-600 rounded-lg font-semibold text-sm transition-all duration-200 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
            </>
          )}
        </div>

        {/* View Details Button */}
        <button
          onClick={handleViewDetails}
          className="mt-3 text-sm text-gray-600 hover:text-[#955aa4] transition-colors underline flex items-center gap-1"
        >
          View Details
          <FiChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ProviderCard;
