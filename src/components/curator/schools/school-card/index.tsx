import { m } from "motion/react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { School, Loader2, MapPin } from "lucide-react";
import { ROUTES } from "@/lib/constants/infra/routes";
import { SchoolWithExtras } from "@/atoms/curator-schools";
import { getFirstCampus } from "@/hooks/curator/schools/use-schools";
import { Badge } from "@/components/ui/badge";
import { schoolsService } from "@/services/curator/schools";
import { QUERY_KEYS } from "@/lib/constants/infra/query-keys";

// Format student count for display (e.g., 1.2k)
const formatCount = (count: number) => {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return count;
};

export function SchoolCard({
  school,
  priority = false,
}: {
  school: SchoolWithExtras;
  priority?: boolean;
}) {
  const firstCampus = getFirstCampus(school.campuses);
  const queryClient = useQueryClient();

  // Warms the detail page's own queries before the route even mounts —
  // same pattern as the patient-card prefetch, since none of this data is
  // already sitting in cache from the schools list fetch.
  const prefetchSchoolDetails = () => {
    const id = String(school.id);
    queryClient.prefetchQuery({
      queryKey: [QUERY_KEYS.schools, id],
      queryFn: () => schoolsService.getSchool(id),
      staleTime: 5 * 60 * 1000,
    });
    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.schoolPatientsOverview(id),
      queryFn: () => schoolsService.getPatientsOverview(id),
      staleTime: 2 * 60 * 1000,
    });
    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.schoolProviders(id),
      queryFn: () => schoolsService.getSchoolProviders(id),
      staleTime: 5 * 60 * 1000,
    });
  };

  return (
    <m.div
      initial="initial"
      whileHover="hover"
      className="bg-card dark:bg-muted/80 w-full rounded-lg"
    >
      <Link
        href={`${ROUTES.curator.schools}/${school.id}`}
        onMouseEnter={prefetchSchoolDetails}
        onClick={prefetchSchoolDetails}
        className="group border-border/30 relative block overflow-hidden rounded-lg border shadow-sm transition-all duration-300 hover:shadow-md"
      >
        {/* Header Section (Crest Panel) */}
        <div className="bg-muted relative aspect-[4/3] w-full overflow-hidden">
          {/* Crest Layer: uncropped + consistent padding, regardless of the
           * source image's own background/aspect ratio */}
          <m.div
            variants={{
              initial: { scale: 1 },
              hover: { scale: 0.92 },
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute inset-0 z-0 p-8"
          >
            {school.logo ? (
              // eslint-disable-next-line @next/next/no-img-element -- rendered directly, no optimization
              <img
                src={school.logo}
                alt={school.name}
                loading={priority ? "eager" : "lazy"}
                fetchPriority={priority ? "high" : "auto"}
                className="absolute inset-0 h-full w-full object-contain drop-shadow-md"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <School className="text-muted-foreground/30 h-10 w-10" />
              </div>
            )}
          </m.div>

          {/* Hover Tint */}
          <m.div
            variants={{
              initial: { backgroundColor: "rgba(0, 0, 0, 0)" },
              hover: { backgroundColor: "rgba(0, 0, 0, 0.12)" },
            }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-10"
          />

          {/* Top Right Badge */}
          <div className="absolute top-3 right-3 z-20">
            {school.newPatientName && !school.isLoading && (
              <Badge
                variant="secondary"
                className="bg-background hover:bg-background text-foreground rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-sm"
              >
                New Patient
              </Badge>
            )}
          </div>
        </div>

        {/* Footer Section (White Background) */}
        <div className="flex flex-col gap-3 p-3 pt-0">
          {/* Identity Row: Logo overlapping header + Name/Nickname */}
          <div className="flex items-center gap-3">
            <m.div
              variants={{
                initial: { scale: 1, y: 0 },
                hover: { scale: 1.08, y: -2 },
              }}
              className="border-warning bg-background relative z-20 -mt-10 flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 shadow-xl"
            >
              {school.logo ? (
                // eslint-disable-next-line @next/next/no-img-element -- rendered directly, no optimization
                <img
                  src={school.logo}
                  alt="Logo"
                  width={28}
                  height={28}
                  loading={priority ? "eager" : "lazy"}
                  fetchPriority={priority ? "high" : "auto"}
                  className="object-contain"
                />
              ) : (
                <School className="text-muted-foreground/60 h-6 w-6" />
              )}
            </m.div>

            <div className="min-w-0 flex-1 pb-1">
              <h1 className="text-foreground line-clamp-1 text-base leading-tight font-semibold">
                {school.name}
              </h1>
              <p className="text-foreground line-clamp-1 text-sm leading-tight font-semibold">
                {school.nickname}
              </p>
            </div>
          </div>

          {/* Bottom Row: Location & Count */}
          <div className="flex items-center justify-between">
            {/* Location */}
            <p className="text-muted-foreground flex items-center gap-1 text-sm font-medium">
              <MapPin className="text-destructive size-3.5" />
              <span className="line-clamp-1">
                {firstCampus || "Main Campus"}
              </span>
            </p>

            {/* Student Count */}
            {school.isLoading ? (
              <Loader2 className="text-muted-foreground h-3 w-3 animate-spin" />
            ) : (
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary rounded-full border-none px-2 py-0.5 text-xs font-semibold"
              >
                {formatCount(school.totalPatients ?? school.studentCount ?? 0)}{" "}
                Patients
              </Badge>
            )}
          </div>
        </div>
      </Link>
    </m.div>
  );
}
