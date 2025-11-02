import React from "react";
import { useNavigate } from "react-router-dom";
import GameList from "../components/GameList";
import Navbar from "../components/Navbar";

function Home() {
  const navigate = useNavigate();

  return (
   <div className="min-h-screen bg-[--bg] text-[--text] transition-colors duration-300">

  <Navbar />
  <GameList />
</div>



  );
}

export default Home;
