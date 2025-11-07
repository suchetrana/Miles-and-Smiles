import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home.jsx";
import Auth from "../pages/Auth.jsx";
import GamePage from "../pages/GamePage.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";


function AppRouter() {
  return (
    <Router>
      <Routes>

        <Route
          path="/"
          element={<Auth />}
        />

        <Route
          path="/home"
          element={<ProtectedRoute><Home /></ProtectedRoute>}
        />

        <Route
          path="/games/:gameSlug"
          element={<GamePage />}
        />

      </Routes>
    </Router>
  );
}

export default AppRouter;
