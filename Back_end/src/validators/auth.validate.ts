import z from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),

    email: z.string().pipe(z.email({ message: "Invalid email format" })),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must include one uppercase letter")
      .regex(/[a-z]/, "Must include one lowercase letter")
      .regex(/[0-9]/, "Must include one number")
      .regex(/[^A-Za-z0-9]/, "Must include at least one special character"),

    confirmPassword: z.string(),

    role: z.enum(["CUSTOMER", "ORGANIZER"]).optional(),

    referralCode: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Token is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must include one uppercase letter")
      .regex(/[a-z]/, "Must include one lowercase letter")
      .regex(/[0-9]/, "Must include one number")
      .regex(/[^A-Za-z0-9]/, "Must include at least one special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // 🔥 IMPORTANT
  });

export const updateProfileSchema = z
  .object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),

    password: z
      .string()
      .min(8)
      .regex(/[A-Z]/)
      .regex(/[a-z]/)
      .regex(/[0-9]/)
      .regex(/[^A-Za-z0-9]/)
      .optional(),

    confirmPassword: z.string().optional(),
  })
  .refine((data) => !data.password || data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
