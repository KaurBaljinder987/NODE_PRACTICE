require('dotenv').config()

const express = require('express');
const jwt = require('jsonwebtoken')
const app = express.Router();
const bcrypt = require('bcrypt');

const Student = require('../models/student');

const secretKey = process.env.SECRETKEY;
console.log("----secretKey---", secretKey)

//to save student data 
app.post('/createStudent', async (req, res) => {
    try {
        const student = new Student({
            rollNo: req.body.rollNumber,
            name: req.body.name,
            email: req.body.email
        })

        const createStudent = await student.save()
        console.log("----length---", createStudent)
        res.status(200).json({
            status: 'success',
            data: {
                createStudent
            }
        });
    }
    catch (err) {
        console.log("--error---", err)
        res.send(err);
    }
});

app.get("/student/:Name", async (req, res,) => {
    console.log("-----id---", req.params.Name)
    // return
    try {
        const name = req.params.Name;
        const studentData = await Student.find({ Name: name })
        console.log("studentData-----------", studentData);
        res.json(studentData)
    }
    catch (err) {
        console.log("---err--", err)
        res.send(err)
    }
})


//to get all the data
app.get('/getStudent', async (req, res) => {
    try {
        const studentData = await Student.find()
        res.status(200).json({
            Total_Records: studentData.length,
            Student_Data: studentData
        })
    }
    catch (err) {
        console.log("--error---", err)
        res.send(err);
    }
});


// Student Registration

const saltRounds = 10;

app.post("/register", async (req, res) => {
    try {
        const { email, password, name, rollNo } = req.body;
        console.log("----req.body---", req.body)

        let encryptedPassword = bcrypt.hashSync(password, saltRounds);
        const stuData = await Student.findOne({
            email: email
        })
        if (stuData) {
            res.send({ message: "User already registered" })
        }
        else {
            const student = new Student({
                email,
                password: encryptedPassword,
                name,
                rollNo
            })
            const createStudent = await student.save()
            res.status(200).json({
                status: 'success',
                data: {
                    createStudent
                },
                message: "Successfully Registered, Please Login now"
            });
        }
    }
    catch (err) {
        console.log("---err----", err)
    }
})

// Student Login

app.get("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const studentData = await Student.findOne({ email: email })
        let pwdVerify = bcrypt.compareSync(password, studentData.password);
        console.log("----pwdVerify--", pwdVerify)
        if (pwdVerify) {
            const token = jwt.sign(email, secretKey);
            console.log("---token---", token)
            return res.status(200).json({
                message: "Login Successfully",
                token
            });
        }
        else {
            return res.status(400).json({ message: "Password didn't match" });
        }
    }
    catch (err) {
        console.log("---err--", err)
        return res.status(400).json({ message: "User not exists" });
    }
})


module.exports = app;


