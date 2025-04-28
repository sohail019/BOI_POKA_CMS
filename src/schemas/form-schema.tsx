import { z } from "zod";

// Create a custom regex for a valid email format if needed
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Zod schema for adding a user
export const FormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name cannot be longer than 100 characters"),

  email: z
    .string()
    .min(1, "Email is required")
    .regex(emailRegex, "Please enter a valid email address")
    .max(100, "Email cannot be longer than 100 characters"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password cannot be longer than 128 characters"),

  mobileNumber: z
    .string()
    .min(1, "Mobile number is required")
    .regex(/^\d{10}$/, "Please enter a valid 10-digit mobile number"),

  location: z
    .string()
    .min(1, "Location is required")
    .max(200, "Location cannot be longer than 200 characters"),

  bankName: z
    .string()
    .min(1, "Bank name is required")
    .max(100, "Bank name cannot be longer than 100 characters"),

  accountNumber: z
    .string()
    .min(1, "Account number is required")
    .max(20, "Account number cannot be longer than 20 characters"),

  ifscCode: z
    .string()
    .min(1, "IFSC code is required")
    .max(20, "IFSC code cannot be longer than 20 characters"),

  role: z
    .string()
    .min(1, "Role is required")
    .refine((val) => ["User", "Admin", "SuperAdmin"].includes(val), {
      message: "Invalid role",
    }),

  terms: z
    .boolean()
    .refine((val) => val === true, "You must accept the terms and conditions"),
});

