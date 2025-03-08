const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String
    },
    image:{
        type: String,
        default: "https://unsplash.com/photos/brown-and-white-wooden-house-near-green-trees-during-daytime-2gDwlIim3Uw",
        set : (v) => v === "" ? "https://unsplash.com/photos/brown-and-white-wooden-house-near-green-trees-during-daytime-2gDwlIim3Uw" : v,
    },
    price:{
        type: Number,
        required: true
    },
    location:{
        type: String,
        required: true
    },
    country:{
        type: String,
        required: true
    }
});

const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing; 