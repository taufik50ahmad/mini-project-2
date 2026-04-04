import type { Request, Response } from "express";
import { getOrganizerTransactionsService } from "../services/organizerService.js";

export const getOrganizerTransactionsController = async (
  req: Request,
  res: Response,
) => {
  try {
    if ((req as any).user.role !== "ORGANIZER") {
      return res.status(403).json({
        message: "Only organizer allowed",
      });
    }

    const organizerId = (req as any).user.id;

    const transactions = await getOrganizerTransactionsService(organizerId);

    return res.status(200).json(transactions);
  } catch (error: any) {
    return res.status(500).json({
      message: "Failed to fetch transactions",
      error: error.message,
    });
  }
};