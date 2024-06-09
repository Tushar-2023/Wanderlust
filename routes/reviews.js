const express = require("express");
const router = express.Router({ mergeParams: true });


//wrapAsync
const wrapAsync = require("../utils/wrapAsync.js")

//custom error class 
const ExpressError = require("../utils/ExpressError.js")



//require the listing model
const Listing = require("../models/listing.js");

//require the review model
const Review = require("../models/review.js");

//validateReview
const { validateReview,isLoggedIn,isReviewAuthor } = require("../middleware.js");

//reviewController
const reviewController = require("../controllers/reviews.js")



//Review
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//post Route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;