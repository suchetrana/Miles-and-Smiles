import React from "react";

const GameCard = ({ image, title }) => {
  return (
    <div className="w-60 bg-[--card] text-[--text] rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
      {/* Game image */}
      <div className="w-full h-40 overflow-hidden rounded-t-xl">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Title area */}
      <div className="px-3 py-2 text-center bg-[--surface] transition-colors duration-300">
        <h2 className="text-base font-semibold text-[--text] truncate">
          {title}
        </h2>
      </div>
    </div>
  );
};

export default GameCard;
