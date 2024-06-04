const express = require("express");
const router = express.Router({mergeParams: true});


//wrapAsync
const wrapAsync = require("../utils/wrapAsync.js")

//custom error class 
const ExpressError = require("../utils/ExpressError.js")



//require the listing model
const Listing = require("../models/listing.js");

//require the review model
const Review = require("../models/review.js");

//validateReview
const validateReview = require("../middleware.js");





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