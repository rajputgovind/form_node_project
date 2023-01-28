require('dotenv').config()
const express = require('express');
const path = require('path')
require('./db/conn.js')
const hbs = require('hbs')
const bcrypt = require('bcrypt')
const EmployeeModel = require('../src/models/EmployeeModel.js');
const verifyToken = require('./middleware/verifyToken.js')
// const exp = require('constants');
const cookieParser = require('cookie-parser')


const app = express();
const port = process.env.PORT || 8000
// const staticPath = path.join(__dirname,"../public")
// app.use(express.static(staticPath))
// console.log(path.join(__dirname))
const viewsPath = path.join(__dirname, "../templetes/views")
const partialPath = path.join(__dirname, "../templetes/partials")

// app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.set('view engine', "hbs")
app.set('views', viewsPath)
hbs.registerPartials(partialPath)
app.use(cookieParser())

// console.log(process.env.SECRET_KEY)

app.get('/', (req, res) => {
    res.render("index")
})
app.get('/secret', verifyToken, (req, res) => {
    console.log(req.cookies.jwt)
    res.render('secret')
})

app.get('/logout', verifyToken, async (req, res) => {
    try {
        console.log(req.user)
        res.clearCookie("jwt")
        console.log("Logout successful")
        await req.user.save()
        res.status(200).render('login')
    } catch (error) {
        res.status(500).send(error)
    }
})
app.get('/register', (req, res) => {
    res.render('register.hbs')
})

app.post('/register', async (req, res) => {
    try {
        // console.log(req.body.firstname)
        // res.send(req.body.firstname)

        const password = req.body.password
        const cpassword = req.body.confirmpassword
        // console.log(cpassword)
        // console.log(password)
        // res.send()
        if (password === cpassword) {
            const employee = new EmployeeModel({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                gender: req.body.gender,
                phone: req.body.phone,
                age: req.body.age,
                password: password,
                confirmpassword: cpassword
            })

            // const token = await employee.generateAuthToken()
            // console.log("this is a register form token " + token)


            // res.cookie("jwt", token, {
            //     expires: new Date(Date.now() + 300000),
            //     httpOnly: true,
            //     secure: true
            // })

            // res.cookie('jwt', token , {
            //     expires:new Date(Date.now() + 500000),
            //     httpOnly:true
            //     

            // })

            // console.log("This is a register form cookie " +cookie)

            const savedEmployee = await employee.save()
            // console.log(savedEmployee)
            res.status(201).render('index')
        } else {
            res.send('password are not matching')
        }

    } catch (error) {
        res.status(400).send(error)
    }
})
app.get('/login', (req, res) => {
    res.render('login.hbs')
})
app.post('/login', async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password
        // console.log(email +""+ password)
        const employee = await EmployeeModel.findOne({ email: email })
        // console.log(employee)
        //first email is database email
        const isEmail = await bcrypt.compare(password, employee.password)
        const token = await employee.generateAuthToken()
        console.log(`This is a token ${token}`)


        res.cookie('jwt', token, {
            expires: new Date(Date.now() + 500000),
            httpOnly: true
            //secure:true

        })

        // yah if function normal password ko compare karnem me use kiya jayega 
        // jo encrypted nahi honge
        // if(employee.password === password)
        // or is email ka use jo database me encrypted password h or user ke dwara 
        // normal password dala jayega us ke liye use  kiya jayega
        if (isEmail) {
            res.status(201).render('index1.hbs')
        }
        else {
            res.send('invalid login details')
        }
    } catch (error) {
        res.status(400).send("invalid login details")
    }
})

// How to encrypt passsword

// const securePassword = async(password)=>{
//     const hashPassword = await bcrypt.hashSync(password,10)
//     console.log(hashPassword)
// }
// securePassword('govind123')

app.listen(port, () => {
    console.log(`server is listning on port ${port}`)
})