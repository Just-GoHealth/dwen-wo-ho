/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import JustGoHealth from "@/components/logo-purple";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { ROUTES } from "@/constants/routes";
import { ENDPOINTS } from "@/constants/endpoints";
import LoadingOverlay from "@/components/ui/loading-overlay";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  FileText,
  Award,
  Camera,
} from "lucide-react";
import Image from "next/image";

interface ProviderDetails {
  id: string;
  email: string;
  fullName: string;
  professionalTitle: string;
  // status: "PENDING" | "APPROVED" | "REJECTED";
  officePhoneNumber?: string;
  status?: "PENDING" | "APPROVED" | "REJECTED";
  specialties?: string[];
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

const ProviderDetails = () => {
  const [provider, setProvider] = useState<ProviderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token") || localStorage.getItem("curatorToken");
      return !!token;
    }
    return null;
  });
  const params = useParams();
  const router = useRouter();
  const email = decodeURIComponent(params.email as string);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token") || localStorage.getItem("curatorToken");
      if (!token) {
        router.replace(ROUTES.provider.auth);
        setIsAuthenticated(false);
        return;
      }
      setIsAuthenticated(true);
    }
  }, [router]);

  useEffect(() => {
    if (isAuthenticated === false) return;
    
    const loadProvider = async () => {
      try {
        const token = localStorage.getItem("token") || localStorage.getItem("curatorToken") || "";

        const response = await api(ENDPOINTS.provider(email), {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.success) {
          setProvider(response.data);
          if (typeof window !== "undefined") {
            sessionStorage.removeItem(`provider_${email}`);
          }
        } else {
          setErrorMessage("Failed to load provider details");
          tryFallbackData();
        }
      } catch (error: unknown) {
        tryFallbackData();
      } finally {
        setIsLoading(false);
      }
    };

    const tryFallbackData = () => {
      if (typeof window !== "undefined") {
        const fallbackDataStr = sessionStorage.getItem(`provider_${email}`);
        if (fallbackDataStr) {
          try {
            const fallbackData = JSON.parse(fallbackDataStr);
            setProvider({
              id: fallbackData.email || "",
              email: fallbackData.email || "",
              fullName: fallbackData.providerName || "",
              professionalTitle: fallbackData.specialty || "",
              officePhoneNumber: fallbackData.officePhoneNumber || undefined,
              status: (fallbackData.applicationStatus as "PENDING" | "APPROVED" | "REJECTED") || "PENDING",
              profileImage: fallbackData.profilePhotoURL || undefined,
              createdAt: fallbackData.applicationDate || new Date().toISOString(),
              updatedAt: fallbackData.applicationDate || new Date().toISOString(),
            });
            setErrorMessage("");
            return;
          } catch {
          }
        }
      }
      setErrorMessage("Failed to load provider details. Please try again.");
    };

    if (isAuthenticated) {
      loadProvider();
    }
  }, [email, router, isAuthenticated]);

  const handleApprove = async () => {
    setIsActionLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const token = localStorage.getItem("curatorToken") || "";
      const response = await api(ENDPOINTS.approveProvider(email), {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.success) {
        setSuccessMessage("Provider approved successfully!");
        setProvider((prev) => (prev ? { ...prev, status: "APPROVED" } : null));
        // Refresh the page after 2 seconds
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setErrorMessage(response.message || "Failed to approve provider");
      }
    } catch (error: any) {
      console.error("Error approving provider:", error);
      setErrorMessage("Failed to approve provider. Please try again.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleReject = async () => {
    setIsActionLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const token = localStorage.getItem("curatorToken") || "";
      const response = await api(ENDPOINTS.rejectProvider(email), {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.success) {
        setSuccessMessage("Provider rejected successfully!");
        setProvider((prev) => (prev ? { ...prev, status: "REJECTED" } : null));
        // Refresh the page after 2 seconds
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setErrorMessage(response.message || "Failed to reject provider");
      }
    } catch (error: any) {
      console.error("Error rejecting provider:", error);
      setErrorMessage("Failed to reject provider. Please try again.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800 border-green-200";
      case "REJECTED":
        return "bg-red-100 text-red-800 border-red-200";
      case "PENDING":
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#955aa4] mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return null;
  }

  if (isLoading) {
    return (
      <LoadingOverlay text="Loading provider details..." isVisible={true} />
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Provider Not Found
          </h1>
          <Button onClick={() => router.push(ROUTES.curator.dashboard)}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <LoadingOverlay
        text="Processing request..."
        isVisible={isActionLoading}
      />

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => router.push(ROUTES.curator.dashboard)}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </Button>
              <JustGoHealth />
            </div>
            <div className="flex items-center space-x-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                  provider.status || "PENDING"
                )}`}
              >
                {provider.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600 text-center font-medium">
              {errorMessage}
            </p>
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-600 text-center font-medium">
              {successMessage}
            </p>
          </div>
        )}

        {/* Provider Profile Card */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
          <div className="px-6 py-8">
            <div className="flex items-start space-x-6">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                {provider.profileImage ? (
                  <Image
                    src={provider.profileImage}
                    alt="Profile"
                    width={120}
                    height={120}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-30 h-30 rounded-full bg-[#955aa4] flex items-center justify-center">
                    <User className="w-16 h-16 text-white" />
                  </div>
                )}
              </div>

              {/* Provider Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {provider.professionalTitle} {provider.fullName}
                </h1>
                <div className="flex items-center space-x-2 mb-4">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">{provider.email}</span>
                </div>

                {provider.officePhoneNumber && (
                  <div className="flex items-center space-x-2 mb-2">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">
                      {provider.officePhoneNumber}
                    </span>
                  </div>
                )}

                <div className="flex items-center space-x-2 mb-4">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">
                    Applied: {new Date(provider.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {provider.status && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Bio/Status
                    </h3>
                    <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                      {provider.status}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Specialties */}
        {provider.specialties && provider.specialties.length > 0 && (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
            <div className="px-6 py-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Award className="w-6 h-6 mr-2" />
                Specialties
              </h2>
              <div className="flex flex-wrap gap-2">
                {provider.specialties.map((specialty, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-[#955aa4] text-white rounded-full text-sm font-medium"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {provider.status === "PENDING" && (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Review Actions
              </h2>
              <div className="flex space-x-4">
                <Button
                  onClick={handleApprove}
                  disabled={isActionLoading}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>Approve Provider</span>
                </Button>
                <Button
                  onClick={handleReject}
                  disabled={isActionLoading}
                  variant="destructive"
                  className="flex items-center space-x-2 px-6 py-3"
                >
                  <XCircle className="w-5 h-5" />
                  <span>Reject Provider</span>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Status Message for Approved/Rejected */}
        {provider.status !== "PENDING" && (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-6 text-center">
              <div className="flex justify-center mb-4">
                {provider.status === "APPROVED" ? (
                  <CheckCircle className="w-16 h-16 text-green-500" />
                ) : (
                  <XCircle className="w-16 h-16 text-red-500" />
                )}
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Provider{" "}
                {provider.status === "APPROVED" ? "Approved" : "Rejected"}
              </h2>
              <p className="text-gray-600">
                This provider has been{" "}
                {provider.status === "APPROVED" ? "approved" : "rejected"} on{" "}
                {new Date(provider.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderDetails;
