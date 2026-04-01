const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    name: String,
    email: String,
    review: String,
    rating: Number,
})


const reviewModel = mongoose.model("reviews", reviewSchema)

module.exports = reviewModel