"use client";

import { useState } from "react";
import Image from "next/image";
import { timeAgo } from "@/lib/utils/timeAgo";
import { Provider, useProvidersQuery } from "@/hooks/queries/useProvidersQuery";
import { FiCheck, FiX } from "react-icons/fi";

interface ProviderCardProps {
  provider: Provider;
  onClick: (email: string) => void;
}

type ModerationAction = "approving" | "rejecting" | null;

const ProviderCard = ({ provider, onClick }: ProviderCardProps) => {
  const defaultImage = "/auth/lawyer.jpg"; // Default fallback image
  const [currentAction, setCurrentAction] = useState<ModerationAction>(null);
  
  const { approveProvider, rejectProvider } = useProvidersQuery();

  const handleApprove = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    setCurrentAction("approving");
    approveProvider(provider.email, {
      onSettled: () => setCurrentAction(null),
    });
  };

  const handleReject = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    setCurrentAction("rejecting");
    rejectProvider(provider.email, {
      onSettled: () => setCurrentAction(null),
    });
  };

  const isModerating = currentAction !== null;

  return (
    <div
      onClick={() => onClick(provider.email)}
      className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-[#955aa4]/50 group hover:scale-[1.02] flex flex-col items-center"
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
        <h3 className="font-bold text-gray-900 group-hover:text-[#955aa4] transition-colors text-lg mb-1 truncate px-2">
          {provider.providerName}
        </h3>
        <p className="text-gray-600 text-sm mb-2 truncate px-2">
          {provider.specialty || "General Practice"}
        </p>
        
        {/* Time Added */}
        <p className="text-orange-500 text-xs font-medium mb-3">
          Added {timeAgo(provider.applicationDate)}
        </p>

        {/* Status Badge or Action Buttons */}
        {provider.applicationStatus === "PENDING" ? (
          <div className="flex gap-2 justify-center w-full px-2">
            <button
              onClick={handleApprove}
              disabled={isModerating}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-sm transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
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
              onClick={handleReject}
              disabled={isModerating}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-sm transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentAction === "rejecting" ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
        ) : provider.applicationStatus === "APPROVED" ? (
          <div className="flex justify-center w-full px-2">
            <button
              disabled
              className="w-full flex items-center justify-center gap-1 px-4 py-2 bg-green-100 text-green-700 rounded-lg font-semibold text-sm border border-green-200 cursor-not-allowed opacity-75"
            >
              <FiCheck className="w-4 h-4" />
              Approved
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="px-4 py-2 rounded-full font-semibold text-sm shadow-sm bg-red-100 text-red-700 border border-red-200">
              {provider.applicationStatus}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderCard;
