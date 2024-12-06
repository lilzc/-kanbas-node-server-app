import * as dao from "./dao.js";

export default function AssignmentRoutes(app) {
  // Get all assignments for a course
  app.get("/api/courses/:cid/assignments", async (req, res) => {
    try {
      const { cid } = req.params;
      const assignments = await dao.findAssignmentsForCourse(cid);
      res.json(assignments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get assignment by ID
  app.get("/api/assignments/:aid", async (req, res) => {
    try {
      const { aid } = req.params;
      const assignment = await dao.findAssignmentById(aid);
      if (!assignment) {
        return res.status(404).json({ message: "Assignment not found" });
      }
      res.json(assignment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Create assignment
  app.post("/api/courses/:cid/assignments", async (req, res) => {
    try {
      const { cid } = req.params;
      const newAssignment = { ...req.body, course: cid };
      const actualAssignment = await dao.createAssignment(newAssignment);
      res.status(201).json(actualAssignment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Update assignment
  app.put("/api/assignments/:aid", async (req, res) => {
    try {
      const { aid } = req.params;
      const status = await dao.updateAssignment(aid, req.body);
      if (status.modifiedCount === 0) {
        return res.status(404).json({ message: "Assignment not found" });
      }
      res.json(status);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Delete assignment
  app.delete("/api/assignments/:aid", async (req, res) => {
    try {
      const { aid } = req.params;
      const status = await dao.deleteAssignment(aid);
      if (status.deletedCount === 0) {
        return res.status(404).json({ message: "Assignment not found" });
      }
      res.sendStatus(204);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
}