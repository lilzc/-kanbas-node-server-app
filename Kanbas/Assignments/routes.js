import * as dao from "./dao.js";

export default function AssignmentRoutes(app) {
  // Get all assignments for a course
  app.get("/api/courses/:cid/assignments", (req, res) => {
    const { cid } = req.params;
    const assignments = dao.findAssignmentsForCourse(cid);
    res.json(assignments);
  });

  // Get assignment by ID
  app.get("/api/assignments/:aid", (req, res) => {
    const { aid } = req.params;
    const assignment = dao.findAssignmentById(aid);
    res.json(assignment);
  });

  // Create assignment
  app.post("/api/courses/:cid/assignments", (req, res) => {
    const { cid } = req.params;
    const newAssignment = {
      ...req.body,
      course: cid,
    };
    const actualAssignment = dao.createAssignment(newAssignment);
    res.json(actualAssignment);
  });

  // Update assignment
  app.put("/api/assignments/:aid", (req, res) => {
    const { aid } = req.params;
    const status = dao.updateAssignment(aid, req.body);
    res.json(status);
  });

  // Delete assignment
  app.delete("/api/assignments/:aid", (req, res) => {
    const { aid } = req.params;
    dao.deleteAssignment(aid);
    res.sendStatus(204);
  });
}