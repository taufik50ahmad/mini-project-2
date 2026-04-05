import { Router } from "express";
import getEventDataController from "../controllers/getEventDataController.js";

const router = Router();

router.get("/events/detail", getEventDataController);

export default router;