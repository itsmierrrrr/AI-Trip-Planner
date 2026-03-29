import express from "express";
import { deleteUser, getStats, getTrips, getUsers, getUsersWithTrips, verifyAdminCode } from "../controllers/adminController.js";

const router = express.Router();

// Public endpoint - verify security code
router.post("/verify-code", verifyAdminCode);

// Protected endpoint - requires Bearer token from verification
const verifyAdminToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized - no token provided" });
  }
  next();
};

router.get("/stats", verifyAdminToken, getStats);
router.get("/users", verifyAdminToken, getUsers);
router.get("/users-with-trips", verifyAdminToken, getUsersWithTrips);
router.get("/trips", verifyAdminToken, getTrips);
router.delete("/users/:id", verifyAdminToken, deleteUser);

export default router;
