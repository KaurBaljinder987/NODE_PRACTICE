const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    rollNo: Number,
    name: String,
    email: String,
    password: String
});

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;

