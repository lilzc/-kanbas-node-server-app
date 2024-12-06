import model from "./model.js";

export const findCoursesForUser = async (userId) => {
  try {
    if (!userId) throw new Error("userId is required");
    console.log("Finding courses for user:", userId);
    const enrollments = await model.find({ user: userId }).populate('course');
    return enrollments.map(e => e.course);
  } catch (error) {
    console.error("Error finding courses:", error);
    throw error;
  }
};

export async function findUsersForCourse(courseId) {
  try {
    if (!courseId) throw new Error("courseId is required");
    const enrollments = await model.find({ 
      course: courseId,
      status: "ENROLLED"
    }).populate("user");
    return enrollments.map(enrollment => enrollment.user);
  } catch (error) {
    console.error("Error in findUsersForCourse:", error);
    throw error;
  }
}

export const enrollUserInCourse = async (userId, courseId) => {
  try {
    if (!userId || !courseId) throw new Error("userId and courseId are required");
    const enrollment = await model.create({
      user: userId,
      course: courseId,
      status: "ENROLLED",
      enrollmentDate: new Date(),
    });
    return enrollment;
  } catch (error) {
    console.error("Error enrolling user in course:", error);
    throw error;
  }
};

export const unenrollUserFromCourse = async (userId, courseId) => {
  try {
    if (!userId || !courseId) throw new Error("userId and courseId are required");
    return await model.deleteOne({ 
      user: userId, 
      course: courseId 
    });
  } catch (error) {
    console.error("Error unenrolling user from course:", error);
    throw error;
  }
};

export const findEnrollmentByCourseAndUser = async (courseId, userId) => {
  try {
    if (!courseId || !userId) throw new Error("courseId and userId are required");
    return await model.findOne({ 
      course: courseId,
      user: userId,
      status: "ENROLLED"
    });
  } catch (error) {
    console.error("Error finding enrollment:", error);
    throw error;
  }
};

