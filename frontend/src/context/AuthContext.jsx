import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  const applyAuth = useCallback((nextToken, nextUser) => {
    if (nextToken) {
      localStorage.setItem("token", nextToken);
      setToken(nextToken);
    } else {
      localStorage.removeItem("token");
      setToken(null);
    }

    if (nextUser) {
      localStorage.setItem("user", JSON.stringify(nextUser));
      setUser(nextUser);
    } else {
      localStorage.removeItem("user");
      setUser(null);
    }
  }, []);

  const login = async (credentials, requestFn) => {
    setLoading(true);
    try {
      const { token: t, user: u } = await requestFn(credentials);
      applyAuth(t, u);
      return { token: t, user: u };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    applyAuth(null, null);
  };

  const updateUser = (partial) => {
    setUser((prev) => {
      const updated = { ...prev, ...partial };
      localStorage.setItem("user", JSON.stringify(updated));
      return updated;
    });
  };

  // Cross-tab sync
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === "token") setToken(localStorage.getItem("token"));
      if (e.key === "user") {
        try {
          setUser(JSON.parse(localStorage.getItem("user")) || null);
        } catch {
          setUser(null);
        }
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const value = {
    token,
    user,
    loading,
    isAuthenticated: !!token,
    login,
    logout,
    updateUser,
    applyAuth, // exposed for places that already have token/user response
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
