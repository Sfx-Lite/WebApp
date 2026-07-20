import { z } from "zod/v4";

const USER_REGEX = /^[a-z][\w-]{3,23}$/i;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%]).{8,24}$/;

export const registerSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(50, "First name is too long"),

  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(50, "Last name is too long"),

  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address")
    .max(254, "Email is too long"),

  username: z
    .string()
    .trim()
    .regex(
      USER_REGEX,
      "Username must be 4-24 characters, start with a letter, and contain only letters, numbers, '-' or '_'.",
    ),

  country: z.string().trim().min(1, "Please select your country"),

  password: z
    .string()
    .regex(
      PWD_REGEX,
      "Password must be 8-24 characters and include uppercase, lowercase, number and special character (!@#$%).",
    ),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

// Convenience type for field-level error state, e.g. useState<RegisterFormErrors>({})
// export type RegisterFormErrors = Partial<Record<keyof RegisterFormData, string>>;
