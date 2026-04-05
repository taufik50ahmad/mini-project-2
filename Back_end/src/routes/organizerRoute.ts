import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { getOrganizerTransactionsController } from "../controllers/organizerController.js";

const router = Router();

router.get("/transactions", verifyToken, getOrganizerTransactionsController);

export default router;