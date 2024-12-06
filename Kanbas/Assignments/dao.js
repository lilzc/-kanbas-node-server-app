import model from "./model.js";

export const findAllAssignments = async () => {
  try {
    return await model.find();
  } catch (error) {
    throw new Error(`Error finding all assignments: ${error.message}`);
  }
};

export const findAssignmentById = async (assignmentId) => {
  try {
    return await model.findById(assignmentId);
  } catch (error) {
    throw new Error(`Error finding assignment: ${error.message}`);
  }
};

export const findAssignmentsForCourse = async (courseId) => {
  try {
    return await model.find({ course: courseId });
  } catch (error) {
    throw new Error(`Error finding assignments for course: ${error.message}`);
  }
};

export const createAssignment = async (assignment) => {
  try {
    const newAssignment = new model(assignment);
    return await newAssignment.save();
  } catch (error) {
    throw new Error(`Error creating assignment: ${error.message}`);
  }
};

export const updateAssignment = async (assignmentId, assignment) => {
  try {
    return await model.findByIdAndUpdate(assignmentId, assignment, { new: true });
  } catch (error) {
    throw new Error(`Error updating assignment: ${error.message}`);
  }
};

export const deleteAssignment = async (assignmentId) => {
  try {
    return await model.findByIdAndDelete(assignmentId);
  } catch (error) {
    throw new Error(`Error deleting assignment: ${error.message}`);
  }
};