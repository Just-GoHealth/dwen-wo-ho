export interface ProviderDetails {
  id: string;
  email: string;
  fullName: string;
  professionalTitle: string;
  status?: string;
  officePhoneNumber?: string;
  specialties?: string[];
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
  applicationStatus?: "PENDING" | "APPROVED" | "REJECTED";
  applicationDate?: string;
}

export interface AssociatedSchool {
  id: string;
  name: string;
  joinedDate: string;
  isAssociated: boolean;
}

export interface AssociatedPartner {
  id: string;
  name: string;
  joinedDate: string;
  isAssociated: boolean;
}
