import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRY = process.env.TOKEN_EXPIRY;

const createToken = (userId) =>
  jwt.sign({ userId }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });

// Configure Google OAuth Strategy
// Build full callback URL
const getCallbackURL = () => {
  if (process.env.GOOGLE_CALLBACK_URL) {
    // If it's already a full URL, use it
    if (process.env.GOOGLE_CALLBACK_URL.startsWith("http")) {
      return process.env.GOOGLE_CALLBACK_URL;
    }
    // If it's just a path, build full URL
    const backendUrl =
      process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
    const fullUrl = `${backendUrl}${process.env.GOOGLE_CALLBACK_URL}`;
    return fullUrl;
  }
  // Default
  const backendUrl =
    process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
  const defaultUrl = `${backendUrl}/api/user/auth/google/callback`;
  return defaultUrl;
};

const callbackURL = getCallbackURL();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: callbackURL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists with this Google ID
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          // User exists, return user
          return done(null, user);
        }

        // Check if user exists with this email
        user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          // User exists but doesn't have Google ID, add it
          user.googleId = profile.id;
          // Không lưu avatar từ Google, để frontend tự tạo từ ui-avatars
          await user.save();
          return done(null, user);
        }

        // Create new user
        user = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
          // Không lưu avatar từ Google, để frontend tự tạo từ ui-avatars
          password: "", // No password for Google users
          role: "user", // Default role for Google users
        });

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
