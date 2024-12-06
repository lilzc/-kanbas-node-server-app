import mongoose from "mongoose";
const enrollmentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'UserModel', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'CourseModel', required: true }
});

export default enrollmentSchema;