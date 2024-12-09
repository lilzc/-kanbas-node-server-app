import express from "express";
import cors from "cors";
import session from "express-session";
import mongoose from "mongoose";
import MongoStore from 'connect-mongo';
import "dotenv/config";
import Lab5 from "./Lab5/index.js";
import UserRoutes from "./Kanbas/Users/route.js";
import CourseRoutes from "./Kanbas/Courses/routes.js";
import ModuleRoutes from "./Kanbas/Modules/routes.js";
import AssignmentRoutes from "./Kanbas/Assignments/routes.js";
import EnrollmentRoutes from "./Kanbas/Enrollments/routes.js";
import PeopleRoutes from "./Kanbas/People/routes.js";

const CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kanbas";
const FRONTEND_URL = process.env.NETLIFY_URL || process.env.FRONTEND_URL || "http://localhost:3000";
const app = express();

const sessionOptions = {
    secret: process.env.SESSION_SECRET || "kanbas",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ 
        mongoUrl: CONNECTION_STRING,
        ttl: 24 * 60 * 60,
        autoRemove: 'native'
    }),
    cookie: {
        secure: false,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        path: '/'
    }
};

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

app.use(cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['Set-Cookie']
}));

app.use(express.json());

// Session middleware
app.use(session(sessionOptions));

// Session debugging middleware
app.use((req, res, next) => {
    console.log('Request URL:', req.url);
    console.log('Session ID:', req.sessionID);
    console.log('Session Data:', req.session);
    console.log('Current User:', req.session?.currentUser);
    next();
});

// Session check middleware
app.use((req, res, next) => {
    if (req.session && !req.session.initialized) {
        req.session.initialized = true;
        console.log('New session initialized');
    }
    next();
});

// MongoDB Connection
try {
    await mongoose.connect(CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log("MongoDB connected successfully");
} catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
}

app.get("/", (req, res) => {
    res.send("Welcome to Kanbas API!");
});

app.get("/api/test-db", async (req, res) => {
    try {
        await mongoose.connection.db.admin().ping();
        res.json({ status: "Connected", sessionID: req.sessionID });
    } catch (error) {
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
    if (err instanceof mongoose.Error.CastError) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }
    next(err);
});

app.use((err, req, res, next) => {
    console.error('Error:', err);
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
    console.log(`Server running on port ${PORT}`);
    console.log(`Frontend URL: ${FRONTEND_URL}`);
});