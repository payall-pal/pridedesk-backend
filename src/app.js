
const express = require('express')
const cors = require('cors')
const postModel = require('./models/post.model')
const multer = require("multer")
const uploadFile = require("./Services/storage.service")
const emailModel = require('./models/email.model')
const reviewModel = require('./models/reviewModel')
const applyModel = require('./models/applyModel')
const nodemailer = require('nodemailer')

const app = express()

app.use(cors())
app.use(express.json())

const upload = multer({ storage: multer.memoryStorage() })

// post- data ko server pe daal rhe h then server ---> database m 

// app.post("/create-post", upload.single("image"), async (req, res) => {

//     console.log(req.file)
//     const result = await uploadFile(req.file.buffer)

//     const post = await postModel.create({
//         image: result.url,
//         caption: req.body.caption
//     })


//     res.status(201).json({
//         message: "post created"
//     })
// })

// app.get("/posts", async (req, res) => {

//     const posts = await postModel.find()

//     console.log(posts)

//     return res.status(200).json({
//         message: "Post fetch successfully",
//         posts
//     })

// })


// Email data ko server pe daal rhe h then gmail pe send kr denge

app.post("/contact-email", upload.single(), async (req, res) => {
    console.log("1. sending POST request")
    namee = req.body.name,
        email = req.body.email,
        message = req.body.message
    try {

        const modell = await emailModel.create({
            name: req.body.name,
            email: req.body.email,
            message: req.body.message
        })

        if(!process.env.EMAIL || !process.env.PASSWORD){
            throw new Error("Can't access credentials")
        }


        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth:{
                user:process.env.USER_EMAIL,      
                pass:process.env.PASSWORD
            }
        })

        console.log(USER_EMAIL)

        
        const mailOptions = {
            from: process.env.USER_EMAIL,
            to: process.env.ADMIN_EMAIL,
            replyTo: email,
            subject: `New Contact Message form ${namee}`,
            text: `
            Name: ${namee},
            Email: ${email},
            Message: ${message}`
        }



        await transporter.sendMail(mailOptions)

        return res.status(200).json({
            success: true,
            message: "Email Sent!"
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        })

    }

})


// Fetching the EmailData

app.get("/email-data", async (req, res) => {
    const emailData = await emailModel.find()

    res.status(200).json({
        message: "Data fetched",
        emailData
    })
})

//review 

app.post("/give-review", upload.single(), async (req, res) => {

    name = req.body.name,
        email = req.body.email,
        review = req.body.review,
        rating = req.body.rating

    const revieww = reviewModel.create({
        name: req.body.name,
        email: req.body.email,
        review: req.body.review,
        rating: req.body.rating
    })

    try {

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.APP_PASSWORD
            }
        })

        const mailOptions = {
            from: email,
            to: process.env.EMAIL,
            subject: `New Contact Message form ${name}`,
            text: `
            Name: ${name},
            Email: ${email},
            Review: ${review},
            Rating: ${rating}`
        }

        await transporter.sendMail(mailOptions)
        res.status(200).json({
            success: true,
            message: "Email Sent!"
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Error sending email"
        })

    }

})

// Apply request
app.post("/apply", upload.single(), async (req, res) => {
    name = req.body.name,
        email = req.body.email,
        skills = req.body.skills,
        message = req.body.message

    const Data = applyModel.create({
        name: name,
        email: email,
        skills: skills,
        message: message
    })

    try {

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.APP_PASSWORD
            }
        })

        const mailOptions = {
            from: email,
            to: process.env.EMAIL,
            subject: `New message from ${name}`,
            text: `
            Name: ${name},
            Email: ${email},
            Skills: ${skills},
            Message: ${message}
            `
        }

        await transporter.sendMail(mailOptions)
        res.status(200).json({
            success: true,
            message: "Email Sent!",

        })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            message: "Error sending email"
        })
    }
})


module.exports = app