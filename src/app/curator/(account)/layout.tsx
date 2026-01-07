"use client";

import { useRouter } from "next/navigation";
import { CuratorSidebar } from "@/components/curator/ui/sidebar";
import { ROUTES } from "@/constants/routes";
import CreateModal from "@/components/curator/ui/create-modal";
import { useState } from "react";
// import SchoolCreationModal from "@/components/modals/school-creation";
import MemberCreationModal from "@/components/modals/member-creation";
import PartnerCreationModal from "@/components/modals/partner-creation";
import ReachModal from "@/components/modals/reach";
import { useSchools } from "@/hooks/queries/useSchools";
import { useProvidersQuery } from "@/hooks/queries/useProvidersQuery";
import SchoolCreationModal from "@/components/modals/school-creation";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSchoolModal, setShowSchoolModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [showReachModal, setShowReachModal] = useState(false);

  const { schools } = useSchools();
  const { providers } = useProvidersQuery();

  const handleLogout = () => {
    localStorage.removeItem("curatorToken");
    router.push(ROUTES.curator.signIn);
  };

  return (
    <div className="h-screen bg-white flex">
      <CuratorSidebar
        schoolCount={schools?.length || 0}
        providerCount={providers?.data?.length || 0}
        onCreateClick={() => setShowCreateModal(true)}
        onLogout={handleLogout}
      />
      <div className="flex-1 overflow-y-auto bg-gray-50 pt-16 md:pt-0">
        {children}
      </div>

      {showCreateModal && (
        <CreateModal
          setShowCreateModal={setShowCreateModal}
          onOpenSchoolModal={() => {
            setShowCreateModal(false);
            setShowSchoolModal(true);
          }}
          onOpenMemberModal={() => {
            setShowCreateModal(false);
            setShowMemberModal(true);
          }}
          onOpenPartnerModal={() => {
            setShowCreateModal(false);
            setShowPartnerModal(true);
          }}
          onOpenReachModal={() => {
            setShowCreateModal(false);
            setShowReachModal(true);
          }}
        />
      )}

      <SchoolCreationModal
        isOpen={showSchoolModal}
        onClose={() => {
          setShowSchoolModal(false);
          setShowCreateModal(true);
        }}
        onSchoolCreated={() => {
          console.log("School created:", schools);
          setShowSchoolModal(false);
          setShowCreateModal(true);
        }}
      />

      <MemberCreationModal
        isOpen={showMemberModal}
        onClose={() => {
          setShowMemberModal(false);
          setShowCreateModal(true);
        }}
        onMemberCreated={(member) => {
          console.log("Member created:", member);
          setShowMemberModal(false);
          setShowCreateModal(true);
        }}
      />

      <PartnerCreationModal
        isOpen={showPartnerModal}
        onClose={() => {
          setShowPartnerModal(false);
          setShowCreateModal(true);
        }}
        onPartnerCreated={(partner) => {
          console.log("Partner created:", partner);
          setShowPartnerModal(false);
          setShowCreateModal(true);
        }}
      />

      <ReachModal
        isOpen={showReachModal}
        onClose={() => {
          setShowReachModal(false);
          setShowCreateModal(true);
        }}
      />
    </div>
  );
}
