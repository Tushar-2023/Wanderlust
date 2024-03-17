//require the mongoose
const { string, number } = require("joi");
const mongoose = require("mongoose");

//creating the schema
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: String,
    rating:{
        type:Number,
        min:1,
        max:5
    },
    createdAt: {
        type:Date,
        default:Date.now()
    }
}) 

//model
module.exports = mongoose.model("Review",reviewSchema);
