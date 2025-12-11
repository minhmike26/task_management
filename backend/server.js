import express from "express";
import cors from "cors";
import session from "express-session";
import "dotenv/config";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import taskRouter from "./routes/taskRoute.js";
import adminRouter from "./routes/adminRoute.js";
import passport from "./config/googleOAuth.js";

//Initialize express app
const app = express();
const port = process.env.PORT || 5000;

//Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.urlencoded({ extended: true }));

// Session middleware for Passport
app.use(
  session({
    secret: process.env.SESSION_SECRET || process.env.JWT_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

//DB Connection
connectDB();

//Routes
app.use("/api/user", userRouter);
app.use("/api/task", taskRouter);
app.use("/api/admin", adminRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
