import axiosClient from "../axiosClient.js";
import { useState } from "react";

export default function SignUp({ onMessage }) {
  const [userData, setUserData] = useState({ username: "", password: "" });

  const handleChange = (e) =>
    setUserData({ ...userData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onMessage && onMessage({ text: "Signing up...", type: "info" });
    axiosClient
      .post(`/api/auth/signup`, userData)
      .then((response) => {
        console.log("Sign Up Successful:", response.data);
        onMessage &&
          onMessage({
            text: "Sign up successful! You can now log in.",
            type: "success",
          });
      })
      .catch((error) => {
        console.error("Sign Up Error:", error);
        onMessage &&
          onMessage({
            text: error.response?.data?.message || "Sign up failed",
            type: "error",
          });
      });
    console.log("Sign Up Data:", userData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={userData.username}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={userData.password}
        onChange={handleChange}
        className="w-full mb-4 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
      >
        Sign Up
      </button>
    </form>
  );
}
