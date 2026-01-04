
<<<<<<< HEAD
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { api } from "@/lib/api";
import { ENDPOINTS } from "@/constants/endpoints";
import { ROUTES } from "@/constants/routes";
import {
  FiChevronDown,
  FiX,

} from "react-icons/fi";
import { MdSchool, MdHealthAndSafety } from "react-icons/md";
import SchoolCreationModal from "@/components/modals/school-creation";
import MemberCreationModal from "@/components/modals/member-creation";
import ReachModal from "@/components/modals/reach";
import LineupModal from "@/components/modals/lineup";
import PartnerCreationModal from "@/components/modals/partner-creation";
import ProviderDetailsModal from "@/components/modals/provider-details";
import Image from "next/image";

=======
>>>>>>> origin/reaper

// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import JustGoHealth from "@/components/logo-purple";
// import { Button } from "@/components/ui/button";
// import { api } from "@/lib/api";
// import { ROUTES } from "@/constants/routes";
// import {
//   FiChevronDown,
//   FiX,
//   FiHome,
//   FiUsers,
//   FiFileText,
//   FiPlus,
//   FiLogOut,
//   FiArrowRight,
//   FiMenu,
// } from "react-icons/fi";
// import { MdSchool, MdHealthAndSafety } from "react-icons/md";
// import SchoolCreationModal from "@/components/modals/school-creation";
// import MemberCreationModal from "@/components/modals/member-creation";
// import ReachModal from "@/components/modals/reach";
// import LineupModal from "@/components/modals/lineup";
// import PartnerCreationModal from "@/components/modals/partner-creation";
// import ProviderDetailsModal from "@/components/modals/provider-details";
// import Image from "next/image";
// import { CuratorSidebar } from "@/components/curator/ui/sidebar";

<<<<<<< HEAD
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
=======
// interface School {
//   id: string;
//   name: string;
//   nickname?: string;
//   status: "Active" | "Inactive";
//   lastActivity: string;
//   activityType: string;
//   avatar?: string;
// }
>>>>>>> origin/reaper

// interface Provider {
//   id: string;
//   email: string;
//   fullName: string;
//   professionalTitle: string;
//   status: "Active" | "Inactive";
//   createdAt: string;
//   updatedAt: string;
//   lastActive?: string;
// }

<<<<<<< HEAD

=======
// const CuratorDashboard = () => {
//   const [activeTab, setActiveTab] = useState("home");
//   const [filter, setFilter] = useState("All");
//   const [showFilterDropdown, setShowFilterDropdown] = useState(false);
//   const [showLogoutModal, setShowLogoutModal] = useState(false);
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [showSchoolModal, setShowSchoolModal] = useState(false);
//   const [showMemberModal, setShowMemberModal] = useState(false);
//   const [showReachModal, setShowReachModal] = useState(false);
//   const [showLineupModal, setShowLineupModal] = useState(false);
//   const [showPartnerModal, setShowPartnerModal] = useState(false);
//   const [showProviderModal, setShowProviderModal] = useState(false);
//   const [selectedProviderEmail, setSelectedProviderEmail] = useState("");
//   const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
//   const router = useRouter();
>>>>>>> origin/reaper

//   useEffect(() => {
//     const savedTab = localStorage.getItem("curatorActiveTab");
//     if (savedTab) {
//       setActiveTab(savedTab);
//     }
//   }, []);

<<<<<<< HEAD

=======
//   const handleTabChange = (tab: string) => {
//     setActiveTab(tab);
//     localStorage.setItem("curatorActiveTab", tab);
//   };
>>>>>>> origin/reaper

//   const handleProviderSelect = (providerEmail: string) => {
//     setSelectedProviderEmail(providerEmail);
//     setShowProviderModal(true);
//   };

<<<<<<< HEAD

=======
//   const mockSchools: School[] = [
//     {
//       id: "1",
//       name: "Achimota High School",
//       status: "Active",
//       lastActivity: "2m ago",
//       activityType: "New Visit",
//       avatar: "/auth/lawyer.jpg",
//     },
//     {
//       id: "2",
//       name: "Ashesi University",
//       status: "Active",
//       lastActivity: "2d ago",
//       activityType: "New Provider",
//     },
//     {
//       id: "3",
//       name: "Korle-Bu NMTC",
//       status: "Inactive",
//       lastActivity: "2h ago",
//       activityType: "New Screen",
//       avatar: "/auth/man.jpg",
//     },
//     {
//       id: "4",
//       name: "Accra Technical Uni.",
//       status: "Active",
//       lastActivity: "Now",
//       activityType: "New Results",
//     },
//     {
//       id: "5",
//       name: "KNUST",
//       status: "Inactive",
//       lastActivity: "2w ago",
//       activityType: "Provider Visit",
//     },
//     {
//       id: "6",
//       name: "Achimota High School",
//       status: "Active",
//       lastActivity: "2m ago",
//       activityType: "New Visit",
//       avatar: "/auth/lawyer.jpg",
//     },
//   ];
>>>>>>> origin/reaper

//   const [schools] = useState<School[]>(mockSchools);
//   const [providers, setProviders] = useState<Provider[]>([]);

//   const mockProviders: Provider[] = [
//     {
//       id: "1",
//       email: "frances.kwame@example.com",
//       fullName: "Dr. Frances Kwame Nkrumah",
//       professionalTitle: "Clinical Psychologist",
//       status: "Active",
//       createdAt: "2024-01-15T10:30:00Z",
//       updatedAt: "2024-01-15T10:30:00Z",
//       lastActive: "2m ago",
//     },
//     {
//       id: "2",
//       email: "emily.owusu@example.com",
//       fullName: "Prof. Emily Owusu",
//       professionalTitle: "Clinical Psychologist",
//       status: "Active",
//       createdAt: "2024-01-14T14:20:00Z",
//       updatedAt: "2024-01-14T14:20:00Z",
//       lastActive: "3m ago",
//     },
//     {
//       id: "3",
//       email: "hannah.asan@example.com",
//       fullName: "Ms. Hannah Yaa Asante",
//       professionalTitle: "Mental Health Nurse",
//       status: "Active",
//       createdAt: "2024-01-13T09:15:00Z",
//       updatedAt: "2024-01-13T09:15:00Z",
//       lastActive: "5m ago",
//     },
//     {
//       id: "4",
//       email: "john.doe@example.com",
//       fullName: "Dr. John Doe",
//       professionalTitle: "Psychiatrist",
//       status: "Active",
//       createdAt: "2024-01-12T16:45:00Z",
//       updatedAt: "2024-01-12T16:45:00Z",
//       lastActive: "1h ago",
//     },
//     {
//       id: "5",
//       email: "sarah.smith@example.com",
//       fullName: "Ms. Sarah Smith",
//       professionalTitle: "Therapist",
//       status: "Active",
//       createdAt: "2024-01-11T11:30:00Z",
//       updatedAt: "2024-01-11T11:30:00Z",
//       lastActive: "2h ago",
//     },
//     {
//       id: "6",
//       email: "michael.brown@example.com",
//       fullName: "Dr. Michael Brown",
//       professionalTitle: "Family Medicine",
//       status: "Inactive",
//       createdAt: "2024-01-10T13:20:00Z",
//       updatedAt: "2024-01-10T13:20:00Z",
//       lastActive: "1d ago",
//     },
//   ];

<<<<<<< HEAD
        const response = await api(ENDPOINTS.providers, {
          headers: { Authorization: `Bearer ${token}` },
        });
=======
//   useEffect(() => {
//     const loadProviders = async () => {
//       try {
//         const token = localStorage.getItem("curatorToken");
//         if (!token) {
//           router.push(ROUTES.curator.signIn);
//           return;
//         }
>>>>>>> origin/reaper

//         if (token.startsWith("temp-curator-token-")) {
//           setProviders(mockProviders);
//           return;
//         }

//         const response = await api.getProviders({ token });

//         if (response.success) {
//           setProviders(response.data || []);
//         } else {
//           setProviders(mockProviders);
//         }
//       } catch (error: any) {
//         console.error("Error loading providers:", error);
//         setProviders(mockProviders);
//       }
//     };

//     loadProviders();
//   }, [router, mockProviders]);

//   const handleLogout = () => {
//     localStorage.removeItem("curatorToken");
//     router.push(ROUTES.curator.signIn);
//   };

//   const filteredSchools = schools.filter((school) => {
//     if (filter === "All") return true;
//     return school.status.toLowerCase() === filter.toLowerCase();
//   });

//   const filteredProviders = providers.filter((provider) => {
//     if (filter === "All") return true;
//     return provider.status.toLowerCase() === filter.toLowerCase();
//   });

//   return (
//     <div className="h-screen bg-white flex">
//       {/* Main Content */}

<<<<<<< HEAD
          {/* Content Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4">
            {activeTab === "home"
              ? filteredSchools.map((school) => (
                <div
                  key={school.id}
                  className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-[#955aa4]/50 hover:scale-[1.02]"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#955aa4] to-[#7C4DFF] flex items-center justify-center overflow-hidden flex-shrink-0 shadow-md">
                      {school.avatar ? (
                        <Image
                          width={48}
                          height={48}
                          src={school.avatar}
                          alt={school.name}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <MdSchool className="text-white text-xl" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-base lg:text-lg truncate mb-1">
                        {school.name}
                      </h3>
                      <p className="text-orange-500 text-xs lg:text-sm truncate font-medium">
                        {school.activityType} • {school.lastActivity}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <div
                      className={`px-4 py-2 rounded-full font-semibold text-sm shadow-sm ${school.status === "Active"
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : "bg-gray-100 text-gray-600 border border-gray-200"
                        }`}
                    >
                      {school.status}
                    </div>
                  </div>
                </div>
              ))
              : filteredProviders.map((provider) => (
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
                      className={`px-4 py-2 rounded-full font-semibold text-sm shadow-sm ${provider.status === "Active"
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
        </div>
      </div>
=======
//       <div className="flex-1 overflow-y-auto bg-gray-50 pt-16 md:pt-0">
//         <div className="p-3 lg:p-6">
//           {/* Header */}
//           <div className="flex items-center mb-4 lg:mb-6 gap-4">
//             <div className="flex-1 min-w-0">
//               <div className="bg-white rounded-lg px-4 lg:px-6 py-3 lg:py-4 shadow-sm border w-full">
//                 <h1 className="text-xl lg:text-2xl font-bold text-[#955aa4] flex items-center gap-2">
//                   {activeTab === "home" ? (
//                     <>
//                       <MdSchool className="text-xl lg:text-2xl" />
//                       <span className="hidden sm:inline">All Schools</span>
//                       <span className="sm:hidden">Schools</span>
//                       <span>· {filteredSchools.length}</span>
//                     </>
//                   ) : (
//                     <>
//                       <MdHealthAndSafety className="text-xl lg:text-2xl" />
//                       <span className="hidden sm:inline">All Providers</span>
//                       <span className="sm:hidden">Providers</span>
//                       <span>· {filteredProviders.length}</span>
//                     </>
//                   )}
//                 </h1>
//               </div>
//             </div>
//             {/* Filter Dropdown - Right Corner */}
//             <div className="relative ml-2 flex-shrink-0">
//               <button
//                 onClick={() => setShowFilterDropdown(!showFilterDropdown)}
//                 className="flex items-center gap-2 px-4 lg:px-6 py-2 lg:py-3 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200 justify-between min-w-[120px]"
//               >
//                 <span>{filter}</span>
//                 <FiChevronDown
//                   className="w-4 h-4 transition-transform duration-200"
//                   style={{
//                     transform: showFilterDropdown
//                       ? "rotate(180deg)"
//                       : "rotate(0deg)",
//                   }}
//                 />
//               </button>
>>>>>>> origin/reaper

//               {showFilterDropdown && (
//                 <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden">
//                   <button
//                     onClick={() => {
//                       setFilter("All");
//                       setShowFilterDropdown(false);
//                     }}
//                     className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center justify-between transition-colors"
//                   >
//                     <span className="font-medium">All</span>
//                     {filter === "All" && (
//                       <span className="text-[#955aa4] text-lg">✓</span>
//                     )}
//                   </button>
//                   <button
//                     onClick={() => {
//                       setFilter("Active");
//                       setShowFilterDropdown(false);
//                     }}
//                     className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors"
//                   >
//                     <span className="font-medium">Active</span>
//                   </button>
//                   <button
//                     onClick={() => {
//                       setFilter("Inactive");
//                       setShowFilterDropdown(false);
//                     }}
//                     className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors"
//                   >
//                     <span className="font-medium">Inactive</span>
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Content Grid */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4">
//             {activeTab === "home"
//               ? filteredSchools.map((school) => (
//                   <div
//                     key={school.id}
//                     className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-[#955aa4]/50 hover:scale-[1.02]"
//                   >
//                     <div className="flex items-start gap-4 mb-4">
//                       <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#955aa4] to-[#7C4DFF] flex items-center justify-center overflow-hidden flex-shrink-0 shadow-md">
//                         {school.avatar ? (
//                           <Image
//                             width={48}
//                             height={48}
//                             src={school.avatar}
//                             alt={school.name}
//                             className="w-full h-full object-cover rounded-xl"
//                           />
//                         ) : (
//                           <MdSchool className="text-white text-xl" />
//                         )}
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <h3 className="font-bold text-gray-900 text-base lg:text-lg truncate mb-1">
//                           {school.name}
//                         </h3>
//                         <p className="text-orange-500 text-xs lg:text-sm truncate font-medium">
//                           {school.activityType} • {school.lastActivity}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex justify-center">
//                       <div
//                         className={`px-4 py-2 rounded-full font-semibold text-sm shadow-sm ${
//                           school.status === "Active"
//                             ? "bg-green-100 text-green-700 border border-green-200"
//                             : "bg-gray-100 text-gray-600 border border-gray-200"
//                         }`}
//                       >
//                         {school.status}
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               : filteredProviders.map((provider) => (
//                   <div
//                     key={provider.id}
//                     onClick={() => handleProviderSelect(provider.email)}
//                     className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-[#955aa4]/50 group hover:scale-[1.02]"
//                   >
//                     <div className="flex items-start gap-4 mb-4">
//                       <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#955aa4] to-[#7C4DFF] flex items-center justify-center flex-shrink-0 shadow-md">
//                         <MdHealthAndSafety className="text-white text-xl" />
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <h3 className="font-bold text-gray-900 group-hover:text-[#955aa4] transition-colors text-base lg:text-lg truncate mb-1">
//                           {provider.fullName}
//                         </h3>
//                         <p className="text-gray-600 text-sm lg:text-base truncate mb-1">
//                           {provider.professionalTitle}
//                         </p>
//                         {provider.lastActive && (
//                           <p className="text-orange-500 text-xs lg:text-sm font-medium">
//                             {provider.lastActive}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                     <div className="flex justify-center">
//                       <div
//                         className={`px-4 py-2 rounded-full font-semibold text-sm shadow-sm ${
//                           provider.status === "Active"
//                             ? "bg-green-100 text-green-700 border border-green-200"
//                             : provider.status === "Inactive"
//                             ? "bg-gray-100 text-gray-600 border border-gray-200"
//                             : "bg-gray-100 text-gray-600 border border-gray-200"
//                         }`}
//                       >
//                         {provider.status}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//           </div>
//         </div>
//       </div>

//       {/* Clean Logout Modal */}
//       {showLogoutModal && (
//         <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 max-w-sm w-full shadow-xl">
//             <h2 className="text-lg sm:text-xl font-bold text-center mb-3 sm:mb-4 text-gray-800">
//               Logout Confirmation
//             </h2>
//             <p className="text-center text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
//               Are you sure you want to log out?
//             </p>
//             <div className="flex flex-col sm:flex-row gap-3">
//               <button
//                 onClick={handleLogout}
//                 className="flex-1 py-2.5 sm:py-2 text-center font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm sm:text-base"
//               >
//                 Yes, Logout
//               </button>
//               <button
//                 onClick={() => setShowLogoutModal(false)}
//                 className="flex-1 py-2.5 sm:py-2 text-center font-medium bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm sm:text-base"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Clean Create Modal */}
//       {showCreateModal && (
//         <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6 max-w-2xl w-full shadow-xl max-h-[90vh] overflow-y-auto">
//             <div className="flex items-center justify-between mb-4 lg:mb-6">
//               <h2 className="text-xl lg:text-2xl font-bold text-[#955aa4]">
//                 Creative Studios
//               </h2>
//               <button
//                 onClick={() => setShowCreateModal(false)}
//                 className="text-gray-400 hover:text-gray-600 transition-colors"
//               >
//                 <FiX className="w-5 h-5 lg:w-6 lg:h-6" />
//               </button>
//             </div>

//             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
//               <button
//                 onClick={() => {
//                   setShowCreateModal(false);
//                   setShowSchoolModal(true);
//                 }}
//                 className="p-3 lg:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center group"
//               >
//                 <div className="text-2xl lg:text-3xl mb-2">🏫</div>
//                 <h3 className="font-medium text-gray-800 text-sm lg:text-base">
//                   New Schools
//                 </h3>
//               </button>
//               <button
//                 onClick={() => {
//                   setShowCreateModal(false);
//                   setShowMemberModal(true);
//                 }}
//                 className="p-3 lg:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center group"
//               >
//                 <div className="text-2xl lg:text-3xl mb-2">👥</div>
//                 <h3 className="font-medium text-gray-800 text-sm lg:text-base">
//                   Our Team
//                 </h3>
//               </button>
//               <button
//                 onClick={() => {
//                   setShowCreateModal(false);
//                   setShowPartnerModal(true);
//                 }}
//                 className="p-3 lg:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center group"
//               >
//                 <div className="text-2xl lg:text-3xl mb-2">🤝</div>
//                 <h3 className="font-medium text-gray-800 text-sm lg:text-base">
//                   New Partners
//                 </h3>
//               </button>
//               <button className="p-3 lg:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center group">
//                 <div className="text-2xl lg:text-3xl mb-2">📻</div>
//                 <h3 className="font-medium text-gray-800 text-sm lg:text-base">
//                   Radio
//                 </h3>
//               </button>
//               <button
//                 onClick={() => {
//                   setShowCreateModal(false);
//                   setShowLineupModal(true);
//                 }}
//                 className="p-3 lg:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center group"
//               >
//                 <div className="text-2xl lg:text-3xl mb-2">🏥</div>
//                 <h3 className="font-medium text-gray-800 text-sm lg:text-base">
//                   Health Lineup
//                 </h3>
//               </button>
//               <button
//                 onClick={() => {
//                   setShowCreateModal(false);
//                   setShowReachModal(true);
//                 }}
//                 className="p-3 lg:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center group"
//               >
//                 <div className="text-2xl lg:text-3xl mb-2">📢</div>
//                 <h3 className="font-medium text-gray-800 text-sm lg:text-base">
//                   Reach
//                 </h3>
//               </button>
//               <button className="p-3 lg:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center group">
//                 <div className="text-2xl lg:text-3xl mb-2">🎨</div>
//                 <h3 className="font-medium text-gray-800 text-sm lg:text-base">
//                   Banner
//                 </h3>
//               </button>
//               <button className="p-3 lg:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center group">
//                 <div className="text-2xl lg:text-3xl mb-2">🎉</div>
//                 <h3 className="font-medium text-gray-800 text-sm lg:text-base">
//                   Events
//                 </h3>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <SchoolCreationModal
//         isOpen={showSchoolModal}
//         onClose={() => {
//           setShowSchoolModal(false);
//           setShowCreateModal(true);
//         }}
//         onSchoolCreated={(school) => {
//           console.log("School created:", school);
//           setShowSchoolModal(false);
//           setShowCreateModal(true);
//         }}
//       />

//       <MemberCreationModal
//         isOpen={showMemberModal}
//         onClose={() => {
//           setShowMemberModal(false);
//           setShowCreateModal(true);
//         }}
//         onMemberCreated={(member) => {
//           console.log("Member created:", member);
//           setShowMemberModal(false);
//           setShowCreateModal(true);
//         }}
//       />

//       <ProviderDetailsModal
//         isOpen={showProviderModal}
//         onClose={() => setShowProviderModal(false)}
//         providerEmail={selectedProviderEmail}
//       />

//       <ReachModal
//         isOpen={showReachModal}
//         onClose={() => {
//           setShowReachModal(false);
//           setShowCreateModal(true);
//         }}
//       />

//       <LineupModal
//         isOpen={showLineupModal}
//         onClose={() => {
//           setShowLineupModal(false);
//           setShowCreateModal(true);
//         }}
//       />

//       <PartnerCreationModal
//         isOpen={showPartnerModal}
//         onClose={() => {
//           setShowPartnerModal(false);
//           setShowCreateModal(true);
//         }}
//         onPartnerCreated={(partner) => {
//           console.log("Partner created:", partner);
//           setShowPartnerModal(false);
//           setShowCreateModal(true);
//         }}
//       />
//     </div>
//   );
// };




const CuratorDashboard = () => {}
export default CuratorDashboard;