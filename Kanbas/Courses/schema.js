import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  name: String,
  number: String,
  startDate: String,
  endDate: String,
  department: String,
  credits: Number,
  description: String,
  image: String
}, { collection: "courses" });

export default courseSchema;