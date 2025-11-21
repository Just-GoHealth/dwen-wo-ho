export interface IProvider {
  providerName: string;
  email: string;
  specialty: string;
  officePhoneNumber: string;
  applicationDate: string;
  applicationStatus: "PENDING" | "APPROVED" | "REJECTED";
  profilePhotoURL: string;
}

export interface IProviderResponse {
  success: boolean;
  data: IProvider[];
  message: string;
}
