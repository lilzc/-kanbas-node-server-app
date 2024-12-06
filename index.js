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

const sessionOptions = {
 secret: process.env.SESSION_SECRET || "kanbas",
 resave: false,
 saveUninitialized: false,
 cookie: {
   secure: process.env.NODE_ENV === "production",
   sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
   maxAge: 24 * 60 * 60 * 1000 // 24 hours
 }
};

app.use(express.json());
app.use(session(sessionOptions));
app.use(cors({
 credentials: true,
 origin: process.env.NETLIFY_URL || "http://localhost:3000",
 methods: ["GET", "POST", "PUT", "DELETE"],
 allowedHeaders: ["Content-Type"]
}));

app.use((req, res, next) => {
 console.log('Session ID:', req.sessionID);
 console.log('Session:', req.session);
 next();
});



mongoose.connection.on('error', err => {
 console.error('MongoDB connection error:', err);
});

mongoose.connection.once('open', () => {
 console.log('MongoDB connected successfully');
});

try {
 await mongoose.connect(CONNECTION_STRING);
 console.log("MongoDB connected");
} catch (error) {
 console.error("MongoDB connection error:", error);
}


app.get("/", (req, res) => {
 res.send("Welcome to Kanbas API!");
});

app.get("/api/test-db", async (req, res) => {
 try {
   await mongoose.connection.db.admin().ping();
   res.json({ status: "Connected" });
 } catch (error) {
   console.error(error);
   res.status(500).json({ error: error.message });
 }
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
 const isDevelopment = process.env.NODE_ENV === "development";
 res.status(500).json({
   message: "Something went wrong!",
   error: isDevelopment ? err.message : undefined,
   stack: isDevelopment ? err.stack : undefined,
 });
});

app.use((req, res) => {
 res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
 console.log(`Server is running on port ${PORT}`);
});