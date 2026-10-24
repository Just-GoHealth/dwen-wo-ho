import type { ComponentType } from "react";
import {
  AssociatedSchool,
  AssociatedProvider,
  PartnerDetailsTab,
  Partner,
} from "@/lib/types/entities/partners";

export interface PartnerHeaderProps {
  partner: Partner | null;
  onClose: () => void;
}

export interface PartnerTab {
  id: PartnerDetailsTab;
  label: string;
  icon: ComponentType<{ className?: string }>;
  count?: number;
}

export interface PartnerTabsProps {
  tabs: PartnerTab[];
  activeTab: PartnerDetailsTab;
  setActiveTab: (tabId: PartnerDetailsTab) => void;
}

export interface OverviewTabProps {
  partner: Partner | null;
}

export interface SchoolsTabProps {
  isLoadingSchools: boolean;
  associatedSchools: AssociatedSchool[];
  filteredAvailableSchools: AssociatedSchool[];
  schoolSearchQuery: string;
  setSchoolSearchQuery: (query: string) => void;
  handleSchoolClick: (school: AssociatedSchool) => void;
  setSchoolToRemove: (school: AssociatedSchool) => void;
  setSchoolToAdd: (school: AssociatedSchool) => void;
  /**
   * False while v2 can't list a host's campuses.
   * TODO(v2-backend): GET /hosts/{id}/campuses rows carry no campusId.
   */
  associationsAvailable?: boolean;
}

export interface ProvidersTabProps {
  isLoadingProviders: boolean;
  associatedProviders: AssociatedProvider[];
  filteredAvailableProviders: AssociatedProvider[];
  providerSearchQuery: string;
  setProviderSearchQuery: (query: string) => void;
  handleProviderClick: (provider: AssociatedProvider) => void;
  setProviderToRemove: (provider: AssociatedProvider) => void;
  setProviderToAdd: (provider: AssociatedProvider) => void;
}

export interface PartnerConfirmationOverlayHostProps {
  schoolToAdd: AssociatedSchool | null;
  setSchoolToAdd: (school: AssociatedSchool | null) => void;
  handleAddSchool: (school: AssociatedSchool) => void;
  isAddingSchool: boolean;
  schoolToRemove: AssociatedSchool | null;
  setSchoolToRemove: (school: AssociatedSchool | null) => void;
  handleRemoveSchool: (school: AssociatedSchool) => void;
  isRemovingSchool: boolean;
  providerToAdd: AssociatedProvider | null;
  setProviderToAdd: (provider: AssociatedProvider | null) => void;
  handleAddProvider: (provider: AssociatedProvider) => void;
  isAddingProvider: boolean;
  providerToRemove: AssociatedProvider | null;
  setProviderToRemove: (provider: AssociatedProvider | null) => void;
  handleRemoveProvider: (provider: AssociatedProvider) => void;
  isRemovingProvider: boolean;
}
