"use client";

import SchoolEditPanel from "@/components/curator/schools/school-edit-panel";
import ProviderDetailsPanel from "@/components/curator/providers/provider-details-panel";
import AddIconWizard from "@/components/curator/content-pages/overlays/add-icon-wizard";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import type { SchoolDetailsOverlayHostProps } from "@/lib/types/components/curator/school-details/school-details";
import type { CuratorSchoolDetailsState } from "@/hooks/curator/school-details/use-school-details";

export default function SchoolDetailsModals({
  details,
}: SchoolDetailsOverlayHostProps<CuratorSchoolDetailsState>) {
  const {
    school,
    showEditModal,
    setShowEditModal,
    showDisableModal,
    setShowDisableModal,
    showProviderModal,
    setShowProviderModal,
    selectedProviderEmail,
    showAddIconWizard,
    setShowAddIconWizard,
    editingIcon,
    setEditingIcon,
    handleSchoolUpdated,
    handleDisableSchool,
    handleDisableConfirm,
    handleIconComplete,
    loadProviders,
    isActionLoading,
    selectedProvider,
  } = details;

  return (
    <>
      {school && (
        <>
          <SchoolEditPanel
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            school={school}
            onSchoolUpdated={handleSchoolUpdated}
            onDisableSchool={handleDisableSchool}
          />

          <ConfirmationModal
            isOpen={showDisableModal}
            onClose={() => setShowDisableModal(false)}
            onConfirm={handleDisableConfirm}
            title="Archive School"
            message={`Archive ${school.name}? It leaves pickers and lists; its results and provider access stay, and it can be restored.`}
            confirmText="Yes, Archive"
            variant="danger"
            isLoading={isActionLoading}
          />
        </>
      )}

      <ProviderDetailsPanel
        isOpen={showProviderModal}
        onClose={() => {
          setShowProviderModal(false);
          loadProviders();
        }}
        // v2 campus providers carry no email; this is the provider id
        // (see campusProviderToSchoolProvider).
        providerEmail={selectedProviderEmail}
        provider={selectedProvider}
      />

      <AddIconWizard
        isOpen={showAddIconWizard}
        onClose={() => {
          setShowAddIconWizard(false);
          setEditingIcon(null);
        }}
        onComplete={handleIconComplete}
        editData={
          editingIcon
            ? {
                photoPreview: editingIcon.photoPreview,
                name: editingIcon.name,
                slogan: editingIcon.slogan,
                rank: editingIcon.rank,
                lockIns: editingIcon.lockIns || [],
              }
            : null
        }
        selectedSchool={school}
      />
    </>
  );
}
