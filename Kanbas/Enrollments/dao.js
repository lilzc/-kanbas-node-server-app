import model from "./model.js";
import mongoose from "mongoose";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const findCoursesForUser = async (userId) => {
  try {
    if (!userId) throw new Error("userId is required");
    if (!isValidObjectId(userId)) throw new Error(`Invalid userId: ${userId}`);
    console.log("Finding courses for user:", userId);
    const enrollments = await model.find({ user: userId }).populate('course', 'name description');
    return enrollments.map((e) => e.course);
  } catch (error) {
    console.error("Error finding courses for user:", error);
    throw error;
  }
};

export const findUsersForCourse = async (courseId) => {
  try {
    if (!courseId) throw new Error("courseId is required");
    if (!isValidObjectId(courseId)) throw new Error(`Invalid courseId: ${courseId}`);
    const enrollments = await model.find({
      course: courseId,
      status: "ENROLLED",
    }).populate("user", "name email");
    return enrollments.map((enrollment) => enrollment.user);
  } catch (error) {
    console.error("Error finding users for course:", error);
    throw error;
  }
};

export const enrollUserInCourse = async (userId, courseId) => {
  try {
    if (!userId || !courseId) throw new Error("userId and courseId are required");
    if (!isValidObjectId(userId)) throw new Error(`Invalid userId: ${userId}`);
    if (!isValidObjectId(courseId)) throw new Error(`Invalid courseId: ${courseId}`);
    const enrollment = await model.create({
      user: userId,
      course: courseId,
      status: "ENROLLED",
      enrollmentDate: new Date(),
    });
    console.log("User enrolled successfully:", enrollment);
    return enrollment;
  } catch (error) {
    console.error("Error enrolling user in course:", error);
    throw error;
  }
};

export const unenrollUserFromCourse = async (userId, courseId) => {
  try {
    if (!userId || !courseId) throw new Error("userId and courseId are required");
    if (!isValidObjectId(userId)) throw new Error(`Invalid userId: ${userId}`);
    if (!isValidObjectId(courseId)) throw new Error(`Invalid courseId: ${courseId}`);
    const result = await model.deleteOne({
      user: userId,
      course: courseId,
    });
    console.log("User unenrolled successfully:", result);
    return result;
  } catch (error) {
    console.error("Error unenrolling user from course:", error);
    throw error;
  }
};

export const findEnrollmentByCourseAndUser = async (courseId, userId) => {
  try {
    if (!courseId || !userId) throw new Error("courseId and userId are required");
    if (!isValidObjectId(courseId)) throw new Error(`Invalid courseId: ${courseId}`);
    if (!isValidObjectId(userId)) throw new Error(`Invalid userId: ${userId}`);
    const enrollment = await model.findOne({
      course: courseId,
      user: userId,
      status: "ENROLLED",
    });
    console.log("Enrollment found:", enrollment);
    return enrollment;
  } catch (error) {
    console.error("Error finding enrollment by course and user:", error);
    throw error;
  }
};
