"use client";

import { useState } from "react";
import { useAtom } from "jotai";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useProviderPatientDetails } from "@/hooks/provider/patient-details/use-patient-details";
import { useProviderProfile } from "@/hooks/provider/profile/use-profile";
import { useProviderDashboardProfileEdit } from "@/hooks/provider/dashboard-profile-edit/use-dashboard-profile-edit";
import { profileOpenAtom } from "@/atoms/new-provider";
import { ProviderGlassBar } from "@/components/provider/workspace/provider-glass-bar";
import { ProviderIdentityTrigger } from "@/components/provider/workspace/provider-identity-trigger";
import { ProviderBrandMark } from "@/components/provider/workspace/provider-brand-mark";
import ProviderProfileDialog from "@/components/provider/profile-dialog";
import {
  PatientDetailTopBar,
  PatientDetailsHeader,
  AssessmentMetricsPanel,
  ActionsPanel,
  AssessmentMetadataCard,
  UrgentCareStatusCard,
  SchoolComparisonCard,
} from "@/components/provider/patient-details";

export default function PatientResultPage() {
  const {
    router,
    patientResult,
    lockInAssessment,
    isLoading,
    metrics,
    activeTab,
    setActiveTab,
    pendingActions,
    historyActions,
    isActionsLoading,
    addPatientAction,
    isAddingAction,
    isTreating,
    isAnotherProviderTreating,
    treatingProviderName,
    handleUpdateActionStatus,
    isUpdating,
  } = useProviderPatientDetails();
  const { provider } = useProviderProfile();
  const [profileOpen, setProfileOpen] = useAtom(profileOpenAtom);
  const { profileData, openEdit } = useProviderDashboardProfileEdit();

  // Confirmation dialog state
  const [showStopConfirm, setShowStopConfirm] = useState(false);
  // History side panel — the top bar's History button opens the real
  // actions/history list instead of a stub toast, so there's one place for
  // "history" rather than a duplicate always-visible card further down.
  const [showHistory, setShowHistory] = useState(false);

  if (isLoading) {
    return (
      <div className="bg-app-gradient flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-primary mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-b-2" />
          <p className="text-muted-foreground text-sm">
            Loading patient details...
          </p>
        </div>
      </div>
    );
  }

  if (!patientResult) {
    return (
      <div className="bg-app-gradient flex min-h-screen flex-col items-center justify-center p-6">
        <Button
          onClick={() => router.back()}
          className="text-muted-foreground hover:text-foreground mb-3 text-sm"
          variant="ghost"
        >
          Back
        </Button>
        <p className="text-destructive text-sm">
          Failed to load patient details
        </p>
      </div>
    );
  }

  const providerName = provider
    ? `${provider.providerTitle ? provider.providerTitle + " " : ""}${provider.providerName ?? ""}`.trim()
    : "";
  const providerFallback =
    provider?.providerName?.charAt(0).toUpperCase() || "PR";

  return (
    <div className="bg-app-gradient relative flex h-dvh w-full flex-col overflow-hidden">
      <PatientDetailTopBar
        patientResult={patientResult}
        onBack={() => router.back()}
        onHistory={() => setShowHistory(true)}
        onGiveCare={() =>
          toast.success(`Care request sent for ${patientResult.patientName}.`)
        }
      />

      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-4 pb-[clamp(112px,20vh,188px)] md:px-10">
        <AssessmentMetricsPanel metrics={metrics} />

        {/* Secondary patient info (header card, treating controls, metadata/
            urgent-care/school-comparison cards) is intentionally hidden for
            now — set aside so the domes are the sole focus of this screen.
            Left in place (not deleted) so it can come back. */}
        {false && (
          <div className="mx-auto mt-8 max-w-3xl space-y-5">
            <PatientDetailsHeader
              patientResult={patientResult!}
              lockInAssessment={lockInAssessment}
              isTreating={isTreating}
            />

            <div className="bg-card border-border flex items-center gap-3 rounded-2xl border p-4 shadow-sm">
              {!isTreating ? (
                <LoadingButton
                  onClick={() => handleUpdateActionStatus("TREATING")}
                  loading={isUpdating}
                  loadingText="Updating..."
                  disabled={isAnotherProviderTreating}
                  className="bg-teal-600 px-6 py-2.5 hover:bg-teal-700 disabled:opacity-50"
                  title={
                    isAnotherProviderTreating
                      ? "Another provider is already treating this patient"
                      : ""
                  }
                >
                  Start Treating
                </LoadingButton>
              ) : (
                <LoadingButton
                  onClick={() => setShowStopConfirm(true)}
                  loading={isUpdating}
                  loadingText="Updating..."
                  variant="outline"
                  className="border-red-300 px-6 py-2.5 hover:bg-red-50 hover:text-red-700"
                >
                  Stop Treating
                </LoadingButton>
              )}

              {(isTreating || isAnotherProviderTreating) && (
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={cn(
                          "flex cursor-help items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium",
                          isTreating
                            ? "border-teal-200 bg-teal-50 text-teal-700"
                            : "border-amber-200 bg-amber-50 text-amber-700",
                        )}
                      >
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            isTreating
                              ? "animate-pulse bg-teal-500"
                              : "bg-amber-500",
                          )}
                        />
                        Under Treatment
                      </div>
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      align="start"
                      className="max-w-xs rounded-lg border border-slate-200 bg-white p-3 text-slate-700 shadow-lg"
                    >
                      <p className="text-xs leading-relaxed">
                        {isTreating
                          ? "You are actively treating this patient. Click 'Stop Treating' to end your involvement."
                          : `Dr. ${treatingProviderName} is currently treating this patient.`}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>

            {lockInAssessment && (
              <AssessmentMetadataCard lockInAssessment={lockInAssessment!} />
            )}
            {lockInAssessment && (
              <UrgentCareStatusCard lockInAssessment={lockInAssessment!} />
            )}
            {lockInAssessment && (
              <SchoolComparisonCard lockInAssessment={lockInAssessment!} />
            )}
          </div>
        )}
      </div>

      <ProviderGlassBar
        className="absolute inset-x-0 bottom-0"
        center={
          <ProviderIdentityTrigger
            providerName={providerName}
            avatarUrl={provider?.profilePhotoURL ?? undefined}
            fallback={providerFallback}
            isVerified={provider?.applicationStatus === "APPROVED"}
            onClick={() => setProfileOpen(true)}
          />
        }
        right={<ProviderBrandMark />}
      />

      <ProviderProfileDialog
        profileOpen={profileOpen}
        setProfileOpen={setProfileOpen}
        profileData={profileData}
        openEdit={openEdit}
        schools={provider?.schools ?? []}
      />

      <Sheet open={showHistory} onOpenChange={setShowHistory}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>History</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <ActionsPanel
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              pendingActions={pendingActions}
              historyActions={historyActions}
              isLoading={isActionsLoading}
              onAddAction={addPatientAction}
              isAddingAction={isAddingAction}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Confirmation Dialog for Stopping Treatment */}
      <ConfirmationModal
        isOpen={showStopConfirm}
        onClose={() => setShowStopConfirm(false)}
        onConfirm={() => {
          handleUpdateActionStatus("NOT_TREATING");
          setShowStopConfirm(false);
        }}
        title="Stop Treating This Patient?"
        message="Are you sure you want to stop treating this patient? This will mark you as no longer actively involved in their care. You can always resume treatment later."
        confirmText="Yes, Stop Treating"
        cancelText="Cancel"
        variant="danger"
        isLoading={isUpdating}
      />
    </div>
  );
}
