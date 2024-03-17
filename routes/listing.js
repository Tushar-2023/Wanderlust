const express = require("express");
const router = express.Router();


//wrapAsync
const wrapAsync = require("../utils/wrapAsync.js")

//custom error class 
const ExpressError = require("../utils/ExpressError.js")

//schema validation
const { listingSchema, reviewSchema } = require("../schema.js")

//require the listing model
const Listing = require("../models/listing.js");

//function to validate the Listingschema
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(400, errMsg)
    } else {
        next();
    }
}




//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//index route
router.get("/", wrapAsync(async (req, res) => {
    let allListings = await Listing.find();
    res.render("./listings/index.ejs", { allListings });
}));

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//new route to create or add the new list to the listings
router.get("/new", (req, res) => {
    res.render("./listings/new.ejs");
})

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//show route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error","Listing you are requested for does not exist");
        res.redirect("/listings");
    }
    res.render("./listings/show.ejs", { listing });
})); 

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//create route
router.post("/", validateListing, wrapAsync(async (req, res, next) => {

    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success","New listing created!")
    res.redirect("/listings");
    next(err);

}));


//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//edit route
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you are requested for does not exist");
        res.redirect("/listings");
    }
    res.render("./listings/edit.ejs", { listing });
}));

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Update route 
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success","Listing updated!")
    res.redirect("/listings");
}));

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//delete route
router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing deleted!")
    res.redirect("/listings");
}));

module.exports = router;
