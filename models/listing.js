//require the mongoose
const mongoose = require("mongoose");
const review = require("./review");
const Review = require("./review.js");

//creating the schema
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    image: {
        type: String,
        default: "https://unsplash.com/photos/    assorted-hot-air-balloons-flying-at-high-altitude-during-daytime-hpTH5b6mo2s",
        set: (v) =>
            v === ""
                ? "https://unsplash.com/photos/assorted-hot-air-balloons-flying-at-high-altitude-during-daytime-hpTH5b6mo2s" : v,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner:
    {
        type: Schema.Types.ObjectId,
        ref: "User"
    }

});

//post mongoose middleware
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
})



//creating the model
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;