import model from "./model.js";

export function findModulesForCourse(courseId) {
  return model.find({ course: courseId });
}

export function createModule(module) {
  delete module._id;
  return model.create(module);
}

export function updateModule(moduleId, moduleUpdates) {
  return model.updateOne({ _id: moduleId }, { $set: moduleUpdates });
}

export function deleteModule(moduleId) {
  return model.deleteOne({ _id: moduleId });
}