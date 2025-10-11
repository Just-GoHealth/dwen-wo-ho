import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatTime = (totalSeconds: number): string => {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export const signUpSteps = ["Create", "Verify", "Profile"] as [
  "Create",
  "Verify",
  "Profile"
];

export const recoverSteps = ["Find", "Verify", "New Password"] as [
  "Find",
  "Verify",
  "New Password"
];
