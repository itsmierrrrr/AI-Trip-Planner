const normalizeApiBaseUrl = (rawValue) => {
  const fallback = "http://localhost:5000/api";
  const firstValue = (rawValue || fallback)
    .split(",")
    .map((part) => part.trim())
    .find(Boolean);
  const value = (firstValue || fallback).replace(/\/+$/, "");

  return value.endsWith("/api") ? value : `${value}/api`;
};

const env = {
  apiBaseUrl: normalizeApiBaseUrl(import.meta.env.VITE_API_URL),
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID",
  appName: import.meta.env.VITE_APP_NAME || "lessgo ai",
  heroHeadline: import.meta.env.VITE_HERO_HEADLINE || "Your Next Trip, Designed by AI",
  heroSubheading:
    import.meta.env.VITE_HERO_SUBHEADING ||
    "A futuristic travel intelligence layer that builds routes, budgets, stays, and hidden gem discoveries in one smooth command.",
  heroPromptExample:
    import.meta.env.VITE_HERO_PROMPT_EXAMPLE || "Plan me a 7-day Japan trip under ₹1 lakh",
  plannerPromptPlaceholder:
    import.meta.env.VITE_PLANNER_PROMPT_PLACEHOLDER || "Describe Your Trip",
  loadingMessages:
    import.meta.env.VITE_LOADING_MESSAGES?.split("|") || [
      "Scanning the planet for hidden gems...",
      "Teaching the AI how to pack a suitcase...",
      "Negotiating hotel prices with imaginary robots...",
      "Calculating how beautiful you are...",
      "Can we go to the Moon together...",

    ],
};

export default env;
