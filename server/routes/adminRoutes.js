import express from "express";
import {
  deleteTripByAdmin,
  deleteUser,
  getStats,
  getTrips,
  getUsers,
} from "../controllers/adminController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/stats", getStats);
router.get("/users", getUsers);
router.get("/trips", getTrips);
router.delete("/users/:id", deleteUser);
router.delete("/trips/:id", deleteTripByAdmin);

export default router;
