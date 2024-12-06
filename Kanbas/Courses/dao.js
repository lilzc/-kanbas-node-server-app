import model from "./model.js";

export const findAllCourses = async () => {
  return await model.find();
};


export const deleteCourse = async (courseId) => {
  if (!courseId) throw new Error("Course ID required");
  return await model.findByIdAndDelete(courseId);
};

export const updateCourse = async (courseId, updates) => {
  if (!courseId) throw new Error("Course ID required");
  return await model.findByIdAndUpdate(
    courseId, 
    { $set: updates },
    { new: true }
  );
};

export const createCourse = async (course) => {
  delete course._id;
  return await model.create(course);
};

export const findCourseById = async (courseId) => {
  if (!courseId) throw new Error("Course ID required");
  return await model.findById(courseId);
};