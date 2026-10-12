
const API_URL = "http://localhost:5000/api/restaurants";

export async function searchRestaurants({
  location = "Hyderabad, Telangana, India",
  query = "restaurant",
  limit = 20,
} = {}) {
  const params = new URLSearchParams({
    near: location,
    query,
    limit: String(limit),
  });

  const response = await fetch(`${API_URL}?${params.toString()}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Unable to load restaurants.");
  }

  return data.results || [];
}
