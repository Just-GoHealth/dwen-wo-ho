"use client";

import Image from "next/image";
import { Users, Handshake, TrendingUp, Calendar } from "lucide-react";
import { MdSchool, MdLocationOn } from "react-icons/md";
import { School } from "@/types/school";

interface SchoolProvider {
  id: string;
  providerName: string;
  email: string;
  specialty: string | null;
  officePhoneNumber: string | null;
  applicationStatus: string;
  profilePhotoURL: string | null;
}

interface Partner {
  id: string;
  name: string;
  nickname: string;
  slogan: string;
  logo: string;
}

interface SchoolReachResponse {
  schoolName: string;
  reach: number;
}

interface OverviewTabProps {
  school: School;
}

export const OverviewTab = ({ school }: OverviewTabProps) => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">School Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-start gap-3">
          <MdSchool className="w-5 h-5 text-[#955aa4] mt-1" />
          <div>
            <p className="text-sm text-gray-500">Type</p>
            <p className="font-medium">{school.type}</p>
          </div>
        </div>
        {school.campuses && school.campuses.length > 0 && (
          <div className="flex items-start gap-3">
            <MdLocationOn className="w-5 h-5 text-[#955aa4] mt-1" />
            <div>
              <p className="text-sm text-gray-500">Campuses</p>
              <p className="font-medium">{school.campuses.join(", ")}</p>
            </div>
          </div>
        )}
        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-[#955aa4] mt-1" />
          <div>
            <p className="text-sm text-gray-500">Created</p>
            <p className="font-medium">{new Date(school.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

interface ProvidersTabProps {
  providers: SchoolProvider[];
  isLoading: boolean;
  onProviderClick: (provider: SchoolProvider) => void;
}

export const ProvidersTab = ({ providers, isLoading, onProviderClick }: ProvidersTabProps) => (
  <div>
    {isLoading ? (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#955aa4] mx-auto mb-4" />
        <p className="text-gray-500">Loading providers...</p>
      </div>
    ) : providers.length === 0 ? (
      <div className="text-center py-12">
        <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No providers found for this school</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {providers.map((provider) => (
          <button
            key={provider.email}
            onClick={() => onProviderClick(provider)}
            className="text-left bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors border border-gray-200 hover:border-[#955aa4] group"
          >
            <div className="flex items-start gap-3">
              {provider.profilePhotoURL ? (
                <Image
                  src={provider.profilePhotoURL}
                  alt={provider.providerName}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <Users className="w-6 h-6 text-gray-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 truncate group-hover:text-[#955aa4]">
                  {provider.providerName}
                </h4>
                {provider.specialty && (
                  <p className="text-sm text-gray-600 truncate">{provider.specialty}</p>
                )}
                <span
                  className={`inline-block mt-2 px-2 py-0.5 rounded text-xs font-medium ${
                    provider.applicationStatus === "APPROVED"
                      ? "bg-green-100 text-green-800"
                      : provider.applicationStatus === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {provider.applicationStatus}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    )}
  </div>
);

interface PartnersTabProps {
  partners: Partner[];
  isLoading: boolean;
}

export const PartnersTab = ({ partners, isLoading }: PartnersTabProps) => (
  <div>
    {isLoading ? (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#955aa4] mx-auto mb-4" />
        <p className="text-gray-500">Loading partners...</p>
      </div>
    ) : partners.length === 0 ? (
      <div className="text-center py-12">
        <Handshake className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No partners found for this school</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {partners.map((partner) => (
          <div key={partner.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-start gap-3">
              {partner.logo ? (
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <Handshake className="w-6 h-6 text-gray-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 truncate">{partner.name}</h4>
                {partner.nickname && (
                  <p className="text-sm text-gray-600 truncate">&quot;{partner.nickname}&quot;</p>
                )}
                {partner.slogan && (
                  <p className="text-xs text-gray-500 mt-1 truncate">{partner.slogan}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

interface ReachTabProps {
  reach: SchoolReachResponse | null;
  isLoading: boolean;
}

export const ReachTab = ({ reach, isLoading }: ReachTabProps) => (
  <div>
    {isLoading ? (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#955aa4] mx-auto mb-4" />
        <p className="text-gray-500">Loading reach data...</p>
      </div>
    ) : reach ? (
      <div className="max-w-md mx-auto">
        <div className="bg-gradient-to-br from-[#955aa4] to-[#7a4a88] rounded-2xl p-8 text-center text-white">
          <TrendingUp className="w-16 h-16 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Reach</h3>
          <p className="text-5xl font-extrabold mb-2">{reach.reach}</p>
          <p className="text-white/80">Total reach for {reach.schoolName}</p>
        </div>
      </div>
    ) : (
      <div className="text-center py-12">
        <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No reach data available</p>
      </div>
    )}
  </div>
);

export type { SchoolProvider, Partner, SchoolReachResponse };

