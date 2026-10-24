"use client";

import PatientHeader from "@/components/curator/patient-dashboard/patient-header";
import PatientMetrics from "@/components/curator/patient-dashboard/patient-metrics";
import AssessmentDetailsCard from "@/components/curator/patient-dashboard/assessment-details-card";
import UrgentCareStatusCard from "@/components/curator/patient-dashboard/urgent-care-status-card";
import SchoolTypeComparisonCard from "@/components/curator/patient-dashboard/school-type-comparison-card";
import PatientCommentsPanel from "@/components/curator/patient-dashboard/patient-comments-panel";
import type { PatientDetailsPageContentProps } from "@/lib/types/components/curator/patient-dashboard";

export function PatientDetailsPageContent({
  details,
}: PatientDetailsPageContentProps) {
  const {
    router,
    detail,
    metrics,
    benchmarks,
    comments,
    isCommentsLoading,
    addComment,
    isAddingComment,
    commentError,
    toggleActive,
    isTogglingActive,
    accept,
    isAccepting,
  } = details;

  if (!detail) return null;

  // TODO(v2-backend): no endpoint deletes a result record (v1 DELETE
  // /patient-results/{id}); the Delete button is gone. "Mark inactive"
  // (PATCH /results/{id} {active:false}) is the closest v2 action.
  return (
    <div className="bg-muted/5 animate-in fade-in flex min-h-screen flex-col duration-500">
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <PatientHeader
          detail={detail}
          onBack={() => router.back()}
          onToggleActive={toggleActive}
          isTogglingActive={isTogglingActive}
          onAccept={accept}
          isAccepting={isAccepting}
        />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <PatientMetrics metrics={metrics} />
            <AssessmentDetailsCard detail={detail} />
            <UrgentCareStatusCard detail={detail} />
            <SchoolTypeComparisonCard
              outcomes={detail.outcomes}
              benchmarks={benchmarks}
            />
          </div>

          <div className="space-y-6">
            <PatientCommentsPanel
              comments={comments}
              isLoading={isCommentsLoading}
              onAddComment={addComment}
              isAdding={isAddingComment}
              bodyError={commentError}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
