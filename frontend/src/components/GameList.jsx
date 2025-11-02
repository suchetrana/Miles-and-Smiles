import React from "react";
import GameCard from "./GameCard";

const GameList = () => {
  const games = [
    { title: "TicTacToe", image: "/tictactoe.png" },
    { title: "Memory", image: "/memory.png" },
    { title: "Snakes and Ladders", image: "/snakes_and_ladders.png" },
    { title: "Dots and Boxes", image: "/dots_and_boxes.png" },
  ];

  return (
    <div className="w-full px-4 py-8 flex gap-6 flex-wrap justify-center">
      {games.map((game, i) => (
        <GameCard key={i} image={game.image} title={game.title} />
      ))}
    </div>
  );
};

export default GameList;
