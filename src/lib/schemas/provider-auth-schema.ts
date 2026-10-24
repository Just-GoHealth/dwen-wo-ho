import z from "zod/v4";

export const ProviderEmailSchema = z.object({
  email: z
    .email({ message: "Please enter a valid email" })
    .min(1, "Please enter your email address"),
});

export const ProviderLoginSchema = z.object({
  email: z
    .email({ message: "Please enter a valid email" })
    .min(1, "Please enter your email address"),
  password: z.string().min(1, { message: "Please enter password" }),
});

export const ProviderSignUpSchema = z.object({
  email: z
    .email({ message: "Please enter a valid email" })
    .min(1, "Please enter your email address"),
  title: z
    .string()
    .min(1, { message: "Please select your title" })
    .max(30, { message: "Use 30 characters or fewer" }),
  fullName: z
    .string()
    .trim()
    .min(3, { message: "Please enter your full name" })
    .max(100, { message: "Use 100 characters or fewer" }),
  password: z
    .string()
    .min(6, {
      message:
        "Use 6 to 72 characters, with at least one letter and one number",
    })
    .refine((v) => /\p{L}/u.test(v) && /\d/.test(v), {
      message:
        "Use 6 to 72 characters, with at least one letter and one number",
    }),
});

export type ProviderEmailFormData = z.output<typeof ProviderEmailSchema>;
export type ProviderLoginFormData = z.output<typeof ProviderLoginSchema>;
export type ProviderSignUpFormData = z.output<typeof ProviderSignUpSchema>;

/** Backend rule: 6+ chars, a letter and a digit, at most 72 UTF-8 bytes. */
export const PASSWORD_RULE_MESSAGE =
  "Use 6 to 72 characters, with at least one letter and one number";

const V2PasswordSchema = z
  .string()
  .min(6, { message: PASSWORD_RULE_MESSAGE })
  .refine((v) => /\p{L}/u.test(v) && /\d/.test(v), {
    message: PASSWORD_RULE_MESSAGE,
  })
  .refine((v) => new TextEncoder().encode(v).length <= 72, {
    message: PASSWORD_RULE_MESSAGE,
  });

export const ProviderPasswordSchema = z
  .object({
    password: V2PasswordSchema,
    confirmPassword: z
      .string()
      .min(6, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type ProviderPasswordFormData = z.output<typeof ProviderPasswordSchema>;

export const ProviderProfilePhotoStepSchema = z.object({
  photo: z
    .string()
    .nullable()
    .refine((value): value is string => !!value && value.length > 0, {
      message: "Please upload a photo",
    }),
});

const GhanaPhoneNumberSchema = z
  .string()
  .transform((value) => value.replace(/\D/g, ""))
  .pipe(
    z
      .string()
      .refine((digits) => /^\d{9}$/.test(digits) || /^0\d{9}$/.test(digits), {
        message:
          "Please enter a valid 9-digit number or 10-digit number starting with 0",
      })
      .transform((digits) =>
        digits.length === 10 ? `+233${digits.slice(1)}` : `+233${digits}`,
      ),
  );

export const ProviderProfileBioStepSchema = z.object({
  phoneNumber: GhanaPhoneNumberSchema,
  // Optional in v2 (the slogan doesn't count towards the application).
  bio: z
    .string()
    .trim()
    .max(140, { message: "My Slogan must be 140 characters or less" }),
});

export const ProviderProfileSpecialtyStepSchema = z.object({
  specialty: z.string().min(1, { message: "Please select a specialty" }),
});

export type ProviderProfileBioStepData = z.output<
  typeof ProviderProfileBioStepSchema
>;
