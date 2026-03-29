import dotenv from "dotenv";

dotenv.config();

const clientUrls = (process.env.CLIENT_URLS || process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((url) => url.trim())
  .filter(Boolean);

const env = {
  port: Number(process.env.PORT || 5000),
  serverUrl: process.env.SERVER_URL || "http://localhost:5000",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  clientUrls,
  allowAnyLocalhostOrigin: (process.env.CORS_ALLOW_LOCALHOST || "true").toLowerCase() === "true",
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  openRouterApiKey: process.env.OPENROUTER_API_KEY,
  openRouterApiUrl:
    process.env.OPENROUTER_API_URL || "https://openrouter.ai/api/v1/chat/completions",
  openRouterModel: process.env.OPENROUTER_MODEL || "openrouter/free",
  openRouterAppName: process.env.OPENROUTER_APP_NAME || "AI Trip Planner",
};

export const validateEnv = () => {
  const required = [
    "mongodbUri",
    "jwtSecret",
    "googleClientId",
    "openRouterApiKey",
  ];

  const missing = required.filter((key) => !env[key]);
  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
};

export default env;
