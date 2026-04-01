const mongoose = require('mongoose')

const applySchema = new mongoose.Schema({
    name: String,
    email: String,
    skills:[String],
    message: String
})


const applyModel = mongoose.model("apply", applySchema)

module.exports = applyModel