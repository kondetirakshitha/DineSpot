
function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/^catering\.restaurant\./, "")
    .replace(/^catering\./, "")
    .replace(/[._-]/g, " ")
    .trim();
}

function getCuisineNames(restaurant) {
  const values = [
    ...(restaurant.cuisines || []),
    ...(restaurant.categories || []),
  ];

  return values
    .map((item) =>
      typeof item === "string"
        ? normalize(item)
        : normalize(item?.name)
    )
    .filter(Boolean);
}

export function calculateMatch(restaurant, preferences) {
  if (!preferences) return null;

  const checks = [];

  // Cuisine: only score when both sides have useful data.
  const preferredCuisines = (preferences.cuisines || [])
    .map(normalize)
    .filter(Boolean);

  const restaurantCuisines = getCuisineNames(restaurant);

  if (preferredCuisines.length && restaurantCuisines.length) {
    const matched = preferredCuisines.some((preferred) =>
      restaurantCuisines.some(
        (actual) =>
          actual === preferred ||
          actual.includes(preferred) ||
          preferred.includes(actual)
      )
    );

    checks.push({ weight: 50, score: matched ? 100 : 0 });
  }

  // Budget: score only when an actual price level is available.
  const priceLevel = Number(
    restaurant.priceLevel ?? restaurant.price
  );

  if (Number.isFinite(priceLevel) && priceLevel > 0) {
    const ranges = {
      budget: [1],
      moderate: [2],
      premium: [3, 4],
    };

    const accepted = ranges[preferences.budget] || [];
    checks.push({
      weight: 30,
      score: accepted.includes(priceLevel) ? 100 : 0,
    });
  }

  // Diet: score only when dietary data is explicitly available.
  const diet = restaurant.diet;
  if (
    preferences.diet &&
    preferences.diet !== "any" &&
    Array.isArray(diet) &&
    diet.length > 0
  ) {
    const matches = diet.map(normalize).includes(
      normalize(preferences.diet)
    );

    checks.push({ weight: 20, score: matches ? 100 : 0 });
  }

  if (!checks.length) return null;

  const totalWeight = checks.reduce(
    (total, check) => total + check.weight,
    0
  );

  const weightedScore = checks.reduce(
    (total, check) => total + check.score * check.weight,
    0
  );

  return Math.round(weightedScore / totalWeight);
}
