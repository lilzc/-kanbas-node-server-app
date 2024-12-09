const enrollmentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'UserModel', required: true },
    course: { type: String, ref: 'CourseModel', required: true } // Changed to String
});