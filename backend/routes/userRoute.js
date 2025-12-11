import express from "express";
import { registerUser, loginUser, getCurrentUser, updateProfile, updatePassword, googleCallback } from "../controllers/userController.js";
import authMiddleware from "../middleware/auth.js";
import passport from "../config/googleOAuth.js";

const userRouter = express.Router();

//Public routes
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

// Google OAuth routes
userRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

userRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  googleCallback
);

//Private routes
userRouter.get("/me", authMiddleware, getCurrentUser);
userRouter.put("/profile", authMiddleware, updateProfile);
userRouter.put("/password", authMiddleware, updatePassword);

export default userRouter;