import type { Request, Response } from "express";
import resetPassService from "../services/resetPassService.js";
import { resetPasswordSchema } from "../validators/auth.validate.js";
import z from "zod";

async function resetPassController(req: Request, res: Response) {
  const validation = resetPasswordSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: z.flattenError(validation.error),
    });
  }

  try {
    const { token, newPassword } = validation.data;

    await resetPassService({ token, newPassword });

    return res.status(200).json({
      message: "Password reset successful",
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }

}

export default resetPassController;
