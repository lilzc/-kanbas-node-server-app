import * as dao from "./dao.js";
import * as modulesDao from "../Modules/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";
import mongoose from "mongoose";

export default function CourseRoutes(app) {
 const checkCourseAccess = async (req, res, next) => {
   try {
     const currentUser = req.session["currentUser"];
     const { courseId } = req.params;
     
     if (!currentUser) {
       return res.status(401).json({ message: "Not authenticated" });
     }

     if (!mongoose.Types.ObjectId.isValid(courseId)) {
       return res.status(400).json({ message: "Invalid course ID" });
     }

     if (["ADMIN", "FACULTY"].includes(currentUser.role)) {
       return next();
     }
     
     const enrollment = await enrollmentsDao.findEnrollmentByCourseAndUser(courseId, currentUser._id);
     if (!enrollment) {
       return res.status(403).json({ message: "Not enrolled in this course" });
     }
     next();
   } catch (error) {
     res.status(500).json({ message: error.message });
   }
 };

 const isAuthenticated = (req, res, next) => {
   if (!req.session?.currentUser) {
     return res.status(401).json({ message: "Not authenticated" });
   }
   next();
 };

 const validateObjectId = (req, res, next) => {
   const { courseId } = req.params;
   if (!mongoose.Types.ObjectId.isValid(courseId)) {
     return res.status(400).json({ message: "Invalid course ID" });
   }
   next();
 };

 app.get("/api/courses", isAuthenticated, async (req, res) => {
   try {
     const currentUser = req.session.currentUser;
     const courses = currentUser.role === "ADMIN" || currentUser.role === "FACULTY" 
       ? await dao.findAllCourses()
       : await enrollmentsDao.findCoursesForUser(currentUser._id);
     res.json(courses);
   } catch (error) {
     res.status(500).json({ message: error.message });
   }
 });

 app.post("/api/courses", isAuthenticated, async (req, res) => {
   try {
     const currentUser = req.session.currentUser;
     if (currentUser.role !== "FACULTY") {
       return res.status(403).json({ message: "Only faculty can create courses" });
     }
     const course = await dao.createCourse(req.body);
     await enrollmentsDao.enrollUserInCourse(currentUser._id, course._id);
     res.json(course);
   } catch (error) {
     res.status(500).json({ message: error.message }); 
   }
 });

 app.get("/api/courses/:courseId", validateObjectId, checkCourseAccess, async (req, res) => {
   try {
     const course = await dao.findCourseById(req.params.courseId);
     if (!course) {
       return res.status(404).json({ message: "Course not found" });
     }
     res.json(course);
   } catch (error) {
     res.status(500).json({ message: error.message });
   }
 });

 app.put("/api/courses/:courseId", validateObjectId, checkCourseAccess, async (req, res) => {
   try {
     const currentUser = req.session.currentUser;
     if (currentUser.role !== "FACULTY") {
       return res.status(403).json({ message: "Only faculty can update courses" });
     }
     const status = await dao.updateCourse(req.params.courseId, req.body);
     res.json(status);
   } catch (error) {
     res.status(500).json({ message: error.message });
   }
 });

 app.delete("/api/courses/:courseId", validateObjectId, isAuthenticated, async (req, res) => {
   try {
     const currentUser = req.session.currentUser;
     if (currentUser.role !== "FACULTY") {
       return res.status(403).json({ message: "Only faculty can delete courses" });
     }
     await modulesDao.deleteModulesForCourse(req.params.courseId);
     await enrollmentsDao.deleteEnrollmentsForCourse(req.params.courseId);
     const status = await dao.deleteCourse(req.params.courseId);
     res.json(status);
   } catch (error) {
     res.status(500).json({ message: error.message });
   }
 });

 app.get("/api/courses/:courseId/modules", validateObjectId, checkCourseAccess, async (req, res) => {
   try {
     const modules = await modulesDao.findModulesForCourse(req.params.courseId);
     res.json(modules);
   } catch (error) {
     res.status(500).json({ message: error.message });
   }
 });

 app.post("/api/courses/:courseId/modules", validateObjectId, checkCourseAccess, async (req, res) => {
   try {
     const currentUser = req.session.currentUser;
     if (currentUser.role !== "FACULTY") {
       return res.status(403).json({ message: "Only faculty can create modules" });
     }
     const module = { ...req.body, course: req.params.courseId };
     const newModule = await modulesDao.createModule(module);
     res.json(newModule);
   } catch (error) {
     res.status(500).json({ message: error.message });
   }
 });

 app.get("/api/courses/:cid/users", validateObjectId, checkCourseAccess, async (req, res) => {
   try {
     const users = await enrollmentsDao.findUsersForCourse(req.params.cid);
     res.json(users);
   } catch (error) {
     res.status(500).json({ message: error.message });
   }
 });
}