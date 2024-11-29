import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";

export default function UserRoutes(app) {
    const findCoursesForEnrolledUser = async (req, res) => {
        let { userId } = req.params;
        if (userId === "current") {
            const currentUser = req.session["currentUser"];
            if (!currentUser) {
                res.sendStatus(401);
                return;
            }
            userId = currentUser._id;
        }
        try {
            const courses = await courseDao.findCoursesForEnrolledUser(userId);
            res.json(courses);
        } catch (error) {
            res.status(500).json({ message: "Error retrieving courses", error });
        }
    };

    const signin = async (req, res) => {
        const { username, password } = req.body;
        try {
            const user = await dao.findUserByCredentials(username, password);
            if (user) {
                req.session["currentUser"] = user;
                res.json(user);
            } else {
                res.status(401).json({ 
                    message: "Invalid credentials. Please check your username and password." 
                });
            }
        } catch (error) {
            res.status(500).json({ message: "Error signing in", error });
        }
    };

    const profile = async (req, res) => {
        try {
            const currentUser = req.session["currentUser"];
            if (!currentUser) {
                res.sendStatus(401);
                return;
            }
            res.json(currentUser);
        } catch (error) {
            res.status(500).json({ message: "Error retrieving profile", error });
        }
    };

    const signout = (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                res.status(500).json({ message: "Error signing out", error: err });
            } else {
                res.sendStatus(200);
            }
        });
    };

    const updateUser = async (req, res) => {
        const userId = req.params.userId;
        const userUpdates = req.body;
        try {
            await dao.updateUser(userId, userUpdates);
            const updatedUser = await dao.findUserById(userId);
            if (req.session["currentUser"] && req.session["currentUser"]._id === userId) {
                req.session["currentUser"] = { ...req.session["currentUser"], ...userUpdates };
            }
            res.json(updatedUser);
        } catch (error) {
            res.status(500).json({ message: "Error updating user", error });
        }
    };

    const signup = async (req, res) => {
        try {
            const existingUser = await dao.findUserByUsername(req.body.username);
            if (existingUser) {
                res.status(400).json({ message: "Username already taken" });
                return;
            }
            const newUser = await dao.createUser(req.body);
            req.session["currentUser"] = newUser;
            res.json(newUser);
        } catch (error) {
            res.status(500).json({ message: "Error signing up", error });
        }
    };

    const createUser = async (req, res) => {
        try {
            const user = await dao.createUser(req.body);
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: "Error creating user", error });
        }
    };

    const findUserById = async (req, res) => {
        try {
            const user = await dao.findUserById(req.params.userId);
            if (user) {
                res.json(user);
            } else {
                res.status(404).json({ message: "User not found" });
            }
        } catch (error) {
            res.status(500).json({ message: "Error retrieving user", error });
        }
    };

    const findAllUsers = async (req, res) => {
        const { role, name } = req.query;
        try {
            if (role) {
                const users = await dao.findUsersByRole(role);
                res.json(users);
                return;
            }
            if (name) {
                const users = await dao.findUsersByPartialName(name);
                res.json(users);
                return;
            }
            const users = await dao.findAllUsers();
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: "Error retrieving users", error });
        }
    };

    const deleteUser = async (req, res) => {
        try {
            const status = await dao.deleteUser(req.params.userId);
            res.json(status);
        } catch (error) {
            res.status(500).json({ message: "Error deleting user", error });
        }
    };

    app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
    app.post("/api/users/signin", signin);
    app.post("/api/users/profile", profile);
    app.post("/api/users/signout", signout);
    app.put("/api/users/:userId", updateUser);
    app.get("/api/users", findAllUsers);
    app.delete("/api/users/:userId", deleteUser);
    app.post("/api/users/signup", signup);
    app.post("/api/users", createUser);
    app.get("/api/users/:userId", findUserById);
}
