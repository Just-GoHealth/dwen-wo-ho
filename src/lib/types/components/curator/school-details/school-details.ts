import { SchoolIcon } from "@/lib/types/entities/school";
import type { SchoolProvider } from "@/lib/types/entities/provider";
import type { SchoolDetailSearchSuggestion } from "@/lib/types/components/curator/school-search";
import type { FilterOption } from "@/lib/types/components/shared/search-dropdown";
import type { Route } from "next";

export interface SchoolDetailsIconsTabProps {
  icons: SchoolIcon[];
  onIconClick: (icon: SchoolIcon) => void;
  onAddFirstIcon: () => void;
}

export interface SchoolPatientRecord {
  // the result id - null for a curator roster entry with no submitted
  // result yet (curators see every registered patient at the campus,
  // providers only ever see submitted-result patients, so this is only
  // ever null on curator-facing rows). Result-specific actions (view
  // result, delete record) must be hidden/disabled when this is null.
  id: number | string | null;
  // the stable identifier for this patient, present on every row
  // regardless of whether they have a submitted result
  patientId: number | string;
  lockinId: number;
  schoolId: number;
  schoolName: string;
  schoolNickname: string;
  patientName: string;
  patientAge?: number;
  patientSex?: string;
  visibilityStatus: string;
  starProvider?: string | null;
  referredProvider?: string | null;
  createdAt: string;
  firstOpenedAt?: string | null;
  openedByCurrentUser?: boolean;
  treatingProviders?: string[];
  lockinScore: number;
  comment?: string | null;
  patientLevel: string;
  profilePhotoURL?: string | null;
  // server-decided triage tag - never recompute this client-side (see
  // deriveTriageTier in triage.ts, which is only a fallback for data that
  // doesn't have this field yet)
  nsmqTag?: "911" | "NOW" | "ASAP" | null;
  nsmqReasonCode?: string | null;
  nsmqResponseDueAt?: string | null;
}

export interface PatientsTabProps {
  patients: SchoolPatientRecord[];
  isLoading: boolean;
  schoolId: string;
  schoolName?: string;
  compactTimeAgo: (date: string) => string;
  onViewPatient: (patientId: number | string) => void;
}

export type SchoolTab = "patients" | "icons" | "providers";

export interface SchoolDetailsErrorViewProps {
  error?: string | null;
  onBack: () => void;
}

export interface SchoolDetailsPageContentProps<TDetails> {
  details: TDetails;
}

export interface SchoolDetailsBackNavProps {
  onBack: () => void;
}

export interface SchoolDetailsSearchSectionProps {
  activeTab: SchoolTab;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  setAppliedSearchQuery: (v: string) => void;
  suggestions: SchoolDetailSearchSuggestion[];
  quickFilters: FilterOption[];
  localActiveFilters: FilterOption[];
  toggleFilter: (filter: FilterOption) => void;
  removeFilter: (filter: FilterOption) => void;
  clearFilters: () => void;
  schoolId: string;
  schoolIcons: SchoolIcon[];
  onProviderClick: (provider: { email: string }) => void;
  setEditingIcon: (icon: SchoolIcon | null) => void;
  setShowAddIconWizard: (open: boolean) => void;
  router: { push: (href: Route) => void };
}

export interface SchoolDetailsTabContentProps {
  activeTab: SchoolTab;
  patients: SchoolPatientRecord[];
  patientsLoading: boolean;
  schoolId: string;
  schoolName: string;
  compactTimeAgo: (date: string) => string;
  appliedSearchQuery: string;
  onViewPatient: (patientId: string | number) => void;
  schoolIcons: SchoolIcon[];
  onIconClick: (icon: SchoolIcon) => void;
  onAddFirstIcon: () => void;
  providers: SchoolProvider[];
  providersLoading: boolean;
  onProviderClick: (provider: { email: string }) => void;
}

export interface ProvidersTabProps {
  providers: SchoolProvider[];
  isLoading: boolean;
  onProviderClick: (provider: SchoolProvider) => void;
}

export interface SchoolDetailsOverlayHostProps<TDetails = unknown> {
  details: TDetails;
}
