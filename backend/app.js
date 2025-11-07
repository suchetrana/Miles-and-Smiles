import express from "express";
import cors from "cors";
import authRoute from "./routes/authRoute.js";
import gameRoute from "./routes/gameRoute.js";

const app = express();

app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/auth", authRoute);
app.use("/api/games", gameRoute);

export default app;