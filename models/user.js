const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//requiring the passportLocalMongoose 
const passportLocalMongoose = require("passport-local-mongoose");

//creating the schema for user authenticatiuon
const userSchema = new Schema({
    email:{
        type:String,
        required:true,
    },
   
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);