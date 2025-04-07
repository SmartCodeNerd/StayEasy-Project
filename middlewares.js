const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const validationSchema = require("./schema.js"); //Joi


module.exports.isLoggedIn = (req,res,next) => {
    console.log(req.path,"  ",req.originalUrl);
    if(!req.isAuthenticated())
    {
        req.session.redirectUrl = req.originalUrl;
        console.log(req.session.redirectUrl);
        req.flash("error","You must be logged in");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectURL = (req,res,next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
        console.log(res.locals.redirectUrl);
    }
    next();
}

module.exports.isOwner = async (req,res,next) => {
    let {id} = req.params;
    let cleanId = id.trim();
    let listing = await Listing.findById(cleanId);
    if(!(listing.owner._id.equals(res.locals.currUser._id))){
        req.flash("error","Access Denied");
        return res.redirect(`/listings/${cleanId}`);
    }
    next();
}

module.exports.validateListing = (req,res,next) => {
    let result = validationSchema.listingSchema.validate(req.body);
    if(result.error) {
        throw new ExpressError(400, result.error);
    }
    else {
        next();
    }
};

module.exports.validateReviews = (req,res,next) => {
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

module.exports.isAuthor = async (req,res,next) => {
    let {id,rid} = req.params;
    const cleanId = id.trim();
    const cleanrId = rid.trim();
    const review = await Review.findById(cleanrId);
    if(!(review.author._id.equals(res.locals.currUser._id))) {
        req.flash("error","Access Denied");
        return res.redirect(`/listings/${cleanId}`);
    }
    next();
}