import { useEffect, useState } from "react";
import { Search, Users, Heart, Sun, Moon, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const [isDark, setIsDark] = useState(() => localStorage.getItem("theme") === "dark");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(
    () => localStorage.getItem("showFavoritesOnly") === "true"
  );
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // 🌙 Handle dark mode
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  // ✅ Update login + user state on token/user changes (same-tab & cross-tab)
  useEffect(() => {
    const updateLoginState = () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      setIsLoggedIn(!!token);
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    window.addEventListener("storage", updateLoginState);
    window.addEventListener("loginStateChange", updateLoginState);

    updateLoginState();

    return () => {
      window.removeEventListener("storage", updateLoginState);
      window.removeEventListener("loginStateChange", updateLoginState);
    };
  }, []);

  // Reset favorites filter when user logs out
  useEffect(() => {
    if (!isLoggedIn && showFavoritesOnly) {
      setShowFavoritesOnly(false);
      localStorage.setItem("showFavoritesOnly", "false");
      window.dispatchEvent(
        new CustomEvent("favoritesFilterChange", { detail: false })
      );
    }
  }, [isLoggedIn, showFavoritesOnly]);

  const toggleTheme = () => setIsDark((prev) => !prev);
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const handleFavoritesToggle = () => {
    if (!isLoggedIn) {
      navigate("/auth");
      return;
    }
    const newState = !showFavoritesOnly;
    setShowFavoritesOnly(newState);
    localStorage.setItem("showFavoritesOnly", newState.toString());
    window.dispatchEvent(
      new CustomEvent("favoritesFilterChange", { detail: newState })
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUser(null);
    window.dispatchEvent(new Event("loginStateChange"));
    navigate("/");
  };

  return (
    <nav className="bg-(--surface) text-(--text) flex items-center justify-between px-4 md:px-6 py-3 shadow-md transition-colors duration-200 relative">
      {/* Left: Logo */}
      <div
        className="flex items-center space-x-2 md:space-x-3 cursor-pointer"
        onClick={() => navigate("/")}
        title={`Welcome ${isLoggedIn && user ? user.username : "Guest"} 😊💕`}
      >
        <img src="/logo.png" alt="logo" className="w-8 h-8 rounded" />
        <h1 className="font-semibold text-lg">Miles & Smiles</h1>
      </div>

      {/* Center: Search bar (desktop) */}
      <div className="hidden md:flex items-center bg-(--card) rounded-full px-4 py-2 w-[40%] transition-colors duration-200">
        <input
          type="text"
          placeholder="Search"
          className="bg-transparent outline-none text-(--text) placeholder-(--muted) w-full"
        />
        <Search className="text-(--muted) cursor-pointer" size={18} />
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-3 md:space-x-4">
        {/* Desktop icons */}
        <div className="hidden md:flex items-center space-x-4">
          <button
            className="p-2 hover:bg-(--card) rounded-full cursor-pointer"
            title="Friends"
          >
            <Users className="text-(--muted)" size={20} />
          </button>

          <button
            onClick={handleFavoritesToggle}
            className="p-2 hover:bg-(--card) rounded-full cursor-pointer"
            title={showFavoritesOnly ? "Show all games" : "Show favorites only"}
          >
            <Heart
              className={`${
                showFavoritesOnly
                  ? "fill-red-500 text-red-500"
                  : "text-[--muted]"
              } transition-colors duration-200`}
              size={20}
            />
          </button>
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-(--card) rounded-full cursor-pointer"
          title="Toggle theme"
        >
          {isDark ? (
            <Sun className="text-yellow-400" size={20} />
          ) : (
            <Moon className="text-(--muted)" size={20} />
          )}
        </button>

        {/* Profile pic */}
        {isLoggedIn && (
          <img
            src="/profile.png"
            alt="profile"
            className="w-8 h-8 rounded-full border-2 border-blue-400 cursor-pointer hidden sm:block"
            title={user ? user.username : "Profile"}
          />
        )}

        {/* Login / Logout */}
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="hidden md:block bg-red-500 hover:bg-red-600 text-white font-semibold px-3 py-2 rounded-md cursor-pointer"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => navigate("/auth")}
            className="hidden md:block bg-blue-500 hover:bg-blue-600 text-white font-semibold px-3 py-2 rounded-md cursor-pointer"
          >
            Login
          </button>
        )}

        {/* Mobile menu toggle */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 hover:bg-(--card) rounded-full cursor-pointer"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-(--surface) border-t border-(--muted) flex flex-col items-center space-y-3 py-4 md:hidden transition-all duration-300">
          <div className="flex items-center bg-(--card) rounded-full px-4 py-2 w-[90%]">
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent outline-none text-(--text) placeholder-(--muted) w-full"
            />
            <Search className="text-(--muted)" size={18} />
          </div>

          <div className="flex space-x-4">
            <button className="p-2 hover:bg-(--card) rounded-full cursor-pointer">
              <Users className="text-(--muted)" size={20} />
            </button>
            <button
              onClick={handleFavoritesToggle}
              className="p-2 hover:bg-(--card) rounded-full cursor-pointer"
              title={
                showFavoritesOnly ? "Show all games" : "Show favorite games only"
              }
            >
              <Heart
                className={`${
                  showFavoritesOnly
                    ? "fill-red-500 text-red-500"
                    : "text-[--muted]"
                } transition-colors duration-200`}
                size={20}
              />
            </button>
          </div>

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2 rounded-md"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate("/auth")}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-5 py-2 rounded-md"
            >
              Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
