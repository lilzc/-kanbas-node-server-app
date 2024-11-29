import express from "express";
import cors from "cors";
import session from "express-session";
import mongoose from "mongoose";
import "dotenv/config";
import Lab5 from "./Lab5/index.js";
import UserRoutes from "./Kanbas/Users/route.js";
import CourseRoutes from "./Kanbas/Courses/routes.js";
import ModuleRoutes from "./Kanbas/Modules/routes.js";
import AssignmentRoutes from "./Kanbas/Assignments/routes.js";
import EnrollmentRoutes from "./Kanbas/Enrollments/routes.js";
import PeopleRoutes from "./Kanbas/People/routes.js";

const CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kanbas";

const app = express();

app.use(
  cors({
      credentials: true,
      origin: process.env.NETLIFY_URL || "http://localhost:3000",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "credentials"] 
  })
);

const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kanbas",
  resave: false,
  saveUninitialized: false,
};

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
      sameSite: "none",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000
  };
}

app.use(session(sessionOptions));
app.use(express.json());

mongoose.connect(CONNECTION_STRING)
 .then(() => console.log("MongoDB connected successfully"))
 .catch(err => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("Welcome to Kanbas API!");
});

Lab5(app);
UserRoutes(app);
CourseRoutes(app);
ModuleRoutes(app);
AssignmentRoutes(app);
EnrollmentRoutes(app);
PeopleRoutes(app);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
      message: "Something went wrong!", 
      error: process.env.NODE_ENV === "development" ? err.message : undefined 
  });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});