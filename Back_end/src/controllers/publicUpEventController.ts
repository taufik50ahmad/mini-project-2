import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import publicUpEventService from "../services/publicUpEventService.js";

async function publicUpEventController(req: Request, res: Response) {
  try {
    let user: any = null;

    // 🔐 Extract token (optional)
    const token = req.headers.authorization?.split(" ")[1];

    if (token) {
      try {
        user = jwt.verify(token, process.env.JWT_SECRET!);
      } catch {
        user = null; // ignore invalid token
      }
    }

    // ✅ Detect public mode
    const isPublic = req.query.public === "true";

    // 🔥 Call updated service
    const result = await publicUpEventService(user, isPublic);

    return res.status(200).json(result);
  } catch (error: any) {
    console.error("PUBLIC EVENT ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch events",
      error: error.message,
    });
  }
}

export default publicUpEventController;