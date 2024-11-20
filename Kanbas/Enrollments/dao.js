// Kanbas/Enrollments/dao.js

import Database from "../Database/index.js";

export const findEnrollments = () => {
  return Database.enrollments;
};

export const findCourseEnrollments = (courseId) => {
  return Database.enrollments.filter((enrollment) => enrollment.course === courseId);
};

export const findUserEnrollments = (userId) => {
  return Database.enrollments.filter((enrollment) => enrollment.user === userId);
};

export const createEnrollment = (enrollment) => {
  const newEnrollment = { ...enrollment, _id: new Date().getTime().toString() };
  Database.enrollments.push(newEnrollment);
  return newEnrollment;
};

export const deleteEnrollment = (userId, courseId) => {
  Database.enrollments = Database.enrollments.filter(
    (enrollment) => !(enrollment.user === userId && enrollment.course === courseId)
  );
};