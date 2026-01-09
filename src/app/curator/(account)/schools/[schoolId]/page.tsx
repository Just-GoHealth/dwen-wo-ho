"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import WidthConstraint from "@/components/ui/width-constraint";
import { api } from "@/lib/api";
import { ENDPOINTS } from "@/constants/endpoints";
import { ROUTES } from "@/constants/routes";
import { School } from "@/types/school";
import { ArrowLeft, Users, Handshake, TrendingUp, Pencil, Ban } from "lucide-react";
import { MdSchool } from "react-icons/md";
import { Button } from "@/components/ui/button";
import SchoolEditModal from "@/components/modals/school-edit";
import { useDisableSchool } from "@/hooks/queries/useSchoolsQuery";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import {
  OverviewTab,
  ProvidersTab,
  PartnersTab,
  ReachTab,
  SchoolProvider,
  Partner,
  SchoolReachResponse,
} from "@/components/curator/school-detail-tabs";

type TabType = "overview" | "providers" | "partners" | "reach";

interface SchoolProvidersResponse {
  id: number;
  name: string;
  logo: string;
  totalProviders: number;
  providers: SchoolProvider[];
}

interface SchoolPartnersResponse {
  id: number;
  name: string;
  logo: string;
  totalPartners: number;
  partners: Partner[];
}

export default function SchoolDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const schoolId = params.schoolId as string;

  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [school, setSchool] = useState<School | null>(null);
  const [providers, setProviders] = useState<SchoolProvider[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [reach, setReach] = useState<SchoolReachResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [providersLoading, setProvidersLoading] = useState(false);
  const [partnersLoading, setPartnersLoading] = useState(false);
  const [reachLoading, setReachLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const disableSchoolMutation = useDisableSchool();

  useEffect(() => {
    const loadSchoolDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api(ENDPOINTS.school(schoolId));
        if (response?.success && response.data) {
          setSchool(response.data);
        } else if (Array.isArray(response) && response.length > 0) {
          setSchool(response[0]);
        } else {
          setError("Failed to load school details");
        }
      } catch {
        setError("Failed to load school details");
      } finally {
        setIsLoading(false);
      }
    };

    if (schoolId) {
      loadSchoolDetails();
    }
  }, [schoolId]);

  useEffect(() => {
    if (activeTab === "providers" && providers.length === 0 && !providersLoading) {
      loadProviders();
    }
    if (activeTab === "partners" && partners.length === 0 && !partnersLoading) {
      loadPartners();
    }
    if (activeTab === "reach" && !reach && !reachLoading) {
      loadReach();
    }
  }, [activeTab, schoolId]);

  const loadProviders = async () => {
    setProvidersLoading(true);
    try {
      const response = await api(ENDPOINTS.schoolProviders(schoolId));
      if (response?.success && response.data) {
        const data = response.data as unknown as SchoolProvidersResponse;
        setProviders(data.providers || []);
      } else {
        const directResponse = response as unknown as SchoolProvidersResponse;
        if (directResponse?.providers) {
          setProviders(directResponse.providers || []);
        }
      }
    } catch {
    } finally {
      setProvidersLoading(false);
    }
  };

  const loadPartners = async () => {
    setPartnersLoading(true);
    try {
      const response = await api(ENDPOINTS.schoolPartners(schoolId));
      if (response?.success && response.data) {
        const data = response.data as unknown as SchoolPartnersResponse;
        setPartners(data.partners || []);
      } else {
        const directResponse = response as unknown as SchoolPartnersResponse;
        if (directResponse?.partners) {
          setPartners(directResponse.partners || []);
        }
      }
    } catch {
    } finally {
      setPartnersLoading(false);
    }
  };

  const loadReach = async () => {
    setReachLoading(true);
    try {
      const response = await api(ENDPOINTS.schoolReach(schoolId));
      if (response?.success && response.data) {
        setReach(response.data as unknown as SchoolReachResponse);
      } else {
        const directResponse = response as unknown as SchoolReachResponse;
        if (directResponse?.schoolName) {
          setReach(directResponse);
        }
      }
    } catch {
    } finally {
      setReachLoading(false);
    }
  };

  const handleProviderClick = (provider: SchoolProvider) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(`provider_${provider.email}`, JSON.stringify(provider));
    }
    router.push(`${ROUTES.curator.providerDetails}/${encodeURIComponent(provider.email)}`);
  };

  const handleSchoolUpdated = async () => {
    const response = await api(ENDPOINTS.school(schoolId));
    if (response?.success && response.data) {
      setSchool(response.data);
    }
  };

  const handleDisableSchool = () => {
    setShowDisableModal(true);
  };

  const handleDisableConfirm = async () => {
    if (!school) return;
    setIsActionLoading(true);
    try {
      await disableSchoolMutation.mutateAsync(String(school.id));
      router.push(ROUTES.curator.schools);
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "Failed to disable school");
    } finally {
      setIsActionLoading(false);
      setShowDisableModal(false);
    }
  };

  const tabs = [
    { id: "overview" as TabType, label: "Overview", icon: MdSchool },
    { id: "providers" as TabType, label: "Providers", icon: Users, count: providers.length },
    { id: "partners" as TabType, label: "Partners", icon: Handshake, count: partners.length },
    { id: "reach" as TabType, label: "Reach", icon: TrendingUp },
  ];

  if (isLoading) {
    return (
      <WidthConstraint>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#955aa4] mx-auto mb-4" />
            <p className="text-gray-500">Loading school details...</p>
          </div>
        </div>
      </WidthConstraint>
    );
  }

  if (error || !school) {
    return (
      <WidthConstraint>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <Button
            onClick={() => router.push(ROUTES.curator.schools)}
            variant="outline"
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Schools
          </Button>
          <p className="text-red-500">{error || "School not found"}</p>
        </div>
      </WidthConstraint>
    );
  }

  return (
    <WidthConstraint>
      <div className="flex flex-col gap-8 p-8">
        <div className="flex items-center justify-between">
          <Button
            onClick={() => router.push(ROUTES.curator.schools)}
            variant="outline"
            className="w-fit"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Schools
          </Button>

          <div className="flex gap-3">
            <Button
              onClick={() => setShowEditModal(true)}
              variant="outline"
              className="w-fit border-[#955aa4] text-[#955aa4] hover:bg-[#955aa4]/10"
            >
              <Pencil className="w-4 h-4 mr-2" />
              Edit School
            </Button>
            <Button
              onClick={handleDisableSchool}
              variant="outline"
              disabled={disableSchoolMutation.isPending}
              className="w-fit border-red-500 text-red-500 hover:bg-red-50"
            >
              <Ban className="w-4 h-4 mr-2" />
              {disableSchoolMutation.isPending ? "Disabling..." : "Disable"}
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-[#955aa4] to-[#7a4a88] p-8">
            <div className="flex items-start gap-6">
              {school.logo ? (
                <div className="w-24 h-24 rounded-2xl bg-white p-4 flex items-center justify-center shadow-lg">
                  <Image
                    src={school.logo}
                    alt={school.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-white/20 p-4 flex items-center justify-center">
                  <MdSchool className="text-white text-5xl" />
                </div>
              )}

              <div className="flex-1 text-white">
                <h1 className="text-4xl font-bold mb-2">{school.name}</h1>
                {school.nickname && (
                  <p className="text-xl text-white/90 mb-4">&quot;{school.nickname}&quot;</p>
                )}
                <div className="flex flex-wrap gap-4 text-sm">
                  <span className="px-3 py-1 rounded-full bg-white/20 font-medium">
                    {school.type}
                  </span>
                  {school.totalProviders !== undefined && (
                    <span className="px-3 py-1 rounded-full bg-white/20 font-medium">
                      {school.totalProviders} Providers
                    </span>
                  )}
                  {school.totalPartners !== undefined && (
                    <span className="px-3 py-1 rounded-full bg-white/20 font-medium">
                      {school.totalPartners} Partners
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-[#955aa4] text-[#955aa4]"
                      : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-xs font-medium">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-8">
            {activeTab === "overview" && <OverviewTab school={school} />}
            {activeTab === "providers" && (
              <ProvidersTab
                providers={providers}
                isLoading={providersLoading}
                onProviderClick={handleProviderClick}
              />
            )}
            {activeTab === "partners" && (
              <PartnersTab partners={partners} isLoading={partnersLoading} />
            )}
            {activeTab === "reach" && <ReachTab reach={reach} isLoading={reachLoading} />}
          </div>
        </div>
      </div>

      {school && (
        <>
          <SchoolEditModal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            school={school}
            onSchoolUpdated={handleSchoolUpdated}
          />
          <ConfirmationModal
            isOpen={showDisableModal}
            onClose={() => setShowDisableModal(false)}
            onConfirm={handleDisableConfirm}
            title="Disable School Confirmation"
            message={`Are you sure you want to disable ${school.name}? This action cannot be undone.`}
            confirmText="Yes, Disable"
            variant="danger"
            isLoading={isActionLoading}
          />
        </>
      )}
    </WidthConstraint>
  );
}
