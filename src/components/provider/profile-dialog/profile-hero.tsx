"use client";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { m } from "motion/react";
import { CheckCircle2, Pencil } from "lucide-react";
import type { ProviderProfileData } from "@/lib/types/api/provider-dashboard";
import { useProviderProfile } from "@/hooks/provider/profile/use-profile";

export function ProfileHero({
  profileData,
  onEdit,
}: {
  profileData: Partial<ProviderProfileData>;
  onEdit: (key: string, label: string, current: string) => void;
}) {
  const { provider } = useProviderProfile();
  const isVerified = provider?.applicationStatus === "APPROVED";
  const fullName = `${profileData.title} ${profileData.name}`;
  const fallback = profileData.name
    ? profileData.name.charAt(0).toUpperCase()
    : "PR";

  return (
    <div className="flex shrink-0 flex-col items-center gap-4 px-5 pt-5 pb-0 md:flex-row md:items-start md:gap-0 md:px-7 md:pt-7">
      {/* Avatar area */}
      <div className="flex flex-col items-center gap-2.5 md:mr-6">
        <m.div
          whileHover={{ boxShadow: "0 0 40px rgba(139,92,246,.5)" }}
          className="bg-primary/20 border-primary relative flex size-16 cursor-pointer items-center justify-center rounded-full border-[3px] text-3xl md:size-20 md:text-4xl"
          onClick={() => onEdit("photo", "Profile Photo", "")}
        >
          <Avatar className="h-full w-full">
            <AvatarImage src={profileData.avatarUrl} />
            <AvatarFallback>{fallback}</AvatarFallback>
          </Avatar>
          <div className="bg-primary absolute right-0 bottom-0 z-10 flex size-5 items-center justify-center rounded-full border-2 md:size-6.5">
            <Pencil size={10} className="text-white" />
          </div>
        </m.div>

        {isVerified && (
          <Badge className="bg-success inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10.5px] font-bold tracking-wide uppercase">
            <CheckCircle2 size={10} /> Verified
          </Badge>
        )}
      </div>

      {/* Name + status */}
      <div className="flex-1 text-center md:text-left">
        <h2 className="mb-1 text-[20px] font-black md:text-[24px]">
          {fullName}
        </h2>
        <p className="text-muted-foreground mb-3 text-[12.5px] md:text-[13.5px]">
          {profileData.specialty}
        </p>
        <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] md:text-[12.5px]">
          &nbsp;&quot;{profileData.status}&quot;
        </div>
      </div>
    </div>
  );
}
