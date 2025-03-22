const express = require("express");
const router = express.Router({});
const Listing = require("../models/listing.js"); //Requiring Listing Model
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const validationSchema = require("../schema.js"); //Joi

//MiddleWare for Server Side Validation for Listings.(As a function)
const validateListing = (req,res,next) => {
    let result = validationSchema.listingSchema.validate(req.body);
    if(result.error) {
        //let errMsg = result.error.details.map((el) => el.message).join(",");
        //throw new ExpressError(400, errMsg);
        throw new ExpressError(400, result.error);
    }
    else {
        next();
    }
};

//Index Route
router.get("/" , wrapAsync(async (req,res,next) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));

//New Route
router.get("/new" , (req,res) => {
    //res.send("Success");
    res.render("listings/new.ejs");
});

//Create Route
router.post("/" , validateListing, wrapAsync(async (req,res,next) => {
    let {title,description,image,price,location,country} = req.body;
    const newData = new Listing ({
        title,
        description,
        image,
        price,
        location,
        country
    });

    await newData.save();
    res.redirect("/listings");
    res.send(req.body);
    })
);

//Show Route
router.get("/:id" , wrapAsync(async (req,res,next) => {
    let {id} = req.params;
    let cleanId = id.trim();
    const listing = await Listing.findById(cleanId).populate("reviews");
    //console.log({listing});
    res.render("listings/show.ejs",{listing});
    //res.send("Success");
}));

//Edit Route
router.get("/:id/edit" , wrapAsync(async (req,res,next) => {
    let {id} = req.params;
    const listing = await Listing.findOne({_id:id});
    res.render("listings/edit.ejs",{listing});
}));

//Update Route
router.patch("/:id" , validateListing , wrapAsync(async (req,res,next) => {
    let {title,description,image,price,location,country} = req.body;
    let {id} = req.params;
    await Listing.findByIdAndUpdate({_id:id} , {
        title:title,
        description:description,
        image:image,
        price:price, 
        location:location,
        country:country
    },{runValidators:true,new:true});
    res.redirect("/listings");
}));

//Delete Route
router.delete("/:id" , wrapAsync(async (req,res,next) => {
    let {id} = req.params;
    const cleanId = id.trim();
    await Listing.findByIdAndDelete(cleanId);
    res.redirect("/listings");
}));

module.exports = router;