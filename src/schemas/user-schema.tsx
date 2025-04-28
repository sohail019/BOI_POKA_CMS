import { z } from "zod";

export const AddUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  role: z.string().min(1, "Role is required"),
  mobileNumber: z.string().min(10, "Mobile number must be at least 10 digits"),
  location: z.string().min(1, "Location is required"),
});
