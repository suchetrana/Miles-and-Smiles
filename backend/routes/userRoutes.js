import { Router } from "express";
import { getFavorites, toggleFavorite } from "../controllers/userController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";
import { uploadProfilePicture } from "../controllers/userController.js";


const router = Router();

router.get("/favorites", verifyToken, getFavorites);
router.post("/favorites", verifyToken, toggleFavorite);
router.post("/profile-picture", verifyToken, upload.single("image"), uploadProfilePicture);


export default router;
