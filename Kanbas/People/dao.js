import Database from "../Database/index.js";

export const findUsersForCourse = (courseId) => {
  const { users, enrollments } = Database;
  const enrolledUsers = users.filter((user) =>
    enrollments.some(
      (enrollment) => 
        enrollment.user === user._id && 
        enrollment.course === courseId
    )
  );
  return enrolledUsers;
};

export const createUser = (user) => {
  const newUser = {
    ...user,
    _id: new Date().getTime().toString(),
  };
  Database.users = [...Database.users, newUser];
  return newUser;
};

export const updateUser = (userId, userUpdates) => {
  Database.users = Database.users.map((user) =>
    user._id === userId ? { ...user, ...userUpdates } : user
  );
  const updatedUser = Database.users.find((user) => user._id === userId);
  return updatedUser;
};

export const deleteUser = (userId) => {
  Database.users = Database.users.filter((user) => user._id !== userId);
  Database.enrollments = Database.enrollments.filter(
    (enrollment) => enrollment.user !== userId
  );
};