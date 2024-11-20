import * as dao from "./dao.js";

export default function EnrollmentRoutes(app) {
  app.post("/api/users/:userId/enrollments/:courseId", (req, res) => {
    try {
      const enrollment = dao.createEnrollment({
        user: req.params.userId,
        course: req.params.courseId,
        role: "STUDENT"
      });
      res.json(enrollment);
    } catch (error) {
      res.status(400).json({ message: "Failed to enroll in course" });
    }
  });

  app.delete("/api/users/:userId/enrollments/:courseId", (req, res) => {
    try {
      dao.deleteEnrollment(req.params.userId, req.params.courseId);
      res.sendStatus(204);
    } catch (error) {
      res.status(400).json({ message: "Failed to unenroll from course" });
    }
  });

  app.get("/api/users/:userId/enrollments", (req, res) => {
    try {
      const enrollments = dao.findUserEnrollments(req.params.userId);
      res.json(enrollments);
    } catch (error) {
      res.status(400).json({ message: "Failed to fetch enrollments" });
    }
  });
}