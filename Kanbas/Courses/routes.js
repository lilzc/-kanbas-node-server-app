import * as dao from "./dao.js";
import * as modulesDao from "../Modules/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";
import mongoose from "mongoose";

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


export default function CourseRoutes(app) {
  app.get("/api/courses", async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      return res.status(401).json({ message: "Please login first" });
    }

    if (currentUser.role === "ADMIN" || currentUser.role === "FACULTY") {
      const courses = await dao.findAllCourses();
      return res.json(courses);
    }

    const courses = await enrollmentsDao.findCoursesForUser(currentUser._id);
    res.json(courses);
  });

  app.post("/api/courses", async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser || currentUser.role !== "FACULTY") {
      return res.status(403).json({ message: "Only faculty can create courses" });
    }

    const course = await dao.createCourse(req.body);
    await enrollmentsDao.enrollUserInCourse(currentUser._id, course._id);
    res.json(course);
  });

  app.get("/api/courses/:courseId", checkCourseAccess, async (req, res) => {
    const course = await dao.findCourseById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  });

  app.put("/api/courses/:courseId", checkCourseAccess, async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (currentUser.role !== "FACULTY") {
      return res.status(403).json({ message: "Only faculty can update courses" });
    }
    
    const status = await dao.updateCourse(req.params.courseId, req.body);
    res.json(status);
  });

  app.delete("/api/courses/:courseId", async (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      if (currentUser?.role !== "FACULTY") {
        return res.status(403).json({ message: "Only faculty can delete courses" });
      }

      await modulesDao.deleteModulesForCourse(req.params.courseId); // Delete associated modules
      await enrollmentsDao.deleteEnrollmentsForCourse(req.params.courseId); // Delete enrollments
      const status = await dao.deleteCourse(req.params.courseId);
      res.json(status);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });


  app.get("/api/courses/:courseId/modules", checkCourseAccess, async (req, res) => {
    const modules = await modulesDao.findModulesForCourse(req.params.courseId);
    res.json(modules);
  });

  app.post("/api/courses/:courseId/modules", checkCourseAccess, async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (currentUser.role !== "FACULTY") {
      return res.status(403).json({ message: "Only faculty can create modules" });
    }

    const module = {
      ...req.body,
      course: req.params.courseId,
    };
    const newModule = await modulesDao.createModule(module);
    res.json(newModule);
  });

  app.get("/api/courses/:cid/users", checkCourseAccess, async (req, res) => {
    const users = await enrollmentsDao.findUsersForCourse(req.params.cid);
    res.json(users);
  });
}