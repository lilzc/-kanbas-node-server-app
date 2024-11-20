import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";

export default function UserRoutes(app) {
    const findCoursesForEnrolledUser = (req, res) => {
        let { userId } = req.params;
        if (userId === "current") {
            const currentUser = req.session["currentUser"];
            if (!currentUser) {
                res.sendStatus(401);
                return;
            }
            userId = currentUser._id;
        }
        const courses = courseDao.findCoursesForEnrolledUser(userId);
        res.json(courses);
    };

    const signin = async (req, res) => {
        const { username, password } = req.body;
        const user = dao.findUserByCredentials(username, password);
        if (user) {
            req.session["currentUser"] = user;
            res.json(user);
        } else {
            res.status(401).json({ 
                message: "Invalid credentials. Please check your username and password." 
            });
        }
    };

    const profile = async (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        res.json(currentUser);
    };

    const signout = (req, res) => {
        req.session.destroy();
        res.sendStatus(200);
    };

    const updateUser = async (req, res) => {
        const userId = req.params.userId;
        const userUpdates = req.body;
        dao.updateUser(userId, userUpdates);
        const currentUser = dao.findUserById(userId);
        req.session["currentUser"] = currentUser;
        res.json(currentUser);
    };

    const signup = (req, res) => {
        const user = dao.findUserByUsername(req.body.username);
        if (user) {
            res.status(400).json({ message: "Username already taken" });
            return;
        }
        const currentUser = dao.createUser(req.body);
        req.session["currentUser"] = currentUser;
        res.json(currentUser);
    };

    const findAllUsers = async (req, res) => {
        const users = dao.findAllUsers();
        res.json(users);
    };

    // Route Declarations
    app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
    app.post("/api/users/signin", signin);
    app.post("/api/users/profile", profile);
    app.post("/api/users/signout", signout);
    app.put("/api/users/:userId", updateUser);
    app.get("/api/users", findAllUsers);
    app.post("/api/users/signup", signup);
}