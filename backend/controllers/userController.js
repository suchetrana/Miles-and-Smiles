import User from "../models/User.js";

// GET /api/user/favorites - Get user's favorite games
export async function getFavorites(req, res) {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({ favouriteGames: user.favouriteGames || [] });
  } catch (err) {
    console.error("getFavorites error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// POST /api/user/favorites - Toggle favorite game (add if not exists, remove if exists)
export async function toggleFavorite(req, res) {
  try {
    const userId = req.user.id;
    const { gameTitle } = req.body;

    if (!gameTitle) {
      return res.status(400).json({ message: "Game title is required." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const favouriteGames = user.favouriteGames || [];
    const gameIndex = favouriteGames.indexOf(gameTitle);

    if (gameIndex > -1) {
      // Game is already favorited, remove it
      favouriteGames.splice(gameIndex, 1);
    } else {
      // Game is not favorited, add it
      favouriteGames.push(gameTitle);
    }

    user.favouriteGames = favouriteGames;
    await user.save();

    return res.status(200).json({
      message: gameIndex > -1 ? "Game removed from favorites" : "Game added to favorites",
      favouriteGames: user.favouriteGames,
    });
  } catch (err) {
    console.error("toggleFavorite error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}