import * as z from "zod";

export const ProviderEmailSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email" })
    .min(1, "Please enter your email address"),
});

export const ProviderLoginSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email" })
    .min(1, "Please enter your email address"),
  password: z.string().min(1, { message: "Please enter password" }),
});

export const ProviderSignUpSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email" })
    .min(1, "Please enter your email address"),
  title: z.string().min(1, { message: "Please select your title" }),
  fullName: z.string().min(1, { message: "Please enter full name" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export type ProviderEmailFormData = z.infer<typeof ProviderEmailSchema>;
export type ProviderLoginFormData = z.infer<typeof ProviderLoginSchema>;
export type ProviderSignUpFormData = z.infer<typeof ProviderSignUpSchema>;
