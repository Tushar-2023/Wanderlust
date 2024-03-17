const express = require("express");
const router = express.Router({mergeParams: true});


//wrapAsync
const wrapAsync = require("../utils/wrapAsync.js")

//custom error class 
const ExpressError = require("../utils/ExpressError.js")

//schema validation
const { reviewSchema } = require("../schema.js")

//require the listing model
const Listing = require("../models/listing.js");

//require the review model
const Review = require("../models/review.js");


//function to validate the Reviewschema
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(400, errMsg)
    } else {
        next();
    }
}


//Review
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//post Route
router.post("/", validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    req.flash("success","New review created!")
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
}));

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Delete review route
router.delete("/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted !")
    res.redirect(`/listings/${id}`)
}));

module.exports = router;