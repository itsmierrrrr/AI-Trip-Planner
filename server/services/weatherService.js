import axios from "axios";

/**
 * Fetch weather data and climate info for a destination
 * Uses Open-Meteo API (free, no auth required)
 */
export const getWeatherByCity = async (cityName) => {
  try {
    // Get city coordinates via geocoding
    const geoResponse = await axios.get(
      "https://geocoding-api.open-meteo.com/v1/search",
      {
        params: {
          name: cityName,
          count: 1,
          language: "en",
          format: "json",
        },
      }
    );

    const results = geoResponse.data?.results;
    if (!results || results.length === 0) {
      return {
        destination: cityName,
        temperature: "Unknown",
        condition: "Data unavailable",
        humidity: "N/A",
        windSpeed: "N/A",
        bestMonths: "Year-round",
      };
    }

    const location = results[0];
    const { latitude, longitude, name, country } = location;

    // Get current weather and forecast
    const weatherResponse = await axios.get(
      "https://api.open-meteo.com/v1/forecast",
      {
        params: {
          latitude,
          longitude,
          current: "temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m",
          daily:
            "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum",
          temperature_unit: "celsius",
          wind_speed_unit: "kmh",
          timezone: "auto",
        },
      }
    );

    const current = weatherResponse.data?.current || {};
    const daily = weatherResponse.data?.daily || {};

    // Map WMO weather codes to descriptions
    const getWeatherDescription = (code) => {
      const weatherMap = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Foggy",
        48: "Foggy",
        51: "Light drizzle",
        53: "Moderate drizzle",
        55: "Dense drizzle",
        61: "Slight rain",
        63: "Moderate rain",
        65: "Heavy rain",
        71: "Slight snow",
        73: "Moderate snow",
        75: "Heavy snow",
        80: "Slight rain showers",
        81: "Moderate rain showers",
        82: "Violent rain showers",
        85: "Slight snow showers",
        86: "Heavy snow showers",
        95: "Thunderstorm",
        96: "Thunderstorm with hail",
        99: "Thunderstorm with hail",
      };
      return weatherMap[code] || "Variable conditions";
    };

    // Determine best months based on temperature patterns
    const avgHighs = daily?.temperature_2m_max || [];
    const avgLows = daily?.temperature_2m_min || [];

    let bestMonths = "Year-round";
    if (avgHighs.length > 0) {
      const avgTemp =
        (avgHighs.reduce((a, b) => a + b, 0) +
          avgLows.reduce((a, b) => a + b, 0)) /
        (avgHighs.length + avgLows.length);

      if (avgTemp < 0) bestMonths = "May - September";
      else if (avgTemp < 10) bestMonths = "June - August";
      else if (avgTemp < 15) bestMonths = "April - October";
      else if (avgTemp > 30) bestMonths = "November - March";
      else bestMonths = "April - October";
    }

    return {
      destination: `${name}, ${country}`,
      temperature: Math.round(current.temperature_2m || 0) + "°C",
      condition: getWeatherDescription(current.weather_code),
      humidity: current.relative_humidity_2m + "%",
      windSpeed: Math.round(current.wind_speed_10m || 0) + " km/h",
      bestMonths,
      coordinates: {
        lat: latitude,
        lon: longitude,
      },
    };
  } catch (error) {
    console.error("Weather API error:", error.message);
    return {
      destination: cityName,
      temperature: "N/A",
      condition: "Weather data unavailable",
      humidity: "N/A",
      windSpeed: "N/A",
      bestMonths: "Year-round",
    };
  }
};

/**
 * Get weather data for multiple cities (for multi-destination trips)
 */
export const getWeatherForDestinations = async (destinations) => {
  try {
    const weatherData = await Promise.all(
      destinations.map((dest) => getWeatherByCity(dest))
    );
    return weatherData;
  } catch (error) {
    console.error("Multi-city weather fetch error:", error.message);
    return destinations.map((dest) => ({
      destination: dest,
      temperature: "N/A",
      condition: "Unavailable",
      humidity: "N/A",
      windSpeed: "N/A",
      bestMonths: "Year-round",
    }));
  }
};
