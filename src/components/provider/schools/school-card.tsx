import Image from "next/image";
import { MdSchool } from "react-icons/md";
import { SchoolCardProps } from "@/lib/types/components/provider/schools";
import { Button } from "@/components/ui/button";

const getFirstCampus = (campuses: string[] | null | undefined): string => {
  if (campuses && Array.isArray(campuses) && campuses.length > 0) {
    return campuses[0];
  }
  return "";
};

export function SchoolCard({ school, onClick }: SchoolCardProps) {
  const firstCampus = getFirstCampus(school.campuses);
  const displayNickname = school.nickname
    ? firstCampus
      ? `${school.nickname} (${firstCampus})`
      : school.nickname
    : firstCampus
      ? `(${firstCampus})`
      : "";

  return (
    <Button
      onClick={() => onClick(school.id)}
      className="group relative h-56 overflow-hidden rounded-xl shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-xl hover:brightness-110"
    >
      {/* Background Image */}
      {school.logo ? (
        <div className="absolute inset-0">
          <Image
            src={school.logo}
            alt={school.name}
            width={400}
            height={400}
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <div className="from-muted to-muted/50 absolute inset-0 flex items-center justify-center bg-linear-to-br">
          <MdSchool className="text-muted-foreground h-20 w-20" />
        </div>
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/40 to-black/20" />

      {/* Loading Indicator */}
      {school.isLoading && (
        <div className="absolute top-3 left-3 z-10">
          <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
        </div>
      )}

      {/* Top Left - New Patient Alert */}
      {school.newPatientName && !school.isLoading && (
        <div className="absolute top-3 left-3 z-10 w-52 border-none bg-white/95 px-2.5 py-1.5 shadow-md backdrop-blur-sm">
          <span className="block truncate text-sm font-semibold">
            <span className="text-destructive">New Patient.</span>{" "}
            <span className="text-foreground">{school.newPatientName}</span>
          </span>
        </div>
      )}

      {/* Top Right - Student Count Badge */}
      {!school.isLoading && (
        <div className="bg-destructive absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full shadow-lg backdrop-blur-sm">
          <span className="text-destructive-foreground text-xs font-bold">
            {school.totalPatients ?? school.studentCount ?? 0}
          </span>
        </div>
      )}

      {/* Bottom Content */}
      <div className="absolute right-0 bottom-0 left-0 z-10 p-4 text-center">
        <h3 className="mb-0.5 text-2xl leading-tight font-bold text-white">
          {school.name}
        </h3>
        {displayNickname && (
          <p className="mb-0.5 text-base font-medium text-white/95">
            {displayNickname}
          </p>
        )}
        {school.motto && (
          <p className="text-xs font-medium text-white/90 italic">
            {school.motto}
          </p>
        )}
      </div>
    </Button>
  );
}
