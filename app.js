const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { wrap } = require("module");


app.set("views engine","ejs");
app.set("views",path.join(__dirname, "/views" ));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs" , ejsMate);
app.use(express.static(path.join(__dirname , "public/CSS")));
app.use(express.static(path.join(__dirname , "public/JS")));



async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/stayeasy");
};

main()
.then(() => {
    console.log("Connected to DataBase");
})
.catch((err) => {
    console.log(err);
});

//Test Route(Root)
app.get("/" , async (req,res) => {
    res.send("Home Route");
});

//Index Route
app.get("/listings" , wrapAsync(async (req,res,next) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));


//New Route
app.get("/listings/new" , (req,res) => {
    //res.send("Success");
    res.render("listings/new.ejs");
});

//Create Route
app.post("/listings" , wrapAsync(async (req,res,next) => {

    if(!(Object.keys(req.body).length >= 5)) {
        next(new ExpressError(400,"Bad Request"));
    }

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
    // res.send(req.body);
    })
);


//Show Route
app.get("/listings/:id" , wrapAsync(async (req,res,next) => {
    let {id} = req.params;
    //console.log({id});
    const listing = await Listing.findOne({_id:id});
    //console.log({listing});
    res.render("listings/show.ejs",{listing});
    //res.send("Success");
}));

//Edit Route
app.get("/listings/:id/edit" , wrapAsync(async (req,res,next) => {
    let {id} = req.params;
    const listing = await Listing.findOne({_id:id});
    res.render("listings/edit.ejs",{listing});
}));

//Update Route
app.patch("/listings/:id" , wrapAsync(async (req,res,next) => {

    if(!(Object.keys(req.body).length >= 5)) {
        next(new ExpressError(400,"Bad Request"));
    }

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
app.delete("/listings/:id" , wrapAsync(async (req,res,next) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete({_id:id});
    res.redirect("/listings");
}));

app.all("*" , (req,res,next) => {
    next(new ExpressError(404,"Page Not Found"));
});



//Custom Error Handler
app.use((err,req,res,next) => {
    //res.send(err.name);
    //res.send("Something Went Wrong!!");
    let {statusCode = 500 , message="Something Went Wrong!"} = err;
    let msg = err.name;
    res.status(statusCode).render("error.ejs",{statusCode,msg});
});


//Listening To API Requests
app.listen(port, () => {
    console.log("Server has Started");
});