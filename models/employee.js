const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    Id: {
        type: Number,
        unique: true
    },
    Name: String,
    Email: String,
    Password: String,
    Dept: {
        type: String,
        required: true
    },
    Salary: Number
})

const Emp = mongoose.model('Emp', employeeSchema);
module.exports = Emp;