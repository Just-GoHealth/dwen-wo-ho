export interface Provider {
  id: string;

  email: string;

  fullName?: string;

  providerName?: string;

  professionalTitle?: string;

  providerTitle?: string | null;

  specialty?: string | null;

  officePhoneNumber?: string | null;

  applicationDate?: string;

  applicationStatus?: "PENDING" | "APPROVED" | "REJECTED";

  profilePhotoURL?: string | null;

  status?: string | null;

  bio?: string | null;

  lastActive?: string;

  ranking?: string; // frontend-only computed field, not in API spec
}

export interface ProviderDetails extends Provider {
  profilePhotoURL?: string | null;

  createdAt?: string;

  updatedAt?: string;

  specialty?: string;

  specialties?: string[];

  schools?: import("./school").School[];

  partners?: import("../api/providers").ProviderAssociatedPartner[];
}

export interface SchoolProvider {
  id: string;

  email: string;

  providerName: string;

  providerTitle: string;

  specialty: string;

  officePhoneNumber: string;

  profilePhotoURL: string;

  applicationStatus: string;

  isAssociated: boolean;
}

export interface IProviderResponse {
  success: boolean;

  data: Provider[];

  message: string;
}

export interface ApiActionResponse {
  success: boolean;

  message?: string;

  data?: Provider;
}
