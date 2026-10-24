"use client";

import { useState } from "react";
import { useAtom } from "jotai";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useProviderPatientDetails } from "@/hooks/provider/patient-details/use-patient-details";
import { useProviderProfile } from "@/hooks/provider/profile/use-profile";
import { useProviderDashboardProfileEdit } from "@/hooks/provider/dashboard-profile-edit/use-dashboard-profile-edit";
import { profileOpenAtom } from "@/atoms/new-provider";
import { ProviderGlassBar } from "@/components/provider/workspace/provider-glass-bar";
import { ProviderIdentityTrigger } from "@/components/provider/workspace/provider-identity-trigger";
import { ProviderBrandMark } from "@/components/provider/workspace/provider-brand-mark";
import ProviderProfileDialog from "@/components/provider/profile-dialog";
import { describeApiError } from "@/lib/utils/shared/api-error";
import { ApiErrorNote } from "@/components/shared/api-error-note";
import {
  PatientDetailTopBar,
  AssessmentMetricsPanel,
  PatientDetailSkeleton,
  ResultCommentsPanel,
  ResultStatusBar,
} from "@/components/provider/patient-details";

function CenteredMessage({
  onBack,
  children,
}: {
  onBack: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-app-gradient flex min-h-screen flex-col items-center justify-center gap-3 p-6 text-center">
      {children}
      <Button onClick={onBack} variant="ghost" className="text-sm">
        Back
      </Button>
    </div>
  );
}

export default function PatientResultPage() {
  const {
    router,
    detail,
    tag,
    isLoading,
    notAvailable,
    loadError,
    metrics,
    isTreating,
    otherCare,
    startTreating,
    isUpdatingCare,
    setActive,
    isUpdatingActive,
    comments,
    isCommentsLoading,
    addComment,
    isAddingComment,
    myAccountId,
  } = useProviderPatientDetails();
  const { provider } = useProviderProfile();
  const [profileOpen, setProfileOpen] = useAtom(profileOpenAtom);
  const { profileData, openEdit } = useProviderDashboardProfileEdit();
  const [showHistory, setShowHistory] = useState(false);

  if (isLoading) return <PatientDetailSkeleton />;

  // 404: not attached to this campus, or not accepted yet — not a crash.
  if (notAvailable) {
    return (
      <CenteredMessage onBack={() => router.back()}>
        <h1 className="text-lg font-bold">
          This result isn&apos;t available to you
        </h1>
        <p className="text-muted-foreground max-w-sm text-sm">
          It may belong to a campus you don&apos;t serve, or it hasn&apos;t been
          shared with providers yet.
        </p>
      </CenteredMessage>
    );
  }

  if (!detail) {
    return (
      <CenteredMessage onBack={() => router.back()}>
        <ApiErrorNote error={loadError ? describeApiError(loadError) : null} />
      </CenteredMessage>
    );
  }

  const { result } = detail;
  const providerName = provider
    ? `${provider.providerTitle ? provider.providerTitle + " " : ""}${provider.providerName ?? ""}`.trim()
    : "";
  const providerFallback =
    provider?.providerName?.charAt(0).toUpperCase() || "PR";

  return (
    <div className="bg-app-gradient relative flex h-dvh w-full flex-col overflow-hidden">
      <PatientDetailTopBar
        patientResult={{
          patientName: result.displayName,
          schoolName: detail.campusName ?? "",
        }}
        onBack={() => router.back()}
        onHistory={() => setShowHistory(true)}
        onGiveCare={startTreating}
        isTreating={isTreating}
        isGivingCare={isUpdatingCare}
      />

      <ResultStatusBar
        result={result}
        tag={tag}
        otherCare={otherCare}
        onToggleActive={setActive}
        isUpdatingActive={isUpdatingActive}
      />

      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-4 pb-[clamp(112px,20vh,188px)] md:px-10">
        {metrics.length > 0 ? (
          <AssessmentMetricsPanel metrics={metrics} />
        ) : (
          <p className="text-muted-foreground py-16 text-center text-sm">
            No section scores on this result.
          </p>
        )}
      </div>

      <ProviderGlassBar
        className="absolute inset-x-0 bottom-0"
        left={
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
            <SheetTitle>Comments</SheetTitle>
          </SheetHeader>
          <div className="min-h-0 flex-1 px-4 pb-4">
            <ResultCommentsPanel
              comments={comments}
              isLoading={isCommentsLoading}
              onAdd={addComment}
              isAdding={isAddingComment}
              myAccountId={myAccountId}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
