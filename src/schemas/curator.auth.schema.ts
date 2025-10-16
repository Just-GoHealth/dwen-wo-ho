import * as z from "zod";

export const CuratorEmailSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email" })
    .min(1, "Please enter your email address"),
});

export const CuratorLoginSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email" })
    .min(1, "Please enter your email address"),
  password: z.string().min(1, { message: "Please enter password" }),
});

export type CuratorEmailFormData = z.infer<typeof CuratorEmailSchema>;
export type CuratorLoginFormData = z.infer<typeof CuratorLoginSchema>;
