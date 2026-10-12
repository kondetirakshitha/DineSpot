require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 5000;

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
  })
);

const locationCache = new Map();
const searchCategories = {
  indian: ["catering.restaurant.indian"],
  biryani: ["catering.restaurant.indian"],
  dosa: ["catering.restaurant.indian"],
  idli: ["catering.restaurant.indian"],
  thali: ["catering.restaurant.indian"],
  italian: ["catering.restaurant.italian"],
  pasta: ["catering.restaurant.italian"],
  chinese: ["catering.restaurant.chinese"],
  noodles: ["catering.restaurant.chinese"],
  mexican: ["catering.restaurant.mexican"],
  tacos: ["catering.restaurant.mexican"],
  japanese: ["catering.restaurant.japanese"],
  sushi: ["catering.restaurant.sushi"],
  ramen: ["catering.restaurant.japanese"],
  thai: ["catering.restaurant.thai"],
  pizza: ["catering.restaurant.pizza"],
  burger: ["catering.restaurant.burger"],
  burgers: ["catering.restaurant.burger"],
  fastfood: ["catering.fast_food"],
  "fast food": ["catering.fast_food"],
  vegetarian: ["catering.restaurant"],
  veg: ["catering.restaurant"],
};

async function getCoordinates(location, apiKey) {
  const cacheKey = location.trim().toLowerCase();

  if (locationCache.has(cacheKey)) {
    return locationCache.get(cacheKey);
  }

  const params = new URLSearchParams({
    text: location,
    format: "json",
    limit: "1",
    apiKey,
  });

  const response = await fetch(
    `https://api.geoapify.com/v1/geocode/search?${params}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Could not find the requested location."
    );
  }

  const result = data.results?.[0];

  if (!result) {
    throw new Error(`Location not found: ${location}`);
  }

  const coordinates = {
    lat: result.lat,
    lon: result.lon,
  };

  locationCache.set(cacheKey, coordinates);
  return coordinates;
}

app.get("/api/restaurants", async (req, res) => {
  try {
    const apiKey = process.env.GEOAPIFY_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "GEOAPIFY_API_KEY is missing from server/.env.",
      });
    }

    const near = String(
      req.query.near || "Hyderabad, Telangana, India"
    ).trim();

    const query = String(req.query.query || "restaurant").trim();

    const limit = Math.min(
      20,
      Math.max(1, Number.parseInt(req.query.limit, 10) || 20)
    );

    if (!near || !query) {
      return res.status(400).json({
        error: "Please provide a location and search term.",
      });
    }
    const citySearchPattern = /\b(in|near|at)\s+(.+)$/i;
    const cityMatch = query.match(citySearchPattern);

    let searchTerm = query;
    let requestedLocation = near;

    if (cityMatch) {
      searchTerm = query.slice(0, cityMatch.index).trim();
      requestedLocation = cityMatch[2].trim();
    }
    const supportedCities = [
      "chennai",
      "hyderabad",
      "bengaluru",
      "bangalore",
      "mumbai",
      "delhi",
      "pune",
      "kolkata",
    ];

    if (
      !cityMatch &&
      supportedCities.includes(query.toLowerCase())
    ) {
      requestedLocation = query;
      searchTerm = "restaurant";
    }

    const coordinates = await getCoordinates(
      requestedLocation,
      apiKey
    );

    const normalizedQuery = searchTerm
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();

    const isGeneralSearch = [
      "restaurant",
      "restaurants",
      "all",
      "food",
    ].includes(normalizedQuery);

    const matchedCategories = searchCategories[normalizedQuery];

    const params = new URLSearchParams({
      categories: matchedCategories
        ? matchedCategories.join(",")
        : "catering.restaurant",
      filter: `circle:${coordinates.lon},${coordinates.lat},10000`,
      bias: `proximity:${coordinates.lon},${coordinates.lat}`,
      limit: String(limit),
      lang: "en",
      apiKey,
    });

    if (!isGeneralSearch && !matchedCategories) {
      params.set("name", searchTerm);
    }

    const response = await fetch(
      `https://api.geoapify.com/v2/places?${params}`
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Geoapify response:", data);

      return res.status(response.status).json({
        error: data.message || "Geoapify restaurant search failed.",
      });
    }

    const results = (data.features || [])
      .filter((feature) => feature.properties?.name)
      .map((feature) => {
        const place = feature.properties;

        return {
          fsq_place_id:
            place.place_id || `${place.lat},${place.lon}`,
          name: place.name,
          categories: place.categories || [],
          location: {
            formatted: place.formatted || "",
            address: place.address_line1 || place.street || "",
            locality: place.city || place.suburb || "",
            region: place.state || "",
            postcode: place.postcode || "",
            country: place.country || "",
            lat: place.lat,
            lon: place.lon,
          },
          distance:
            place.distance != null &&
            Number.isFinite(Number(place.distance))
              ? Number(place.distance)
              : null,
          rating: null,
          price: null,
          photos: [],
          website: place.website || null,
          tel:
            place.contact?.phone ||
            place.datasource?.raw?.phone ||
            null,
        };
      });

    res.json({ results });
  } catch (error) {
    console.error("Backend error:", error);

    res.status(500).json({
      error: error.message || "Unable to search for restaurants.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`DineSpot API running at http://localhost:${PORT}`);
});
