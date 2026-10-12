
const RESTAURANT_IMAGES = [
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1515003197210-e0cd7184f8b5?auto=format&fit=crop&w=900&q=80",
];

function getRestaurantImage(restaurant) {
  if (
    typeof restaurant?.image === "string" &&
    /^https?:\/\//i.test(restaurant.image)
  ) {
    return restaurant.image;
  }

  const photo = restaurant?.photos?.[0];

  if (typeof photo === "string" && /^https?:\/\//i.test(photo)) {
    return photo;
  }

  if (photo?.url && /^https?:\/\//i.test(photo.url)) {
    return photo.url;
  }
  const identity = String(
    restaurant?.fsq_place_id ||
    restaurant?.place_id ||
    restaurant?.id ||
    restaurant?.name ||
    "restaurant"
  );

  let hash = 0;

  for (let i = 0; i < identity.length; i++) {
    hash = (hash * 31 + identity.charCodeAt(i)) >>> 0;
  }

  return RESTAURANT_IMAGES[hash % RESTAURANT_IMAGES.length];
}

export default getRestaurantImage;
