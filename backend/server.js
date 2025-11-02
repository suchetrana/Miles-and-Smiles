import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const SERVER_PORT = process.env.SERVER_PORT;
const SERVER_IP_ADDRESS = process.env.SERVER_IP_ADDRESS;

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/signup", (req, res) => {
  const userData = req.body;
  if (!userData.username || !userData.password) {
    return res
      .status(400)
      .json({ message: "Username and password cannot be empty." });
  }
  console.log("sign up attempt by", userData);
  res.status(200).json({ message: "Sign Up Successful", data: userData });
});
app.post("/api/login", (req, res) => {
  const userData = req.body;
  if (!userData.username || !userData.password) {
    return res
      .status(400)
      .json({ message: "Username and password cannot be empty." });
  }
  console.log("login attempt by", userData);
  res.status(200).json({ message: "Login Successful", data: userData });
});

app.listen(SERVER_PORT, () => {
  console.log(
    `Server is running on port http://${SERVER_IP_ADDRESS}:${SERVER_PORT}`
  );
});
