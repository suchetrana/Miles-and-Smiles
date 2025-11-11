import axiosClient from "../axiosClient.js";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login({ onMessage }) {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const navigate = useNavigate();
  const { applyAuth } = useAuth();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      onMessage && onMessage({ text: "Logging in...", type: "info" });
      const response = await axiosClient.post(`/api/auth/login`, formData);
      applyAuth(response.data.token, response.data.user);

      onMessage &&
        onMessage({
          text: "Login successful! Redirecting...",
          type: "success",
        });
      navigate("/");
    } catch (error) {
      console.error("Login Error:", error);
      onMessage &&
        onMessage({
          text: error.response?.data?.message || "Login failed",
          type: "error",
        });
    }

    console.log("Login Data:", formData);
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col">
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        className="w-full mb-4 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
      >
        Login
      </button>
    </form>
  );
}
