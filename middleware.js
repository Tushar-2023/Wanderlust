const Listing = require("./models/listing");

//custom error class 
const ExpressError = require("./utils/ExpressError.js")

//schema validation
const { listingSchema } = require("./schema.js")

//schema validation
const { reviewSchema } = require("./schema.js")

//isLoggedIn
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        //console.log(req.path, "..", req.originalUrl);
        req.flash("error", "You should logged in to add the listings");
        return res.redirect("/login");
    };
    next();
};

//saveRedirectUrl
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

//isOwner
module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    //check
    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You don't have permission to edit");
        return res.redirect(`/listings/${id}`);
    }

    next();
}


//function to validate the Listingschema
module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(400, errMsg)
    } else {
        next();
    }
}

//function to validate the Reviewschema
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(400, errMsg)
    } else {
        next();
    }
}