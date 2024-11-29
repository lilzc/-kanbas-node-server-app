import mongoose from "mongoose";
import model from "./model.js";

export const findAllCourses = () => model.find();


export const deleteCourse = async (courseId) => {
  const Enrollment = mongoose.model('enrollments');
  await Enrollment.deleteMany({ course: courseId });
  return model.deleteOne({ _id: courseId });
};

export const updateCourse = (courseId, courseUpdates) => 
  model.updateOne({ _id: courseId }, { $set: courseUpdates });

export const createCourse = (course) => {
  delete course._id; 
  return model.create(course);
};

export const findCourseById = (courseId) => model.findById(courseId);

export const findCoursesForEnrolledUser = async (userId) => {
  console.log("Finding courses for user:", userId);
  const Enrollment = mongoose.model('enrollments');
  try {
    const enrollments = await Enrollment.find({ user: userId }).populate('course');
    console.log("Found enrollments:", enrollments);
    return enrollments.map(enrollment => enrollment.course);
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};