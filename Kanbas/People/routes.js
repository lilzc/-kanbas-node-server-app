import * as dao from "./dao.js";

function PeopleRoutes(app) {
  app.get("/api/courses/:courseId/users", (req, res) => {
    const { courseId } = req.params;
    const users = dao.findUsersForCourse(courseId);
    res.json(users);
  });

  // Create a new user (faculty only)
  app.post("/api/courses/:courseId/users", (req, res) => {
    const currentUser = req.session["currentUser"];
    if (currentUser?.role !== "faculty") {
      res.sendStatus(403);
      return;
    }
    const newUser = dao.createUser(req.body);
    res.json(newUser);
  });

  // Update a user (faculty only)
  app.put("/api/users/:userId", (req, res) => {
    const currentUser = req.session["currentUser"];
    if (currentUser?.role !== "faculty") {
      res.sendStatus(403);
      return;
    }
    const { userId } = req.params;
    const status = dao.updateUser(userId, req.body);
    res.json(status);
  });

  // Delete a user (faculty only)
  app.delete("/api/users/:userId", (req, res) => {
    const currentUser = req.session["currentUser"];
    if (currentUser?.role !== "faculty") {
      res.sendStatus(403);
      return;
    }
    const { userId } = req.params;
    dao.deleteUser(userId);
    res.sendStatus(204);
  });
}

export default PeopleRoutes;