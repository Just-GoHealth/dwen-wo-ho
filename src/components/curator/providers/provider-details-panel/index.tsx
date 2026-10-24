"use client";

import {
  ProviderDetailsPanelProps,
  ProviderDetailsPanelTab,
} from "@/lib/types/components/shared/overlays";
import { useProviderDetails } from "@/hooks/components/curator/providers/provider-details-panel";
import { ProviderHeader } from "./header";
import { ProviderTabs } from "./tabs";
import { OverviewTab } from "./overview-tab";
import { SchoolsTab } from "./schools-tab";
import { PartnersTab } from "./partners-tab";
import { ProviderFooter } from "./footer";
import { ProviderConfirmationModals } from "./confirmation-overlay-host";
import { activateOnKeyboard } from "@/lib/utils/shared/a11y";

const ProviderDetailsPanel = ({
  isOpen,
  onClose,
  providerId: providerIdProp,
  providerEmail,
  provider: providerProp,
  onShowApproveModal,
  onShowRejectModal,
  isModerating = false,
  currentAction = null,
  moderatingProviderId = null,
}: ProviderDetailsPanelProps) => {
  // `providerEmail` is the pre-v2 prop name; it now carries the provider id too.
  const providerId = providerIdProp ?? providerEmail ?? "";
  const {
    provider,
    isQueryLoading,
    activeTab,
    setActiveTab,
    associatedSchools,
    filteredAvailableSchools,
    associatedPartners,
    filteredAvailablePartners,
    schoolSearchQuery,
    setSchoolSearchQuery,
    partnerSearchQuery,
    setPartnerSearchQuery,
    isLoadingSchools,
    isLoadingPartners,
    showApproveModal,
    setShowApproveModal,
    showRejectModal,
    setShowRejectModal,
    handleAddSchool,
    handleRemoveSchool,
    handleAddPartner,
    handleRemovePartner,
    handleApproveClick,
    handleRejectClick,
    handleApproveConfirm,
    handleRejectConfirm,
    setSchoolToAdd,
    setSchoolToRemove,
    setPartnerToAdd,
    setPartnerToRemove,
    schoolToAdd,
    schoolToRemove,
    partnerToAdd,
    partnerToRemove,
    isAddingSchool,
    isRemovingSchool,
    isAddingPartner,
    isRemovingPartner,
    applicationStatusConfig,
  } = useProviderDetails({
    isOpen,
    providerId,
    providerProp,
    onShowApproveModal,
    onShowRejectModal,
  });

  const showLoading = isQueryLoading && !provider;

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        aria-label="Close dialog"
        className={`bg-background/80 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-all duration-300 ease-in-out ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        onKeyDown={activateOnKeyboard(onClose)}
      >
        <div
          className={`bg-card text-foreground border-border relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border shadow-2xl transition-all duration-300 ease-in-out ${
            isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {provider && applicationStatusConfig && (
            <ProviderHeader
              provider={provider}
              onClose={onClose}
              statusConfig={applicationStatusConfig}
            />
          )}

          <ProviderTabs
            activeTab={activeTab}
            setActiveTab={(tab) => setActiveTab(tab as ProviderDetailsPanelTab)}
            associatedSchoolsCount={associatedSchools.length}
            associatedPartnersCount={associatedPartners.length}
          />

          <div className="flex-1 overflow-y-auto px-6 pb-6">
            {showLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="border-primary mb-4 h-12 w-12 animate-spin rounded-full border-b-2"></div>
                <p className="text-muted-foreground font-medium">
                  Loading provider details...
                </p>
              </div>
            ) : (
              <>
                {activeTab === "overview" && provider && (
                  <OverviewTab provider={provider} />
                )}

                {activeTab === "schools" && (
                  <SchoolsTab
                    isLoadingSchools={isLoadingSchools}
                    associatedSchools={associatedSchools}
                    schoolSearchQuery={schoolSearchQuery}
                    setSchoolSearchQuery={setSchoolSearchQuery}
                    filteredAvailableSchools={filteredAvailableSchools}
                    setSchoolToRemove={setSchoolToRemove}
                    setSchoolToAdd={setSchoolToAdd}
                    applicationStatus={provider?.applicationStatus}
                  />
                )}

                {activeTab === "partners" && (
                  <PartnersTab
                    isLoadingPartners={isLoadingPartners}
                    associatedPartners={associatedPartners}
                    partnerSearchQuery={partnerSearchQuery}
                    setPartnerSearchQuery={setPartnerSearchQuery}
                    filteredAvailablePartners={filteredAvailablePartners}
                    setPartnerToRemove={setPartnerToRemove}
                    setPartnerToAdd={setPartnerToAdd}
                  />
                )}
              </>
            )}
          </div>

          <ProviderFooter
            applicationStatus={provider?.applicationStatus}
            handleApproveClick={handleApproveClick}
            handleRejectClick={handleRejectClick}
            isModerating={isModerating}
            moderatingProviderId={moderatingProviderId}
            providerId={providerId}
            currentAction={currentAction}
            onClose={onClose}
          />
        </div>
      </div>

      <ProviderConfirmationModals
        schoolToAdd={schoolToAdd}
        setSchoolToAdd={setSchoolToAdd}
        handleAddSchool={handleAddSchool}
        isAddingSchool={isAddingSchool}
        schoolToRemove={schoolToRemove}
        setSchoolToRemove={setSchoolToRemove}
        handleRemoveSchool={handleRemoveSchool}
        isRemovingSchool={isRemovingSchool}
        partnerToAdd={partnerToAdd}
        setPartnerToAdd={setPartnerToAdd}
        handleAddPartner={handleAddPartner}
        partnerToRemove={partnerToRemove}
        setPartnerToRemove={setPartnerToRemove}
        handleRemovePartner={handleRemovePartner}
        isAddingPartner={isAddingPartner}
        isRemovingPartner={isRemovingPartner}
        providerName={provider?.fullName}
        showApproveModal={showApproveModal}
        setShowApproveModal={setShowApproveModal}
        handleApproveConfirm={handleApproveConfirm}
        showRejectModal={showRejectModal}
        setShowRejectModal={setShowRejectModal}
        handleRejectConfirm={handleRejectConfirm}
        currentAction={currentAction}
      />
    </>
  );
};

export default ProviderDetailsPanel;
