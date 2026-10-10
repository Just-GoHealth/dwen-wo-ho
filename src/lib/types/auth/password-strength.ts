export interface PasswordRequirements {
  length: boolean;
  lowercase: boolean;
  uppercase: boolean;
  number: boolean;
  special: boolean;
}

export type PasswordStrengthTone =
  "destructive" | "warning" | "successLight" | "success";

export type PasswordStrengthLabel =
  "Weak" | "Moderate" | "Strong" | "VeryStrong";

export interface PasswordStrengthResult {
  score: number;
  label: PasswordStrengthLabel;
  tone: PasswordStrengthTone;
  requirements: PasswordRequirements;
}

export interface PasswordStrengthIndicatorProps {
  password: string;
}

export interface PasswordMatchIndicatorProps {
  password: string;
  confirmPassword: string;
  matchLabel: string;
  mismatchLabel: string;
}
