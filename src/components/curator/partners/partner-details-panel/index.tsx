"use client";

import { usePartnerDetails } from "@/hooks/components/curator/partners/use-partner-details";
import ProviderDetailsPanel from "@/components/curator/providers/provider-details-panel";
import { PartnerDetailsPanelProps } from "@/lib/types/components/shared/overlays";

// Sub-components
import { PartnerHeader } from "./header";
import { PartnerTabs } from "./tabs";
import { OverviewTab } from "./overview-tab";
import { SchoolsTab } from "./schools-tab";
import { ProvidersTab } from "./providers-tab";
import { PartnerConfirmationModals } from "./confirmation-overlay-host";

const PartnerDetailsPanel = ({
  isOpen,
  onClose,
  partnerId,
  partner: partnerProp,
}: PartnerDetailsPanelProps) => {
  const {
    partner,
    activeTab,
    setActiveTab,
    associatedSchools,
    associatedProviders,
    schoolSearchQuery,
    setSchoolSearchQuery,
    providerSearchQuery,
    setProviderSearchQuery,
    schoolToAdd,
    setSchoolToAdd,
    schoolToRemove,
    setSchoolToRemove,
    providerToAdd,
    setProviderToAdd,
    providerToRemove,
    setProviderToRemove,
    isLoadingSchools,
    isLoadingProviders,
    isAddingSchool,
    isRemovingSchool,
    isAddingProvider,
    isRemovingProvider,
    showProviderModal,
    setShowProviderModal,
    selectedProviderId,
    filteredAvailableSchools,
    filteredAvailableProviders,
    handleAddSchool,
    handleRemoveSchool,
    handleAddProvider,
    handleRemoveProvider,
    handleSchoolClick,
    handleProviderClick,
    tabs,
  } = usePartnerDetails({ partnerId: String(partnerId), partnerProp, isOpen });

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
          <PartnerHeader partner={partner} onClose={onClose} />

          <PartnerTabs
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8">
            {activeTab === "overview" && <OverviewTab partner={partner} />}

            {activeTab === "schools" && (
              <SchoolsTab
                isLoadingSchools={isLoadingSchools}
                associatedSchools={associatedSchools}
                filteredAvailableSchools={filteredAvailableSchools}
                schoolSearchQuery={schoolSearchQuery}
                setSchoolSearchQuery={setSchoolSearchQuery}
                handleSchoolClick={handleSchoolClick}
                setSchoolToRemove={setSchoolToRemove}
                setSchoolToAdd={setSchoolToAdd}
                associationsAvailable={false}
              />
            )}

            {activeTab === "providers" && (
              <ProvidersTab
                isLoadingProviders={isLoadingProviders}
                associatedProviders={associatedProviders}
                filteredAvailableProviders={filteredAvailableProviders}
                providerSearchQuery={providerSearchQuery}
                setProviderSearchQuery={setProviderSearchQuery}
                handleProviderClick={handleProviderClick}
                setProviderToRemove={setProviderToRemove}
                setProviderToAdd={setProviderToAdd}
              />
            )}
          </div>
        </div>
      </div>

      <PartnerConfirmationModals
        schoolToAdd={schoolToAdd}
        setSchoolToAdd={setSchoolToAdd}
        handleAddSchool={handleAddSchool}
        isAddingSchool={isAddingSchool}
        schoolToRemove={schoolToRemove}
        setSchoolToRemove={setSchoolToRemove}
        handleRemoveSchool={handleRemoveSchool}
        isRemovingSchool={isRemovingSchool}
        providerToAdd={providerToAdd}
        setProviderToAdd={setProviderToAdd}
        handleAddProvider={handleAddProvider}
        isAddingProvider={isAddingProvider}
        providerToRemove={providerToRemove}
        setProviderToRemove={setProviderToRemove}
        handleRemoveProvider={handleRemoveProvider}
        isRemovingProvider={isRemovingProvider}
      />

      {/* Provider Details Modal */}
      {showProviderModal && (
        <ProviderDetailsPanel
          isOpen={showProviderModal}
          onClose={() => setShowProviderModal(false)}
          providerId={selectedProviderId}
        />
      )}
    </>
  );
};

export default PartnerDetailsPanel;
