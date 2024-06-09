const Listing = require("../models/listing");


//index
module.exports.index = async (req, res) => {
    let allListings = await Listing.find();
    res.render("./listings/index.ejs", { allListings });
}

//add new listing
module.exports.renderNewForm = (req, res) => {
    res.render("./listings/new.ejs");
}

//show listing
module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            }

        })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Listing you are requested for does not exist");
        res.redirect("/listings");
    }
    //console.log(listing);
    res.render("./listings/show.ejs", { listing });
}


//createListing
module.exports.createListing = async (req, res, next) => {

    const newListing = new Listing(req.body.listing);
    console.log(req.user);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New listing created!")
    res.redirect("/listings");
    next(err);

}


//renderEditForm
module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you are requested for does not exist");
        res.redirect("/listings");
    }
    res.render("./listings/edit.ejs", { listing });
};

//updateListing
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing updated!")
    res.redirect(`/listings${id}`);
};

//destroy listing
module.exports.destoryListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing deleted!")
    res.redirect("/listings");
};