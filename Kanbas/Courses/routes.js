import * as dao from "./dao.js";
import * as modulesDao from "../Modules/dao.js";

export default function CourseRoutes(app) {
  app.get("/api/courses", async (req, res) => {
    try {
      const courses = await dao.findAllCourses();
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/courses/:courseId", async (req, res) => {
    try {
      const { courseId } = req.params;
      await dao.deleteCourse(courseId);
      res.sendStatus(204);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/courses/:courseId", async (req, res) => {
    try {
      const { courseId } = req.params;
      const status = await dao.updateCourse(courseId, req.body);
      res.json(status);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/courses", async (req, res) => {
    try {
      const newCourse = await dao.createCourse(req.body);
      res.json(newCourse);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/courses/:courseId/modules", async (req, res) => {
    try {
      const { courseId } = req.params;
      const modules = await modulesDao.findModulesForCourse(courseId);
      res.json(modules);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/courses/:courseId/modules", async (req, res) => {
    try {
      const { courseId } = req.params;
      const module = {
        ...req.body,
        course: courseId,
      };
      const newModule = await modulesDao.createModule(module);
      res.json(newModule);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
}