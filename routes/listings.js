const express = require("express");
const router = express.Router({});
const Listing = require("../models/listing.js"); //Requiring Listing Model
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn,isOwner,validateListing} = require("../middlewares.js");

//Index Route
router.get("/" , wrapAsync(async (req,res,next) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));

//New Route
router.get("/new" , isLoggedIn , (req,res) => {
    res.render("listings/new.ejs");
});

//Create Route
router.post("/" , isLoggedIn , validateListing, wrapAsync(async (req,res,next) => {
    let {title,description,image,price,location,country} = req.body;
    const newData = new Listing ({
        title,
        description,
        image,
        price,
        location,
        country
    });
    newData.owner = req.user._id;
    await newData.save();
    req.flash("success","New Listing Added Successfully");
    res.redirect("/listings");
    }) 
);

//Show Route
router.get("/:id" , wrapAsync(async (req,res,next) => {
    let {id} = req.params;
    let cleanId = id.trim();

    const listing = await Listing.findById(cleanId)
    .populate({
        path:"reviews",
        populate:{
            path:"author"
        },
        })
    .populate({
        path:"owner"
    });

    console.log({listing});
    if(!listing) {
        req.flash("error","Invalid Listing");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
}));

//Edit Route
router.get("/:id/edit" , isOwner , wrapAsync(async (req,res,next) => {
    let {id} = req.params;
    let cleanId = id.trim();
    const listing = await Listing.findOne(cleanId);
    if(!listing) {
        req.flash("error","Invalid Listing");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing}); 
}));

//Update Route
router.patch("/:id" , isOwner , validateListing , wrapAsync(async (req,res,next) => {
    let {title,description,image,price,location,country} = req.body;
    let {id} = req.params;
    let cleanId = id.trim();
    await Listing.findByIdAndUpdate(cleanId , {
        title:title,
        description:description,
        image:image,
        price:price, 
        location:location,
        country:country
    },{runValidators:true,new:true});
    req.flash("success","Listing Updated Successfully");
    res.redirect(`/listings/${cleanId}`);
}));

//Delete Route
router.delete("/:id" , isLoggedIn , isOwner , wrapAsync(async (req,res,next) => {
    let {id} = req.params;
    const cleanId = id.trim();
    await Listing.findByIdAndDelete(cleanId);
    req.flash("success","Listing Deleted Successfully");
    res.redirect("/listings");
}));

module.exports = router;