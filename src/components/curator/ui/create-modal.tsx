import React, { useState } from "react";
import { FiX, FiUsers, FiRadio, FiActivity, FiImage, FiCalendar } from "react-icons/fi";
import { MdSchool, MdHealthAndSafety } from "react-icons/md";
import { HiOutlineSpeakerphone } from "react-icons/hi";
import FeatureComingSoonModal from "@/components/modals/feature-coming-soon";

interface ICreateModal {
  setShowCreateModal: (show: boolean) => void;
  onOpenSchoolModal?: () => void;
  onOpenMemberModal?: () => void;
  onOpenPartnerModal?: () => void;
  onOpenReachModal?: () => void;
}

const CreateModal = ({ 
  setShowCreateModal,
  onOpenSchoolModal,
  onOpenMemberModal,
  onOpenPartnerModal,
  onOpenReachModal
}: ICreateModal) => {
  const [comingSoonFeature, setComingSoonFeature] = useState<string | null>(null);

  const menuItems = [
    {
      id: "schools",
      label: "New Schools",
      icon: MdSchool,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      onClick: onOpenSchoolModal,
    },
    {
      id: "team",
      label: "New Member",
      icon: FiUsers,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      onClick: onOpenMemberModal,
    },
    {
      id: "partners",
      label: "New Partners",
      icon: MdHealthAndSafety, // Using HealthAndSafety as a proxy for handshake/partners if needed, or stick to emoji logic but icons are better
      color: "text-green-500",
      bgColor: "bg-green-50",
      onClick: onOpenPartnerModal,
    },
    {
      id: "reach",
      label: "Reach",
      icon: HiOutlineSpeakerphone,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      onClick: onOpenReachModal,
    },
    {
      id: "radio",
      label: "Radio",
      icon: FiRadio,
      color: "text-pink-500",
      bgColor: "bg-pink-50",
      isComingSoon: true,
    },
    {
      id: "lineup",
      label: "Health Lineup",
      icon: FiActivity,
      color: "text-red-500",
      bgColor: "bg-red-50",
      isComingSoon: true,
    },
    {
      id: "banner",
      label: "Banner",
      icon: FiImage,
      color: "text-indigo-500",
      bgColor: "bg-indigo-50",
      isComingSoon: true,
    },
    {
      id: "events",
      label: "Events",
      icon: FiCalendar,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50",
      isComingSoon: true,
    },
  ];

  const handleItemClick = (item: typeof menuItems[0]) => {
    if (item.isComingSoon) {
      setComingSoonFeature(item.label);
    } else if (item.onClick) {
      item.onClick();
      // We don't close the create modal here because the parent usually handles the switching
      // But based on the user's request, we might need to ensure the parent closes this one.
      // The parent layout/page logic seems to handle closing this when opening others.
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center z-50 p-4"
        onClick={() => setShowCreateModal(false)}
      >
        <div 
          className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Creative Studios
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Select a module to create or manage content
              </p>
            </div>
            <button
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-all duration-200 shadow-sm"
              onClick={() => setShowCreateModal(false)}
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Grid */}
          <div className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className="flex flex-col items-center group p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-100"
                  >
                    <div className={`w-16 h-16 rounded-2xl ${item.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200 shadow-sm`}>
                      <Icon className={`w-8 h-8 ${item.color}`} />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm group-hover:text-[#955aa4] transition-colors">
                      {item.label}
                    </h3>
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Footer */}
          <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400 font-medium">
              JUSTGO HEALTH CURATOR PORTAL
            </p>
          </div>
        </div>
      </div>

      <FeatureComingSoonModal
        isOpen={!!comingSoonFeature}
        onClose={() => setComingSoonFeature(null)}
        featureName={comingSoonFeature || ""}
      />
    </>
  );
};

export default CreateModal;
