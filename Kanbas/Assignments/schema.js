import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  points: { type: Number, required: true },
  dueDate: Date,
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CourseModel",
    required: true
  },
  availableFromDate: Date,
  availableUntilDate: Date,
  submissionType: {
    type: String,
    enum: ['TEXT', 'FILE', 'BOTH'],
    default: 'BOTH'
  }
}, {
  collection: "assignments"
});

export default assignmentSchema;