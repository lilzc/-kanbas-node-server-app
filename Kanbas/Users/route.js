import * as dao from "./dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";
import mongoose from "mongoose";

export default function UserRoutes(app) {
    const signin = async (req, res) => {
        try {
            const { username, password } = req.body;
            if (!username || !password) {
                return res.status(400).json({ message: "Username and password required" });
            }
            const user = await dao.findUserByCredentials(username, password);
            if (!user) {
                return res.status(401).json({ message: "Invalid credentials" });
            }
            const userObj = user.toObject();
            userObj._id = userObj._id.toString();
            req.session.currentUser = userObj;
            await req.session.save();
            res.json(userObj);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

   const signup = async (req, res) => {
       try {
           const existing = await dao.findUserByUsername(req.body.username);
           if (existing) {
               return res.status(400).json({ message: "Username already taken" });
           }
           const user = await dao.createUser(req.body);
           req.session.currentUser = user;
           res.json(user);
       } catch (error) {
           res.status(500).json({ message: error.message });
       }
   };

   const signout = async (req, res) => {
       req.session.destroy(err => {
           if (err) {
               return res.status(500).json({ message: "Error signing out" });
           }
           res.sendStatus(200);
       });
   };

   const profile = async (req, res) => {
       if (!req.session.currentUser) {
           return res.status(401).json({ message: "Not logged in" });
       }
       res.json(req.session.currentUser);
   };

   const findCoursesForUser = async (req, res) => {
    try {
        console.log("Params:", req.params);
        const userId = req.params.userId;
        console.log("UserId from params:", userId);
        const currentUser = req.session.currentUser;
        console.log("Current user:", currentUser);

        if (!userId) {
            return res.status(400).json({ message: "userId is required" });
        }
        const courses = await enrollmentsDao.findCoursesForUser(userId);
        res.json(courses);
    } catch (error) {
        console.error("Error in route:", error.message);
        res.status(500).json({ message: error.message });
    }
};

   const findAllUsers = async (req, res) => {
       try {
           const { role } = req.query;
           const users = role ? 
               await dao.findUsersByRole(role) : 
               await dao.findAllUsers();
           res.json(users);
       } catch (error) {
           res.status(500).json({ message: error.message });
       }
   };

   const findUserById = async (req, res) => {
       try {
           const user = await dao.findUserById(req.params.userId);
           if (!user) {
               return res.status(404).json({ message: "User not found" });
           }
           res.json(user);
       } catch (error) {
           res.status(500).json({ message: error.message });
       }
   };

   const updateUser = async (req, res) => {
       try {
           const { userId } = req.params;
           const updates = req.body;
           const updatedUser = await dao.updateUser(userId, updates);
           
           if (req.session.currentUser?._id === userId) {
               req.session.currentUser = updatedUser;
           }
           res.json(updatedUser);
       } catch (error) {
           res.status(500).json({ message: error.message });
       }
   };

   const deleteUser = async (req, res) => {
       try {
           const result = await dao.deleteUser(req.params.userId);
           res.json(result);
       } catch (error) {
           res.status(500).json({ message: error.message });
       }
   };

   // Routes
   app.post("/api/users/signin", signin);
   app.post("/api/users/signup", signup);
   app.post("/api/users/signout", signout);
   app.get("/api/users/profile", profile);
   app.get("/api/users", findAllUsers);
   app.get("/api/users/:userId", findUserById);
   app.put("/api/users/:userId", updateUser);
   app.delete("/api/users/:userId", deleteUser);
   app.get("/api/users/:userId/courses", findCoursesForUser);
}