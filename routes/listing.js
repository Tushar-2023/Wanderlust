const express = require("express");
const router = express.Router();

//wrapAsync
const wrapAsync = require("../utils/wrapAsync.js")

//require the listing model
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

//require the controllers
const listingController = require("../controllers/listing.js");

const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

//router.route - making a single instance
//index and create route using router.route
router
    .route("/")
    .get(wrapAsync(listingController.index))
    // .post(validateListing, isLoggedIn, wrapAsync(listingController.createListing));
    .post(upload.single('listing[image]'),(req,res)=> {
        res.send(req.file);
    })

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//new route to create or add the new list to the listings
router.get("/new", isLoggedIn, listingController.renderNewForm)

//show, update and delete using router.route
router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(validateListing, isLoggedIn, isOwner, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destoryListing));


//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;
