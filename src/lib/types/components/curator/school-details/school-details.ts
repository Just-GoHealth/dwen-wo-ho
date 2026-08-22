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
  id: number | string;
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
  /**
   * Patient's profile photo, if one exists. Field name is a best-evidence
   * guess, not confirmed against a real API spec — see the identical
   * comment on `PatientResult.photoUrl` (`src/lib/types/entities/patient.ts`)
   * for the reasoning. Verify against the real backend response for the
   * curator school-patients endpoint and rename if it differs.
   */
  photoUrl?: string;
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
