const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const validationSchema = require("../schema.js"); //Joi
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

//MiddleWare for Server Side Validation for Reviews.(As a function)
const validateReviews = (req,res,next) => {
    let result = validationSchema.reviewSchema.validate(req.body);
    if(result.error) {
        console.log(result);
        throw new ExpressError(400 , result.error);
    }
    else
    {
        next();
    }
};

//Post Review Route
router.post("/" , validateReviews , wrapAsync(async(req,res,next) => {

    const { id } = req.params;
    const cleanId = id.trim(); // Removes leading/trailing spaces
    const listing = await Listing.findById(cleanId);
    //console.log(listing);
 
    let newReview = new Review(req.body);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("New Review Saved");
    // res.send("New Review Saved");
    //res.send("Success");
    res.redirect(`/listings/${cleanId}`);
}));

//Delete Review Route
router.delete("/:rid" , wrapAsync(async(req,res,next) => {
    //res.send("Deleted Successfully");
    let {id,rid} = req.params;
    const cleanId = id.trim();
    const cleanrId = rid.trim();
    await Listing.findByIdAndUpdate(cleanId , {$pull : {reviews : cleanrId}});
    await Review.findByIdAndDelete(cleanrId);
    res.redirect(`/listings/${cleanId}`);
}));

module.exports = router;
