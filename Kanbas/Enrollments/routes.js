export default function EnrollmentRoutes(app) {
  app.post("/api/users/:userId/enrollments/:courseId", async (req, res) => {
    try {
      const enrollment = await dao.enrollUserInCourse(req.params.userId, req.params.courseId);
      res.json(enrollment);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/users/:userId/enrollments/:courseId", async (req, res) => {
    try {
      const status = await dao.unenrollUserFromCourse(req.params.userId, req.params.courseId);
      res.json(status);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/users/:userId/enrollments", async (req, res) => {
    try {
      const enrollments = await dao.findCoursesForUser(req.params.userId);
      res.json(enrollments);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
}