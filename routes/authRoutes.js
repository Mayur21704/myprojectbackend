import express from "express";
import { registerUser, protectedRoute } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public route for registration/login
router.post("/register", registerUser);

// Protected route
router.get("/protected", protect, protectedRoute);

export default router;
