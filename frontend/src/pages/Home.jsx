import GameList from "../components/GameList";
import Navbar from "../components/Navbar";

function Home() {
  return (
    <div className="min-h-screen bg-[--bg] text-[--text] transition-colors duration-300">
      <Navbar />
      <GameList />
    </div>
  );
}

export default Home;
