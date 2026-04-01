const mongoose = require('mongoose')

const emailSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String
})


const emailModel = mongoose.model("emails", emailSchema)

module.exports = emailModel