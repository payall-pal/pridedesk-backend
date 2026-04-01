require('dotenv').config()
const express = require("express")
const app = require("./src/app")
const connectDB = require('./src/db/db')

app.use(express.json())

connectDB()




app.listen(3000, ()=>{
    console.log("server is running on port 3000")
})
