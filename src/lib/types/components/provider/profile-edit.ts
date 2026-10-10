export type ProviderProfileTextField =
  "title" | "name" | "specialty" | "status";

export interface PersistProviderProfileEditParams {
  editFieldKey: string | null;
  editValue: string;
  profileStatus: string;
  updateProfile: (input: {
    fieldKey: ProviderProfileTextField;
    value: string;
  }) => Promise<unknown>;
  updatePhoneNumber: (input: {
    officePhoneNumber: string;
    currentStatus: string;
  }) => Promise<unknown>;
}
