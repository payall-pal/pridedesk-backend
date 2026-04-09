
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
   
        namee = req.body.name,
        email = req.body.email,
        message = req.body.message

    
        await emailModel.create({
            name: namee,
            email: email,
            message: message
        })

        try{

            console.log("EMAIL:", process.env.USER_EMAIL);
            console.log("PASS:", process.env.PASSWORD);

            const transporter = nodemailer.createTransport({
                service:"gmail",
                
                auth:{
                    user:process.env.USER_EMAIL,
                    pass:process.env.PASSWORD
                }
            })

            const mailOptions = {
                from: process.env.USER_EMAIL,
                to: process.env.ADMIN_EMAIL,
                replyTo: email,
                subject: "Contact Message",
                text: `
                Name: ${namee}
                Email: ${email}
                Message: ${message}
                `
            }

            await transporter.sendMail(mailOptions)
            console.log("Email sent")
            return res.status(201).json({
                success: true,
                message: "Email sent"
            })


        } catch(error){
            console.log(error)
            return res.status(500).json({
                success: false,
            message: "Error sending Email!",
                error: error.message,
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

    const namee = req.body.name
    const email = req.body.email
        const review = req.body.review
        const rating = req.body.rating

    await reviewModel.create({
        name: namee,
        email: email,
        review: review,
        rating: rating
    })

    try {

        const transporter = nodemailer.createTransport({
            service:"gmail",
            auth: {
                user:process.env.USER_EMAIL,
                pass:process.env.PASSWORD
            }
        })

        const mailOptions = {
            from: process.env.USER_EMAIL,
            to: process.env.ADMIN_EMAIL,
            replyTo: email,
            subject: `New Contact Message form ${namee}`,
            text: `
            Name: ${namee},
            Email: ${email},
            Review: ${review},
            Rating: ${rating}`
        }

        await transporter.sendMail(mailOptions)
        console.log("Email sent")
        return res.status(200).json({
            success: true,
            message: "Email Sent!"
        })

    } catch {
        console.log("Error sending email")
        return res.status(500).json({
            success: false,
            message: "Error sending email"
        })

    }

})

// Apply request
app.post("/apply", upload.single(), async (req, res) => {
    const namee = req.body.name
        const email = req.body.email
        const skills = req.body.skills
        const message = req.body.message

    await applyModel.create({
        name: namee,
        email: email,
        skills: skills,
        message: message
    })

    try {

        const transporter = nodemailer.createTransport({
            service:"gmail",
            // host:"smtp.gmail.com",
            // port:465,
            // secure: false,
            auth: {
                user:process.env.USER_EMAIL,
                pass:process.env.PASSWORD
            }
        })

        const mailOptions = {
            from: process.env.USER_EMAIL,
            to: process.env.ADMIN_EMAIL,
            replyTo: email,
            subject: `New message from ${namee}`,
            text: `
            Name: ${namee},
            Email: ${email},
            Skills: ${skills},
            Message: ${message}
            `
        }

        await transporter.sendMail(mailOptions)
        console.log("Email Sent")
        return res.status(200).json({
            success: true,
            message: "Email Sent!",

        })
    }
    catch {
        console.log("Error Sending Email")
        return res.status(500).json({
            success: false,
            message: "Error sending email"
        })
    }
})


module.exports = app