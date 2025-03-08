const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");



app.set("views enngine","ejs");
app.set("views",path.join(__dirname, "/views" ));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/stayeasy");
}

main()
.then(() => {
    console.log("Connected to DataBase");
})
.catch((err) => {
    console.log(err);
})

//Test Route(Root)
app.get("/" , async (req,res) => {
    res.send("Success");
})

//Index Route
app.get("/listings" , async (req,res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
})


//New Route
app.get("/listings/new" , (req,res) => {
    //res.send("Success");
    res.render("listings/new.ejs");
})

//Create Route
app.post("/listings" , async (req,res) => {
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
})


//Show Route
app.get("/listings/:id" , async (req,res) => {
    let {id} = req.params;
    //console.log({id});
    const listing = await Listing.findOne({_id:id});
    //console.log({listing});
    res.render("listings/show.ejs",{listing});
    //res.send("Success");
})

//Edit Route
app.get("/listings/:id/edit" , async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findOne({_id:id});
    res.render("listings/edit.ejs",{listing});
})

//Update Route
app.patch("/listings/:id" , async (req,res) => {
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
})

//Delete Route
app.delete("/listings/:id" , async (req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete({_id:id});
    res.redirect("/listings");
})

app.listen(port, () => {
    console.log("Server has Started");
})