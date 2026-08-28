"use client";

import { ArrowLeft, Users } from "lucide-react";
import { MdSchool } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { useProviderSchoolDetails } from "@/hooks/provider/school-details/use-school-details";

export default function ProviderSchoolDetailsPage() {
  const {
    router,
    school,
    students,
    isLoading,
    studentsLoading,
    accessDenied,
    handleStudentClick,
  } = useProviderSchoolDetails();

  if (isLoading) {
    return (
      <div className="bg-app-gradient flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-primary mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2" />
          <p className="text-muted-foreground">Loading school details...</p>
        </div>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="bg-app-gradient min-h-screen">
        <div className="mx-auto max-w-7xl p-8">
          <div className="mb-8">
            <Button
              onClick={() => router.push("/provider/schools")}
              variant="outline"
              className="w-fit"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Schools
            </Button>
          </div>
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center">
              <MdSchool className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
              <h2 className="text-foreground mb-2 text-2xl font-semibold">
                You do not have access to this school
              </h2>
              <p className="text-muted-foreground">
                Please contact your administrator if you believe this is an
                error.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!school) {
    return (
      <div className="bg-app-gradient min-h-screen">
        <div className="mx-auto max-w-7xl p-8">
          <div className="mb-8">
            <Button
              onClick={() => router.push("/provider/schools")}
              variant="outline"
              className="w-fit"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Schools
            </Button>
          </div>
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center">
              <MdSchool className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
              <h2 className="text-foreground mb-2 text-2xl font-semibold">
                School not found
              </h2>
              <p className="text-muted-foreground">
                The school you&apos;re looking for doesn&apos;t exist or has
                been removed.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-app-gradient min-h-screen">
      <div className="mx-auto max-w-7xl p-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            onClick={() => router.push("/provider/schools")}
            variant="outline"
            className="w-fit"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Schools
          </Button>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start gap-6">
            {school.logo ? (
              <div className="border-border bg-card relative h-32 w-32 shrink-0 overflow-hidden rounded-2xl border-2">
                {/* eslint-disable-next-line @next/next/no-img-element -- rendered directly, no optimization */}
                <img
                  src={school.logo}
                  alt={school.name}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="bg-muted flex h-32 w-32 shrink-0 items-center justify-center rounded-2xl">
                <MdSchool className="text-muted-foreground h-16 w-16" />
              </div>
            )}
            <div className="pt-2">
              <h1 className="text-foreground mb-2 text-4xl font-bold">
                {school.name}
              </h1>
              {school.nickname && (
                <p className="text-muted-foreground text-base">
                  @{school.nickname}
                </p>
              )}
              {school.type && (
                <span className="bg-muted text-foreground mt-3 inline-block rounded-full px-4 py-1.5 text-sm font-medium">
                  {school.type}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Students Section */}
        <div className="bg-card border-border rounded-xl border p-6 shadow-sm">
          <h2 className="text-foreground mb-4 flex items-center gap-2 text-xl font-bold">
            <Users className="h-6 w-6" />
            Students ({students.length})
          </h2>

          {studentsLoading ? (
            <div className="py-12 text-center">
              <div className="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2" />
              <p className="text-muted-foreground">Loading students...</p>
            </div>
          ) : students.length === 0 ? (
            <div className="py-12 text-center">
              <Users className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
              <p className="text-muted-foreground">No students available</p>
            </div>
          ) : (
            <div className="space-y-3">
              {students.map((student, index) => (
                <button
                  type="button"
                  key={`${student.studentName}-${index}`}
                  onClick={() => handleStudentClick(student)}
                  className="bg-card border-border hover:border-primary/30 hover:bg-muted/50 flex w-full items-center justify-between rounded-lg border p-4 text-left transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-teal-500 to-cyan-500">
                      <span className="font-semibold text-white">
                        {student.studentName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-foreground font-semibold">
                        {student.studentName}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <span
                          className={`rounded px-2 py-1 text-xs font-medium ${
                            student.lockedInColor === "red"
                              ? "bg-destructive/10 text-destructive"
                              : student.lockedInColor === "yellow"
                                ? "bg-warning/10 text-warning"
                                : student.lockedInColor === "green"
                                  ? "bg-success/10 text-success"
                                  : student.lockedInColor === "purple"
                                    ? "bg-primary/10 text-primary"
                                    : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {student.lockedInInterpretation}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          Score: {student.lockinScore.toFixed(2)}
                        </span>
                      </div>
                      {student.createdAt && (
                        <p className="text-muted-foreground mt-1 text-sm">
                          {new Date(student.createdAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {student.visibilityStatus === "NEW" && (
                      <span className="bg-destructive/10 text-destructive rounded-full px-3 py-1 text-xs font-medium">
                        New
                      </span>
                    )}
                    {student.visibilityStatus === "SEEN" && (
                      <span className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs font-medium">
                        Seen
                      </span>
                    )}
                    {!student.patientResultId && (
                      <span className="bg-warning/10 text-warning rounded-full px-3 py-1 text-xs font-medium">
                        Not Opened
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
