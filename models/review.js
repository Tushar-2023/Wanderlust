//require the mongoose
const { string, number, ref } = require("joi");
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
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }
}) 

//model
module.exports = mongoose.model("Review",reviewSchema);
