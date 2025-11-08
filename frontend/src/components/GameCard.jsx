import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Star , Heart} from "lucide-react";
import axiosClient from "../axiosClient.js";

const GameCard = ({ image, title }) => {
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Fetch user's favorite games if logged in
  const fetchFavorites = async () => {
    try {
      const response = await axiosClient.get("/api/user/favorites");
      const favoriteGames = response.data.favouriteGames || [];
      setIsFavorited(favoriteGames.includes(title));
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  // Check if user is logged in and fetch favorites
  useEffect(() => {
    const checkLoginState = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
      
      // Fetch user's favorite games if logged in
      if (token) {
        fetchFavorites();
      } else {
        // User is not logged in, clear favorite state
        setIsFavorited(false);
      }
    };

    // Check on mount and when title changes
    checkLoginState();

    // Listen for storage changes (cross-tab)
    const handleStorageChange = (e) => {
      if (e.key === "token") {
        checkLoginState();
      }
    };
    window.addEventListener("storage", handleStorageChange);

    // Also listen for custom events (same-tab changes)
    const handleLoginStateChange = () => {
      checkLoginState();
    };
    window.addEventListener("loginStateChange", handleLoginStateChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("loginStateChange", handleLoginStateChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title]);

  const handleClick = () => {
    const path = "/games/" + title.toLowerCase().replace(/\s+/g, "-");
    navigate(path);
  };

  const handleStarClick = async (e) => {
    e.stopPropagation(); // Prevent card click navigation

    if (!isLoggedIn) {
      navigate("/auth");
      return;
    }

    try {
      const response = await axiosClient.post("/api/user/favorites", {
        gameTitle: title,
      });
      setIsFavorited(response.data.favouriteGames.includes(title));
      
      // Dispatch event to notify GameList that favorites were updated
      window.dispatchEvent(new Event("favoritesUpdated"));
    } catch (error) {
      console.error("Error toggling favorite:", error);
      // If error is due to authentication, navigate to auth page
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate("/auth");
      }
    }
  };

  return (
    <div
      onClick={handleClick}
      className="w-60 bg-[--card] text-[--text] rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      <div className="w-full h-40 overflow-hidden rounded-t-xl">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      <div className="px-3 py-2 text-center bg-[--surface] transition-colors duration-300">
        <div className="flex items-center justify-center gap-2">
          <h2 className="text-base font-semibold text-[--text] truncate flex-1">
            {title}
          </h2>
          <button
            onClick={handleStarClick}
            className="p-1 hover:bg-[--card] rounded transition-colors duration-200 flex-shrink-0 cursor-pointer"
            title={isFavorited ? "Remove from favorites" : "Add to favorites"}
          >
            <Star
              className={`${
                isFavorited
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-[--muted]"
              } transition-colors duration-200`}
              size={18}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameCard;
