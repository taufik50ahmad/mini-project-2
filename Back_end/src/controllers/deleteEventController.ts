import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { deleteEventService } from "../services/deleteEventService.js";

export const deleteEventController = async (req: Request, res: Response) => {
  try {
    const eventId = Number(req.params.id);

    if (!eventId) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    // 🔐 Get user from token
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let user: any;

    try {
      user = jwt.verify(token, process.env.JWT_SECRET!);
    } catch {
      return res.status(401).json({ message: "Invalid token" });
    }

    const result = await deleteEventService(eventId, user);

    return res.status(200).json(result);
  } catch (error: any) {
    console.error("DELETE EVENT ERROR:", error);

    return res.status(500).json({
      message: "Failed to delete event",
      error: error.message,
    });
  }
};