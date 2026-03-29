import axios from "axios";
import env from "../config/env.js";
import AIRequest from "../models/AIRequest.js";
import Trip from "../models/Trip.js";
import { getWeatherByCity } from "../services/weatherService.js";

const SYSTEM_PROMPT = `You are an AI travel planner. Generate a complete travel plan in valid JSON format with these fields:
{
overview: {
destination,
duration,
budget,
bestTime,
weather: { temperature, condition, humidity }
},
itinerary: [
{
day,
title,
activities
}
],
hotels: [
{
name,
price,
rating,
description,
bookingLink
}
],
budgetBreakdown: {
hotel,
food,
travel,
activities,
extra
},
travelTips: [],
weather: { 
destination, 
temperature, 
condition, 
humidity, 
windSpeed, 
bestMonths 
}
}

Rules:
- Do not include image URLs for hotels.
- Always include bookingLink as a valid http/https URL for each hotel.`;

const OPENROUTER_API_URL = env.openRouterApiUrl;
const OPENROUTER_MODEL = env.openRouterModel;
const OPENROUTER_APP_NAME = env.openRouterAppName;

const isPlaceholderKey = (value) => {
  if (!value) return true;
  const normalized = value.trim().toLowerCase();
  return normalized.includes("your_openrouter_api_key") || normalized === "changeme";
};

const hasUsableWeather = (weather) => {
  if (!weather || typeof weather !== "object") return false;
  const temp = String(weather.temperature || "").trim().toLowerCase();
  const condition = String(weather.condition || "").trim().toLowerCase();

  const invalidTemp = !temp || temp === "n/a" || temp === "unknown";
  const invalidCondition =
    !condition ||
    condition.includes("unavailable") ||
    condition.includes("not provided");

  return !invalidTemp && !invalidCondition;
};

const normalizeContentText = (content) => {
  if (typeof content === "string") return content;

  if (Array.isArray(content)) {
    return content
      .map((item) => {
        if (typeof item === "string") return item;
        if (item?.type === "text") return item.text || "";
        return item?.text || "";
      })
      .join("\n");
  }

  if (content && typeof content === "object") {
    if (typeof content.text === "string") return content.text;
    return JSON.stringify(content);
  }

  return "";
};

const parseAIJson = (rawContent) => {
  const text = normalizeContentText(rawContent);
  const cleaned = text
    .replace(/```json|```/gi, "")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2018\u2019]/g, "'")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");

    if (start === -1 || end === -1 || end <= start) {
      throw new Error("AI returned invalid JSON format");
    }

    const sliced = cleaned.slice(start, end + 1);
    const noTrailingCommas = sliced.replace(/,\s*([}\]])/g, "$1");
    return JSON.parse(noTrailingCommas);
  }
};

const toHotelSearchLink = (name, destination) => {
  const query = [name, destination, "hotel booking"]
    .filter(Boolean)
    .join(" ")
    .trim();
  return `https://www.google.com/travel/hotels?q=${encodeURIComponent(query)}`;
};

const isHttpUrl = (value) => {
  if (typeof value !== "string") return false;
  return /^https?:\/\//i.test(value.trim());
};

const normalizeHotels = (tripPayload, destination) => {
  if (!tripPayload || !Array.isArray(tripPayload.hotels)) return tripPayload;

  const normalizedHotels = tripPayload.hotels.map((hotel, index) => {
    const safeHotel = hotel && typeof hotel === "object" ? hotel : {};
    const hotelName = safeHotel.name || `Hotel Option ${index + 1}`;
    const bookingLink = isHttpUrl(safeHotel.bookingLink)
      ? safeHotel.bookingLink.trim()
      : toHotelSearchLink(hotelName, destination || tripPayload?.overview?.destination || "");

    return {
      ...safeHotel,
      name: hotelName,
      bookingLink,
    };
  });

  return {
    ...tripPayload,
    hotels: normalizedHotels,
  };
};

const buildFallbackTrip = ({ prompt, destination, budget, days }) => ({
  overview: {
    destination: destination || "Custom Destination",
    duration: days ? `${days} days` : "Flexible",
    budget: budget || "As specified in prompt",
    bestTime: "Based on weather and local season",
  },
  itinerary: [
    {
      day: 1,
      title: "Arrival and Local Exploration",
      activities: [
        "Check in and settle at accommodation",
        "Explore nearby landmarks and local food spots",
        "Plan detailed day-wise activities based on interests",
      ],
    },
  ],
  hotels: [
    {
      name: "Recommended City Stay",
      price: "Varies by season",
      rating: "4.2/5",
      description: "Comfortable location with easy city access",
      bookingLink: "https://www.google.com/travel/hotels",
    },
  ],
  budgetBreakdown: {
    hotel: "35%",
    food: "20%",
    travel: "20%",
    activities: "20%",
    extra: "5%",
  },
  travelTips: [
    "Book transport and stay early for better rates",
    "Keep digital and physical copies of key documents",
    `Use this prompt as reference for refinements: ${prompt}`,
  ],
});

export const generateTrip = async (req, res) => {
  try {
    const { prompt, destination, budget, days, travelers, travelStyle } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: "Trip prompt is required" });
    }

    // Fetch weather data for destination to enrich the prompt
    let weatherInfo = {};
    if (destination) {
      weatherInfo = await getWeatherByCity(destination);
    }

    const enrichedPrompt = [
      `User request: ${prompt}`,
      destination ? `Destination: ${destination}` : null,
      budget ? `Budget: ${budget}` : null,
      days ? `Days: ${days}` : null,
      travelers ? `Travelers: ${travelers}` : null,
      travelStyle ? `Travel style: ${travelStyle}` : null,
      hasUsableWeather(weatherInfo)
        ? `Current weather: ${weatherInfo.temperature}, ${weatherInfo.condition}, Humidity: ${weatherInfo.humidity}, Best time to visit: ${weatherInfo.bestMonths}`
        : null,
    ]
      .filter(Boolean)
      .join("\n");

    if (isPlaceholderKey(env.openRouterApiKey)) {
      return res.status(500).json({
        message: "AI service is not configured on the server. Set OPENROUTER_API_KEY in deployment environment variables.",
      });
    }

    const requestOrigin = req.get("origin") || req.get("referer") || env.clientUrl;

    const response = await axios.post(
      OPENROUTER_API_URL,
      {
        model: OPENROUTER_MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: enrichedPrompt },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${env.openRouterApiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": requestOrigin,
          "X-Title": OPENROUTER_APP_NAME,
        },
        timeout: 45000,
      }
    );

    const content = response.data?.choices?.[0]?.message?.content;
    if (!content) {
      return res.status(502).json({ message: "Empty response from OpenRouter" });
    }

    let generatedTrip;

    try {
      generatedTrip = parseAIJson(content);
    } catch {
      generatedTrip = buildFallbackTrip({ prompt, destination, budget, days });
    }

    generatedTrip = normalizeHotels(generatedTrip, destination);

    // Attach external weather only when it is valid, otherwise preserve AI-provided weather.
    if (hasUsableWeather(weatherInfo)) {
      generatedTrip.weather = weatherInfo;
    }

    await AIRequest.create({
      userId: req.user._id,
      prompt,
    });

    const savedTrip = await Trip.create({
      userId: req.user._id,
      prompt,
      generatedTrip,
    });

    return res.status(200).json({
      generatedTrip,
      autoSaved: true,
      savedTripId: savedTrip._id,
    });
  } catch (error) {
    const upstreamStatus = error.response?.status;
    const upstreamBody = error.response?.data;
    const upstreamMessage =
      upstreamBody?.error?.message ||
      upstreamBody?.message ||
      error.message ||
      "Unknown AI provider error";

    if (upstreamStatus === 401 || upstreamStatus === 403) {
      return res.status(502).json({
        message:
          "AI provider authentication failed. Verify OPENROUTER_API_KEY and allowed app settings in deployment.",
        providerStatus: upstreamStatus,
        providerMessage: upstreamMessage,
      });
    }

    if (upstreamStatus === 429) {
      return res.status(429).json({
        message: "AI provider rate limit reached. Please retry in a moment.",
        providerStatus: upstreamStatus,
        providerMessage: upstreamMessage,
      });
    }

    if (error.code === "ECONNABORTED") {
      return res.status(504).json({
        message: "AI provider timed out. Please try again.",
        providerMessage: upstreamMessage,
      });
    }

    return res.status(500).json({
      message: "Trip generation failed",
      providerStatus: upstreamStatus || null,
      providerMessage: upstreamMessage,
    });
  }
};

export const saveTrip = async (req, res) => {
  try {
    const { prompt, generatedTrip } = req.body;

    if (!prompt || !generatedTrip) {
      return res.status(400).json({ message: "Prompt and generated trip are required" });
    }

    const trip = await Trip.create({
      userId: req.user._id,
      prompt,
      generatedTrip,
    });

    return res.status(201).json(trip);
  } catch (error) {
    return res.status(500).json({ message: "Unable to save trip", error: error.message });
  }
};

export const getUserTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json(trips);
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch trips", error: error.message });
  }
};

export const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    const isOwner = trip.userId.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this trip" });
    }

    await trip.deleteOne();
    return res.status(200).json({ message: "Trip deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Unable to delete trip", error: error.message });
  }
};
