//require the mongoose
const mongoose = require("mongoose");
//requiring the data.js 
const initData = require("./data.js")
//requring the the collection listing
const Listing = require("../models/listing.js");


main()
    .then((res) => {
        console.log("connected to db");
    })
    .catch((err) => {
        console.log(err);
    })

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}


//function to wipe out the all the data and initilize the new data into the database
const initDB = async () => {
    //deleting the existing data
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj,owner:'665873002669be68de7378bc'}))
    //initilizing the new data
    await Listing.insertMany(initData.data);
    console.log("data was initilized");
}

initDB();