import cors from "cors";
import express from "express";
import connectDB from "./config/db.js";
import env, { validateEnv } from "./config/env.js";
import adminRoutes from "./routes/adminRoutes.js";
import publicAdminRoutes from "./routes/publicAdminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import tripRoutes from "./routes/tripRoutes.js";

const app = express();

validateEnv();
connectDB();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      const inWhitelist = env.clientUrls.includes(origin);
      const isLocalhostDev = env.allowAnyLocalhostOrigin && /^http:\/\/localhost:\d+$/.test(origin);

      if (inWhitelist || isLocalhostDev) {
        callback(null, true);
        return;
      }

      callback(new Error("CORS blocked for this origin"));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin-panel", publicAdminRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);

  if (err?.message?.includes("CORS blocked")) {
    return res.status(403).json({ message: err.message });
  }

  return res.status(500).json({ message: "Internal server error" });
});

app.listen(env.port, () => {
  console.log(`Server running on ${env.serverUrl}`);
});
