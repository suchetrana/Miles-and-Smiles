import { useEffect, useState } from "react";
import GameCard from "./GameCard";
import axiosClient from "../axiosClient.js";

const GameList = () => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    async function fetchGames() {
      try {
        const res = await axiosClient.get(`/api/games`);
        console.log(res.data);
        setGames(res.data);
      } catch (error) {
        console.error("❌ Error fetching games:", error);
      }
    };

    fetchGames();
  }, []);

  return (
    <div className="w-full px-4 py-8 flex gap-6 flex-wrap justify-center">
      {games.map((game, i) => (
        <GameCard key={game._id || i} image={game.image} title={game.title} />
      ))}
    </div>
  );
};

export default GameList;
