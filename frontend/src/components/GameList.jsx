import { useEffect, useState } from "react";
import GameCard from "./GameCard";
import axiosClient from "../axiosClient.js";

const GameList = () => {
  const [allGames, setAllGames] = useState([]);
  const [favoriteGames, setFavoriteGames] = useState([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(
    () => localStorage.getItem("showFavoritesOnly") === "true"
  );
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  // Fetch all games
  useEffect(() => {
    async function fetchGames() {
      try {
        const res = await axiosClient.get(`/api/games`);
        console.log(res.data);
        setAllGames(res.data);
      } catch (error) {
        console.error("❌ Error fetching games:", error);
      }
    };

    fetchGames();
  }, []);

  // Fetch user's favorite games if logged in
  const fetchFavorites = async () => {
    if (!isLoggedIn) {
      setFavoriteGames([]);
      return;
    }

    try {
      const response = await axiosClient.get("/api/user/favorites");
      const favoriteGameTitles = response.data.favouriteGames || [];
      setFavoriteGames(favoriteGameTitles);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      setFavoriteGames([]);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [isLoggedIn]);

  // Listen for favorites filter changes and favorite updates
  useEffect(() => {
    const handleFavoritesFilterChange = async (e) => {
      setShowFavoritesOnly(e.detail);
      // Refresh favorites when filter is turned on
      if (e.detail && isLoggedIn) {
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const response = await axiosClient.get("/api/user/favorites");
            const favoriteGameTitles = response.data.favouriteGames || [];
            setFavoriteGames(favoriteGameTitles);
          } catch (error) {
            console.error("Error fetching favorites:", error);
            setFavoriteGames([]);
          }
        }
      }
    };

    const handleFavoritesUpdate = async () => {
      // Refresh favorites when a game is favorited/unfavorited
      if (isLoggedIn) {
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const response = await axiosClient.get("/api/user/favorites");
            const favoriteGameTitles = response.data.favouriteGames || [];
            setFavoriteGames(favoriteGameTitles);
          } catch (error) {
            console.error("Error fetching favorites:", error);
            setFavoriteGames([]);
          }
        }
      }
    };

    window.addEventListener("favoritesFilterChange", handleFavoritesFilterChange);
    window.addEventListener("favoritesUpdated", handleFavoritesUpdate);

    // Check login state
    const checkLoginState = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };
    window.addEventListener("loginStateChange", checkLoginState);
    window.addEventListener("storage", checkLoginState);

    return () => {
      window.removeEventListener("favoritesFilterChange", handleFavoritesFilterChange);
      window.removeEventListener("favoritesUpdated", handleFavoritesUpdate);
      window.removeEventListener("loginStateChange", checkLoginState);
      window.removeEventListener("storage", checkLoginState);
    };
  }, [isLoggedIn]);

  // Filter games based on showFavoritesOnly state
  const displayedGames = showFavoritesOnly && isLoggedIn
    ? allGames.filter((game) => favoriteGames.includes(game.title))
    : allGames;

  return (
    <div className="w-full px-4 py-8 flex gap-6 flex-wrap justify-center">
      {displayedGames.length > 0 ? (
        displayedGames.map((game, i) => (
          <GameCard key={game._id || i} image={game.image} title={game.title} />
        ))
      ) : showFavoritesOnly && isLoggedIn ? (
        <div className="w-full text-center py-12">
          <p className="text-[--muted] text-lg">No favorite games yet. Start adding some!</p>
        </div>
      ) : null}
    </div>
  );
};

export default GameList;
