"use client";

import { useRouter } from "next/navigation";
import { CuratorSidebar } from "@/components/curator/ui/sidebar";
import { ROUTES } from "@/constants/routes";
import CreateModal from "@/components/curator/ui/create-modal";
import { useState } from "react";
import SchoolCreationModal from "@/components/modals/school-creation";
import { useSchools } from "@/hooks/queries/useSchools";
import { useProvidersQuery } from "@/hooks/queries/useProvidersQuery";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSchoolModal, setShowSchoolModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("curatorToken");
    router.push(ROUTES.curator.signIn);
  };

  const { schools } = useSchools();
  const { providers } = useProvidersQuery();

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
          setShowSchoolModal={setShowSchoolModal}
        />
      )}

      <SchoolCreationModal
        isOpen={showSchoolModal}
        onClose={() => {
          setShowSchoolModal(false);
          setShowCreateModal(true);
        }}
        onSchoolCreated={(school) => {
          setShowSchoolModal(false);
          setShowCreateModal(true);
        }}
      />
    </div>
  );
}
