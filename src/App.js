
import { useState } from "react";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import RestaurantDetails from "./pages/RestaurantDetails.js";
import Preferences from "./features/Preferences";
import Compare from "./features/Compare";


console.log("Home:", typeof Home, Home);
console.log("Explore:", typeof Explore, Explore);

console.log("RestaurantDetails import:", RestaurantDetails);
console.log("RestaurantDetails keys:", Object.keys(RestaurantDetails));

console.log("Preferences:", typeof Preferences, Preferences);
console.log("Compare:", typeof Compare, Compare);


function App() {
  const [page, setPage] = useState("home");

  return (
    <>
      {page === "home" && <Home setPage={setPage} />}
      {page === "explore" && <Explore setPage={setPage} />}
      {page === "details" && (
        <RestaurantDetails setPage={setPage} />
      )}
      {page === "preferences" && (
        <Preferences setPage={setPage} />
      )}
      {page === "compare" && <Compare setPage={setPage} />}
    </>
  );
}

export default App;
