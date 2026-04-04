import type { Request, Response } from "express";
import { registerSchema } from "../validators/auth.validate.js";
import z from "zod";
import { registerService } from "../services/registerService.js";

export async function registerController(req: Request, res: Response) {
  const validation = registerSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: z.flattenError(validation.error),
    });
  }

  try {
    const { confirmPassword, ...rest } = validation.data;

    // ✅ BUILD OBJECT SAFELY (NO undefined)
    const cleanData: any = {
      name: rest.name,
      email: rest.email,
      password: rest.password,
    };

    if (rest.role !== undefined) {
      cleanData.role = rest.role;
    }

    if (rest.referralCode !== undefined) {
      cleanData.referralCode = rest.referralCode;
    }

    const user = await registerService(cleanData);

    return res.status(201).json({
      message: "User registered successfully",
      data: user,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
}
