const Listing = require("../models/listing.js"); //Requiring Listing Model
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_ACCESS_TOKEN;
const geocodingClient = mbxGeocoding({accessToken : mapToken});


//Index Route
module.exports.index = async(req,res,next) => {
    let allListings = await Listing.find({});
    console.log(req.user);
    res.render("listings/index.ejs",{allListings});
}

//New Route
module.exports.new = (req,res) => {
    res.render("listings/new.ejs");
};

//Create Route
module.exports.create = async (req,res,next) => {
    const address = `${req.body.location},${req.body.country}`;
    let response = await geocodingClient.forwardGeocode({
        query:address,
        limit:1,
    })
    .send();
    const url = req.file.path;
    const filename = req.file.filename;
    //console.log(url + "  " + filename);
    let {title,description,image,price,location,country} = req.body;
    const newData = new Listing ({
        title,
        description,
        image,
        price,
        location,
        country,
    });
    newData.owner = req.user._id; //Storing the user id as owner's id
    newData.image = {url,filename};//Storing the url and filename of the image as recieved from Cloudinary
    newData.geometry = response.body.features[0].geometry; //Storing the coordinates of the location into the DB
    let savedListing = await newData.save();
    console.log(savedListing);
    req.flash("success","New Listing Added Successfully");
    res.redirect("/listings");
};

//Show Route
module.exports.show = async (req,res,next) => {
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

    //console.log({listing});
    if(!listing) {
        req.flash("error","Invalid Listing");
        res.redirect("/listings");
    }
    //console.log(listing);
    res.render("listings/show.ejs",{listing});
};


//Edit Route
module.exports.edit = async (req,res,next) => {
    let {id} = req.params;
    let cleanId = id.trim();
    const listing = await Listing.findById(cleanId);
    if(!listing) {
        req.flash("error","Invalid Listing");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing}); 
};


//Update Route
module.exports.update = async (req,res,next) => {
    console.log(req.file);
    // console.log(req.body);
    let {title,description,image,price,location,country} = req.body;
    let {id} = req.params;
    let cleanId = id.trim();
    let editListing = await Listing.findByIdAndUpdate(cleanId , {
        title:title,
        description:description,
        price:price, 
        location:location,
        country:country
    },{runValidators:true,new:true});
    if(req.file !== undefined) {
        const url = req.file.path;
        const filename = req.file.filename;
        editListing.image = {url,filename};
        await editListing.save();
    }
    req.flash("success","Listing Updated Successfully");
    res.redirect(`/listings/${cleanId}`);
    //res.redirect("/listings");
};

//Delete Route
module.exports.destroy = async (req,res,next) => {
    let {id} = req.params;
    const cleanId = id.trim();
    await Listing.findByIdAndDelete(cleanId);
    req.flash("success","Listing Deleted Successfully");
    res.redirect("/listings");
};