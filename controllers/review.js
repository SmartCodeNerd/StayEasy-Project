const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

//Post Route
module.exports.post = async(req,res,next) => {
    const { id } = req.params;
    const cleanId = id.trim(); // Removes leading/trailing spaces
    const listing = await Listing.findById(cleanId);
    //console.log(listing);
 
    let newReview = new Review(req.body);
    listing.reviews.push(newReview);

    newReview.author = req.user._id;

    await newReview.save();
    await listing.save();

    console.log("New Review Saved");
    // res.send("New Review Saved");
    //res.send("Success");
    req.flash("success","New Review Added Successfully");
    res.redirect(`/listings/${cleanId}`);
};

//Destroy Route
module.exports.destroy = async(req,res,next) => {
    //res.send("Deleted Successfully");
    let {id,rid} = req.params;
    const cleanId = id.trim();
    const cleanrId = rid.trim();
    await Listing.findByIdAndUpdate(cleanId , {$pull : {reviews : cleanrId}});
    await Review.findByIdAndDelete(cleanrId);
    req.flash("success","Review Deleted Successfully");
    res.redirect(`/listings/${cleanId}`);
};