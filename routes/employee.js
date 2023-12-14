const express = require('express');
const app = express.Router();
const bcrypt = require('bcrypt');

const Emp = require('../models/employee');

app.post('/emp_post', async (req, res) => {
    try {
        const employee = new Emp({
            Id: req.body.Id,
            Name: req.body.Name,
            Dept: req.body.Dept,
            Salary: req.body.Salary
        })

        const createEmployee = await employee.save(employee)
        res.json(createEmployee);
    }
    catch (err) {
        console.log("----err--", err)
        res.send(err);
    }
});

/*app.get('/emp', async (req, res) => {
    const employeeData = await Emp.find()
    res.json(employeeData)

});*/

app.get("/employee/:_id", async (req, res,) => {
    console.log("-----id---", req.params._id)
    // return
    try {
        const employeeData = await Emp.findById(req.params._id)
        console.log("employeeData-----------", employeeData);
        res.json(employeeData)
    }
    catch (err) {
        console.log("---err--", err)
        res.send(err)
    }
}),

    app.get("/emp/:id", async (req, res,) => {

        try {
            const ID = req.params.id;
            const employeeData = await Emp.find({ Id: ID })
            console.log("employeeData-----------", employeeData);
            res.json(employeeData)
        }
        catch (err) {
            console.log("---err--", err)
            res.send(err)
        }
    }),

    app.get("/findEmp", async (req, res,) => {
        try {
            const employeeData = await Emp.find({
                Name: req.body.Name,
                Id: req.body.Id
            })
            console.log("employeeData-----------", employeeData);
            // res.json(employeeData)
            res.status(200).json(employeeData);
        }
        catch (err) {
            console.log("---err--", err)
            res.status(400).json(err);
        }
    }),

    app.get('/emp', async (req, res) => {
        try {
            const employeeData = await Emp.find()
            res.status(200).json({
                Total_Records: employeeData.length,
                Emp_Data: employeeData
            })
        }
        catch (err) {
            console.log("--error---", err)
            res.send(err);
        }
    });


//update
// app.put('/emp_update/:Name', async (req, res) => {
//     const name = req.params.Name;
//     const employeeData = await Emp.findOneAndUpdate({ Name: name }, {
//         $set: {
//             Dept: req.body.Dept,
//             Salary: req.body.Salary
//         }
//     }, { new: true });

//     console.log("employeeData-----------", employeeData);
//     res.json(employeeData)
// })

app.put('/emp_update/:empId', async (req, res) => {
    try {
        const Id = req.params.empId;
        const updateData = req.body;

        const updatedItem = await Emp.findOneAndUpdate(
            { Id: Id },
            updateData,
            { new: true }
        );
        console.log("----updatedItem---", updatedItem)

        res.json(updatedItem);
    } catch (error) {
        console.log("-----error---", error)
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.put('/Emp_update/:Id', async (req, res) => {
    try {
        const ID = req.params.Id;
        const employeeData = await Emp.findOneAndUpdate({ Id: ID }, {
            $set: {
                "Dept": "Lawyer"
            }
        })
        console.log("employeeData-----------", employeeData);
        res.json(employeeData)
    }
    catch (err) {
        console.log("---err--", err)
        res.status(400).json(err);
    }
})

//delete
app.delete('/emp_delete/:id', async (req, res) => {
    const ID = req.params.id;
    const employeeData = await Emp.findOneAndDelete({ Id: ID })
    console.log("employeeData-----------", employeeData);
    res.status(200).json({
        message: "data deleted successfully"
    });
})


// employee Registeration

const saltRounds = 10

app.post("/empRegister", async (req, res) => {
    const { Id, Name, Email, Password, Dept, Salary } = req.body;

    let encryptedPassword = bcrypt.hashSync(Password, saltRounds);
    const empData = await Emp.findOne({
        Email: Email
    })
    if (empData) {
        res.send({ message: "User already registered" })
    }
    else {
        const employee = new Emp({
            Id,
            Name,
            Email,
            Password: encryptedPassword,
            Dept,
            Salary
        })
        const createEmployee = await employee.save()
        res.status(200).json({
            status: 'success',
            data: {
                createEmployee
            },
            message: "Successfully Registered, Please Login now"
        })
    }
})

// Employee Login

app.get("/empLogin", async (req, res) => {
    try {
        const Email = req.body.Email;
        const Password = req.body.Password;
        const empData = await Emp.findOne({
            Email: Email
        })
        let pwdVerify = bcrypt.compareSync(Password, empData.Password);
        if (pwdVerify) {
            return res.status(200).json({
                message: "Login Successfully"
            });
        }

        else {
            return res.status(400).json({ message: "passsword didnt match" });
        }
    }
    catch (err) {
        console.log("-----err----", err)
        return res.status(400).json({ message: "User not exist" });
    }
})



module.exports = app;



