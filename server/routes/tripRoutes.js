import express from "express";
import { deleteTrip, generateTrip, getUserTrips, saveTrip } from "../controllers/tripController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/generate", protect, generateTrip);
router.get("/", protect, getUserTrips);
router.post("/save", protect, saveTrip);
router.delete("/:id", protect, deleteTrip);

export default router;
