import { z } from "zod/v4";

const USERNAME_REGEX = /^\w{3,20}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/;

export const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, "Enter your email or username")
    .refine(
      value => EMAIL_REGEX.test(value) || USERNAME_REGEX.test(value),
      "Enter a valid email or username.",
    ),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters."),
});

export type LoginFormData = z.infer<typeof loginSchema>;
