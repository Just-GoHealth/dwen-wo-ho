/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import JustGoHealth from "@/components/logo-purple";
import { Button } from "@/components/ui/button";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Star,
  Edit3,
  Settings,
  LogOut,
  Shield,
  Award,
  Users,
  FileText,
  Bell,
  Camera
} from "lucide-react";
import PendingVerificationModal from "@/components/modals/pending-verification";
import { api } from "@/lib/api";
import { ENDPOINTS } from "@/constants/endpoints";
import Image from "next/image";

const Profile = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "Dr. Amanda Gorman",
    title: "Clinical Psychologist",
    timeAgo: "2 hours ago"
  });

  // Mock data - in real app this would come from API/context
  const providerData = {
    name: "Dr. Sarah Johnson",
    title: "Family Medicine Physician",
    email: "sarah.johnson@healthcare.com",
    phone: "+1 (555) 123-4567",
    location: "123 Medical Center Dr, Health City, HC 12345",
    license: "MD-123456789",
    experience: "8 years",
    rating: 4.8,
    totalPatients: 1247,
    specialties: ["Family Medicine", "Preventive Care", "Chronic Disease Management"],
    education: "Harvard Medical School, 2015",
    certifications: ["Board Certified Family Medicine", "ACLS Certified"],
    availability: {
      monday: "9:00 AM - 5:00 PM",
      tuesday: "9:00 AM - 5:00 PM",
      wednesday: "9:00 AM - 3:00 PM",
      thursday: "9:00 AM - 5:00 PM",
      friday: "9:00 AM - 4:00 PM",
      saturday: "Closed",
      sunday: "Closed"
    },
    profileImage: "/auth/lawyer.jpg"
  };

  // Check verification status
  const checkVerificationStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.push('/provider/signin');
        return;
      }

      const response = await api(ENDPOINTS.profile, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.success && response.data) {
        const profile = response.data;
        setIsVerified(profile.isVerified || false);

        if (!profile.isVerified) {
          setUserInfo({
            name: profile.fullName || "Dr. Amanda Gorman",
            title: profile.professionalTitle || "Clinical Psychologist",
            timeAgo: "2 hours ago"
          });
          setShowPendingModal(true);
        }
      } else {
        // If profile fetch fails, assume not verified
        setIsVerified(false);
        setShowPendingModal(true);
      }
    } catch (error) {
      console.error('Error checking verification status:', error);
      // On error, assume not verified
      setIsVerified(false);
      setShowPendingModal(true);
    }
  }, [router, api]);

  useEffect(() => {
    checkVerificationStatus();

    // Check every 10 seconds
    const interval = setInterval(checkVerificationStatus, 10000);

    return () => clearInterval(interval);
  }, [checkVerificationStatus]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    router.push("/provider/signin");
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "schedule", label: "Schedule", icon: Calendar },
    { id: "patients", label: "Patients", icon: Users },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <JustGoHealth />
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-600">
                <Bell className="w-5 h-5" />
              </Button>
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700"
              >
                <Image
                  src="/arrow-diagonal.png"
                  alt="Arrow right"
                  width={32}
                  height={32}
                  className="w-8 h-8 hover:scale-125 transition-all duration-300"
                />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            {/* Profile Image */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
                <Image
                  width={128}
                  height={128}
                  src={providerData.profileImage}
                  alt={providerData.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <Button
                size="sm"
                className="absolute -bottom-2 -right-2 rounded-full w-10 h-10 p-0"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {providerData.name}
                  </h1>
                  <p className="text-xl text-[#955aa4] font-semibold mb-4">
                    {providerData.title}
                  </p>

                  <div className="flex items-center space-x-6 mb-4">
                    <div className="flex items-center space-x-2">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="font-semibold text-gray-900">
                        {providerData.rating}
                      </span>
                      <span className="text-gray-500">({providerData.totalPatients} patients)</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Award className="w-5 h-5" />
                      <span>{providerData.experience} experience</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {providerData.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-[#955aa4]/10 text-[#955aa4] rounded-full text-sm font-medium"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                <Button className="bg-[#955aa4] hover:bg-[#955aa4]/90 text-white">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                        ? "border-[#955aa4] text-[#955aa4]"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* Contact Information */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{providerData.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{providerData.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 md:col-span-2">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="font-medium">{providerData.location}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Professional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">License Number</p>
                        <p className="font-medium">{providerData.license}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Award className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Education</p>
                        <p className="font-medium">{providerData.education}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <p className="text-sm text-gray-500 mb-2">Certifications</p>
                    <div className="space-y-2">
                      {providerData.certifications.map((cert, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-[#955aa4] rounded-full"></div>
                          <span className="text-sm">{cert}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Stats</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#955aa4]/5 rounded-xl p-6 text-center">
                      <Users className="w-8 h-8 text-[#955aa4] mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900">{providerData.totalPatients}</p>
                      <p className="text-sm text-gray-600">Total Patients</p>
                    </div>
                    <div className="bg-green-50 rounded-xl p-6 text-center">
                      <Star className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900">{providerData.rating}</p>
                      <p className="text-sm text-gray-600">Average Rating</p>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-6 text-center">
                      <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900">{providerData.experience}</p>
                      <p className="text-sm text-gray-600">Experience</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "schedule" && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Weekly Schedule</h3>
                <div className="space-y-4">
                  {Object.entries(providerData.availability).map(([day, hours]) => (
                    <div key={day} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="font-medium capitalize">{day}</span>
                      <span className="text-gray-600">{hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "patients" && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Patient Management</h3>
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Patient management features coming soon</p>
                </div>
              </div>
            )}

            {activeTab === "documents" && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Documents & Files</h3>
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Document management features coming soon</p>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Account Settings</h3>
                <div className="space-y-6">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium mb-2">Change Password</h4>
                    <p className="text-sm text-gray-600 mb-4">Update your account password</p>
                    <Button variant="outline">Change Password</Button>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium mb-2">Notification Preferences</h4>
                    <p className="text-sm text-gray-600 mb-4">Manage your notification settings</p>
                    <Button variant="outline">Manage Notifications</Button>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium mb-2">Privacy Settings</h4>
                    <p className="text-sm text-gray-600 mb-4">Control your privacy and data sharing</p>
                    <Button variant="outline">Privacy Settings</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pending Verification Modal */}
      <PendingVerificationModal
        isOpen={showPendingModal}
        onClose={() => setShowPendingModal(false)}
        userInfo={userInfo}
      />
    </div>
  );
};

export default Profile;