"use client";

import { m } from "motion/react";
import { BrainCircuit, Pencil } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SectionLabel, InfoCard } from "./profile-helpers";
import type { ProviderCampusSummary } from "@/lib/types/api/provider-dashboard";
import ProfileFieldsColumn from "./profile-fields-column";
import type { ProviderProfileData } from "@/lib/types/api/provider-dashboard";

function formatDate(dateString: string): string {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatRelativeTime(dateString: string | null): string {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

export function ProfileTabs({
  profileData,
  schools,
  onEdit,
}: {
  profileData: Partial<ProviderProfileData>;
  schools: ProviderCampusSummary[];
  onEdit: (key: string, label: string, current: string) => void;
}) {
  return (
    <Tabs
      defaultValue="overview"
      className="mt-5 flex flex-1 flex-col overflow-hidden"
    >
      <TabsList className="flex h-auto w-full gap-0 overflow-x-visible rounded-none border-b bg-transparent px-2 md:space-x-2 md:px-6">
        {[
          { value: "overview", label: "Overview" },
          { value: "schools", label: "Schools", badge: String(schools.length) },
          { value: "partners", label: "Partners", badge: "0" },
        ].map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="hover:bg-primary/5 data-[state=active]:text-primary data-[state=active]:border-primary flex-1 rounded-2xl px-2 pt-2.5 pb-2.5 text-[12px] font-semibold data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none md:flex-none md:px-4 md:text-[13px]"
          >
            {tab.label}
            {tab.badge && (
              <span className="ml-1 text-[10px] md:ml-1.5 md:text-[11px]">
                ({tab.badge})
              </span>
            )}
          </TabsTrigger>
        ))}
      </TabsList>

      {/* ── Body split: fields col + tab content ── */}
      <div className="grid flex-1 grid-cols-1 overflow-hidden md:grid-cols-2">
        <ProfileFieldsColumn profileData={profileData} onEdit={onEdit} />

        <div className="flex-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent overflow-hidden overflow-y-auto">
          {/* Overview */}
          <TabsContent value="overview" className="mt-0 p-6">
            <InfoCard label="Current Status Message">
              &quot;{profileData.status}&quot;
            </InfoCard>

            <SectionLabel className="mt-5">Contact</SectionLabel>
            <div className="mb-5 grid grid-cols-1 gap-2.5 md:grid-cols-2">
              <InfoCard label="Email">{profileData.email || "N/A"}</InfoCard>
              <InfoCard label="Phone">{profileData.phone}</InfoCard>
            </div>

            <SectionLabel>Specialty</SectionLabel>
            <m.button
              whileHover={{ backgroundColor: "rgba(139,92,246,.25)" }}
              onClick={() =>
                onEdit("specialty", "Specialty", profileData.specialty ?? "")
              }
              className="text-primary mb-5 inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5"
            >
              <BrainCircuit size={13} />
              <span className="text-[12.5px] font-semibold">
                {profileData.specialty}
              </span>
              <Pencil size={10} />
            </m.button>

            <SectionLabel>Activity</SectionLabel>
            <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
              <InfoCard label="Member Since">
                {formatDate(profileData.memberSince || "")}
              </InfoCard>
              <InfoCard label="Last Active">
                {formatRelativeTime(profileData.lastUpdated || null)}
              </InfoCard>
            </div>
          </TabsContent>

          {/* Schools */}
          <TabsContent value="schools" className="mt-0 p-6">
            <SectionLabel>Assigned Schools</SectionLabel>
            <div className="flex flex-col gap-2">
              {schools.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No schools assigned
                </p>
              ) : (
                schools.map((s) => (
                  <div
                    key={s.schoolId}
                    className="bg-card flex items-center gap-3 rounded-xl border p-2.5"
                  >
                    <Avatar className="h-7 w-7 shrink-0 rounded-[6px] border bg-white">
                      <AvatarImage
                        src={s.avatarUrl || undefined}
                        alt={s.schoolName}
                        className="object-cover"
                      />
                      <AvatarFallback
                        className="bg-white text-[11px] font-black"
                        style={{ color: s.primaryColor || "#6366f1" }}
                      >
                        {s.schoolName?.charAt(0)?.toUpperCase() || "S"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-[13px] font-semibold">
                      {s.schoolName}
                    </span>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          {/* Partners */}
          <TabsContent
            value="partners"
            className="mt-0 flex min-h-52 flex-col items-center justify-center p-6"
          >
            <div className="text-center">
              <div className="mb-3 text-4xl">🤝</div>
              <p className="text-muted-foreground mb-1 text-[14px] font-semibold">
                No partners yet
              </p>
              <p className="text-muted-foreground text-[12.5px]">
                Partner providers will appear here.
              </p>
            </div>
          </TabsContent>
        </div>
      </div>
    </Tabs>
  );
}
