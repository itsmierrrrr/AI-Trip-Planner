import AIRequest from "../models/AIRequest.js";
import Trip from "../models/Trip.js";
import User from "../models/User.js";

const ADMIN_CODE = "6969";

/**
 * Verify admin security code
 */
export const verifyAdminCode = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: "Security code is required" });
    }

    if (code !== ADMIN_CODE) {
      return res.status(401).json({ message: "Invalid security code" });
    }

    // Return a token for subsequent requests
    const token = Buffer.from(`admin:${Date.now()}`).toString("base64");
    return res.status(200).json({ 
      token, 
      message: "Access granted" 
    });
  } catch (error) {
    return res.status(500).json({ message: "Verification failed", error: error.message });
  }
};

export const getUsers = async (_req, res) => {
  try {
    const users = await User.find().select("name email role createdAt").sort({ createdAt: -1 });
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch users", error: error.message });
  }
};

export const getTrips = async (_req, res) => {
  try {
    const trips = await Trip.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json(trips);
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch trips", error: error.message });
  }
};

/**
 * Get all users with their trips grouped
 */
export const getUsersWithTrips = async (_req, res) => {
  try {
    const users = await User.find().select("_id name email role createdAt").sort({ createdAt: -1 });
    
    // Fetch trips for all users
    const allTrips = await Trip.find().select("_id userId prompt generatedTrip createdAt");
    
    // Group trips by userId
    const usersWithTrips = users.map((user) => ({
      ...user.toObject(),
      trips: allTrips.filter((trip) => trip.userId.toString() === user._id.toString()),
      tripCount: allTrips.filter((trip) => trip.userId.toString() === user._id.toString()).length,
    }));

    return res.status(200).json(usersWithTrips);
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch users with trips", error: error.message });
  }
};

export const getStats = async (_req, res) => {
  try {
    const [totalUsers, totalTrips, totalAIRequests] = await Promise.all([
      User.countDocuments(),
      Trip.countDocuments(),
      AIRequest.countDocuments(),
    ]);

    return res.status(200).json({ totalUsers, totalTrips, totalAIRequests });
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch stats", error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(400).json({ message: "Admin users cannot be deleted" });
    }

    await Promise.all([
      Trip.deleteMany({ userId: user._id }),
      AIRequest.deleteMany({ userId: user._id }),
      user.deleteOne(),
    ]);

    return res.status(200).json({ message: "User deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Unable to delete user", error: error.message });
  }
};

export const deleteTripByAdmin = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    await trip.deleteOne();
    return res.status(200).json({ message: "Trip deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Unable to delete trip", error: error.message });
  }
};
