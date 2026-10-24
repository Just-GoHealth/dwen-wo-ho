import { ProviderDetails } from "@/lib/types/entities/provider";
import {
  AssociatedSchool,
  AssociatedPartner,
} from "@/lib/types/entities/partners";

export interface ProviderHeaderProps {
  provider: ProviderDetails;
  onClose: () => void;
  statusConfig: {
    bg: string;
    text: string;
    border: string;
  };
}

export interface ProviderTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  associatedSchoolsCount: number;
  associatedPartnersCount: number;
}

export interface OverviewTabProps {
  provider: ProviderDetails;
}

export interface SchoolsTabProps {
  isLoadingSchools: boolean;
  associatedSchools: AssociatedSchool[];
  schoolSearchQuery: string;
  setSchoolSearchQuery: (query: string) => void;
  filteredAvailableSchools: AssociatedSchool[];
  setSchoolToRemove: (school: AssociatedSchool) => void;
  setSchoolToAdd: (school: AssociatedSchool) => void;
  applicationStatus: string | undefined;
  /** False while v2 can't list a provider's campuses (associated list hidden). */
  associationsAvailable?: boolean;
}

export interface PartnersTabProps {
  isLoadingPartners: boolean;
  associatedPartners: AssociatedPartner[];
  partnerSearchQuery: string;
  setPartnerSearchQuery: (query: string) => void;
  filteredAvailablePartners: AssociatedPartner[];
  setPartnerToRemove: (partner: AssociatedPartner) => void;
  setPartnerToAdd: (partner: AssociatedPartner) => void;
  /** False while v2 can't list a provider's hosts (associated list hidden). */
  associationsAvailable?: boolean;
}

export interface ProviderFooterProps {
  applicationStatus: string | undefined;
  handleApproveClick: () => void;
  handleRejectClick: () => void;
  isModerating: boolean;
  moderatingProviderId: string | null;
  providerId: string;
  currentAction: "approving" | "rejecting" | null;
  onClose: () => void;
}

export interface ProviderConfirmationOverlayHostProps {
  schoolToAdd: AssociatedSchool | null;
  setSchoolToAdd: (school: AssociatedSchool | null) => void;
  handleAddSchool: (school: AssociatedSchool) => void;
  isAddingSchool: boolean;
  schoolToRemove: AssociatedSchool | null;
  setSchoolToRemove: (school: AssociatedSchool | null) => void;
  handleRemoveSchool: (school: AssociatedSchool) => void;
  isRemovingSchool: boolean;
  partnerToAdd: AssociatedPartner | null;
  setPartnerToAdd: (partner: AssociatedPartner | null) => void;
  handleAddPartner: (partner: AssociatedPartner) => void;
  isAddingPartner?: boolean;
  partnerToRemove: AssociatedPartner | null;
  setPartnerToRemove: (partner: AssociatedPartner | null) => void;
  handleRemovePartner: (partner: AssociatedPartner) => void;
  isRemovingPartner?: boolean;
  providerName: string | undefined;
  showApproveModal: boolean;
  setShowApproveModal: (show: boolean) => void;
  handleApproveConfirm: () => void;
  showRejectModal: boolean;
  setShowRejectModal: (show: boolean) => void;
  handleRejectConfirm: () => void;
  currentAction: "approving" | "rejecting" | null;
}
