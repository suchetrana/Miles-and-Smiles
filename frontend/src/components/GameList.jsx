import { useEffect, useState, useCallback } from "react";
import GameCard from "./GameCard";
import axiosClient from "../axiosClient.js";
import { useAuth } from "../context/AuthContext.jsx";

const GameList = () => {
  const [allGames, setAllGames] = useState([]);
  const [favoriteGames, setFavoriteGames] = useState([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(
    () => localStorage.getItem("showFavoritesOnly") === "true"
  );
  const { isAuthenticated, token } = useAuth();

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
    }

    fetchGames();
  }, []);

  // Fetch user's favorite games if logged in
  const fetchFavorites = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setFavoriteGames([]);
      return;
    }

    try {
      const response = await axiosClient.get("/api/user/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const favoriteGameTitles = response.data.favouriteGames || [];
      setFavoriteGames(favoriteGameTitles);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      setFavoriteGames([]);
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  // Listen for favorites filter changes and favorite updates
  useEffect(() => {
    const handleFavoritesFilterChange = async (e) => {
      setShowFavoritesOnly(e.detail);
      // Refresh favorites when filter is turned on
      if (e.detail && isAuthenticated) {
        fetchFavorites();
      }
    };

    const handleFavoritesUpdate = async () => {
      // Refresh favorites when a game is favorited/unfavorited
      if (isAuthenticated) {
        fetchFavorites();
      }
    };

    window.addEventListener(
      "favoritesFilterChange",
      handleFavoritesFilterChange
    );
    window.addEventListener("favoritesUpdated", handleFavoritesUpdate);

    // Context handles login state; no storage listeners needed here.

    return () => {
      window.removeEventListener(
        "favoritesFilterChange",
        handleFavoritesFilterChange
      );
      window.removeEventListener("favoritesUpdated", handleFavoritesUpdate);
      // no-op
    };
  }, [isAuthenticated, fetchFavorites]);

  // Filter games based on showFavoritesOnly state
  const displayedGames =
    showFavoritesOnly && isAuthenticated
      ? allGames.filter((game) => favoriteGames.includes(game.title))
      : allGames;

  return (
    <div className="w-full px-4 py-8 flex gap-6 flex-wrap justify-center">
      {displayedGames.length > 0 ? (
        displayedGames.map((game, i) => (
          <GameCard key={game._id || i} image={game.image} title={game.title} />
        ))
      ) : showFavoritesOnly && isAuthenticated ? (
        <div className="w-full text-center py-12">
          <p className="text-[--muted] text-lg">
            No favorite games yet. Start adding some!
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default GameList;
