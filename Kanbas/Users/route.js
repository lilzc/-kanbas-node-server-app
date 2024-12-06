import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";
import mongoose from "mongoose";

export default function UserRoutes(app) {

    const signin = async (req, res) => {
        try {
            const { username, password } = req.body; 
            const user = await dao.findUserByCredentials(username, password);
            if (!user) return res.status(401).json({ message: "Invalid credentials" });
            req.session.currentUser = user;
            await req.session.save();
            console.log("Session after signin:", req.session);
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    const findCoursesForUser = async (req, res) => {
        try {
            const currentUser = req.session["currentUser"];
            console.log("Current user session:", currentUser);
            console.log("Mongoose status:", mongoose.connection.readyState);
            
            if (!currentUser) {
                return res.status(401).json({ message: "Not logged in" });
            }
    
            let userId = currentUser._id;
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({ message: "Invalid user ID format" });
            }
    
            const enrollments = await enrollmentsDao.findCoursesForUser(userId);
            res.json(enrollments);
        } catch (error) {
            console.error("Detailed error:", error);
            res.status(500).json({ message: error.message });
        }
    };
      
 const signup = async (req, res) => {
   try {
     const user = await dao.findUserByUsername(req.body.username);
     if (user) {
       return res.status(400).json({ message: "Username already taken" });
     }
     const currentUser = await dao.createUser(req.body);
     req.session["currentUser"] = currentUser;
     res.json(currentUser);
   } catch (error) {
     res.status(500).json({ message: error.message });
   }
 };

 const findAllUsers = async (req, res) => {
   try {
     const { role } = req.query;
     const users = role ? await dao.findUsersByRole(role) : await dao.findAllUsers();
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
     const userUpdates = req.body;
     const status = await dao.updateUser(userId, userUpdates);
     const currentUser = req.session["currentUser"];
     if (currentUser && currentUser._id === userId) {
       req.session["currentUser"] = { ...currentUser, ...userUpdates };
     }
     res.json(status);
   } catch (error) {
     res.status(500).json({ message: error.message });
   }
 };

 const enrollUserInCourse = async (req, res) => {
   try {
     let { uid, cid } = req.params;
     if (uid === "current") {
       const currentUser = req.session["currentUser"];
       if (!currentUser) {
         return res.status(401).json({ message: "Not authenticated" });
       }
       uid = currentUser._id;
     }
     const status = await enrollmentsDao.enrollUserInCourse(uid, cid);
     res.json(status);
   } catch (error) {
     res.status(500).json({ message: error.message });
   }
 };

 const unenrollUserFromCourse = async (req, res) => {
   try {
     let { uid, cid } = req.params;
     if (uid === "current") {
       const currentUser = req.session["currentUser"];
       if (!currentUser) {
         return res.status(401).json({ message: "Not authenticated" });
       }
       uid = currentUser._id;
     }
     const status = await enrollmentsDao.unenrollUserFromCourse(uid, cid);
     res.json(status);
   } catch (error) {
     res.status(500).json({ message: error.message });
   }
 };

 const deleteUser = async (req, res) => {
   try {
     const status = await dao.deleteUser(req.params.userId);
     res.json(status);
   } catch (error) {
     res.status(500).json({ message: error.message });
   }
 };

 const getProfile = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      return res.status(401).json({ message: "Not logged in" });
    }
    res.json(currentUser);
  };
  app.get("/api/users/profile", getProfile);
 

  app.post("/api/users/signout", async (req, res) => {
    try {
      req.session.destroy(err => {
        if (err) {
          res.status(500).json({message: "Error signing out"});
        } else {
          res.sendStatus(200);
        }
      });
    } catch (error) {
      res.status(500).json({message: error.message});
    }
  });

  app.get("/api/users/profile", async (req, res) => {
    try {
      if (!req.session?.currentUser) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      res.json(req.session.currentUser);
    } catch (error) {
      console.error("Profile error:", error);
      res.status(500).json({ message: error.message });
    }
  });
  
  app.get("/api/users/current/courses", async (req, res) => {
    try {
      if (!req.session?.currentUser?._id) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      const courses = await enrollmentsDao.findCoursesForUser(req.session.currentUser._id);
      res.json(courses);
    } catch (error) {
      console.error("Courses error:", error);
      res.status(500).json({ message: error.message });
    }
  });

  
 app.get("/api/users/current/courses", findCoursesForUser);
 app.get("/api/users/:uid/courses", findCoursesForUser);
 app.post("/api/users/signin", signin);
 app.post("/api/users/signup", signup);
 app.get("/api/users", findAllUsers);
 app.get("/api/users/:userId", findUserById);
 app.put("/api/users/:userId", updateUser);
 app.delete("/api/users/:userId", deleteUser);
 app.post("/api/users/:uid/courses/:cid", enrollUserInCourse);
 app.delete("/api/users/:uid/courses/:cid", unenrollUserFromCourse);
}