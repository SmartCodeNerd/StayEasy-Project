const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const Listing = require("./models/listing.js"); //Requiring Listing Model
const path = require("path");
const methodOverride = require("method-override"); //Method_Override for patch,put and delete verbs
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./models/review.js");
const validationSchema = require("./schema.js"); //Joi
const listingRouter = require("./routes/listings.js"); //Express Router
const reviewRouter = require("./routes/reviews.js")

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

//Root Route
app.get("/" , async (req,res) => {
    res.send("Home Route");
});

app.use("/listings" , listingRouter);

app.use("/listings/:id/reviews" , reviewRouter);

app.all("*" , (req,res,next) => {
    next(new ExpressError(404,"Page Not Found"));
});

//Custom Error Handler
app.use((err,req,res,next) => {
    //res.send(err.name);
    //res.send("Something Went Wrong!!");
    console.log(err);
    let {statusCode = 500 , message="Something Went Wrong!"} = err;
    res.status(statusCode).render("error.ejs",{statusCode,message});
});

//Listening To API Requests
app.listen(port, () => {
    console.log("Server has Started");
});