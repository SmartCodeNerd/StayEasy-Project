const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectURL } = require("../middlewares.js");

//New Route
router.get("/signup" , (req,res) => {
    res.render("users/signup.ejs");
});


//Create Route
router.post("/signup" , async(req,res) => {
    try{
        const {username,email,password} = req.body;
        const newUser = new User({
            email,
            username,
        });
        const registeredUser = await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err) => {
            if(err)
            return next(err);
            else
            {
                req.flash("success","User Registered Successfully");
                res.redirect("/listings");
            }
        })}
    catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
});


//Render Login Form
router.get("/login" , (req,res) => {
    res.render("users/login.ejs");
});

//Login Route
router.post("/login" ,saveRedirectURL,passport.authenticate("local" , { 
        failureRedirect : "/login" , 
        failureFlash : "Invalid Username or Password!",
    }),
    async(req,res) => {
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
});

//Logout User
router.get("/logout" , (req,res) => {
    req.logout((err) => {
        if(err)
        {
            return next(err);
        }
        req.flash("success","Logged Out Successfully");
        return res.redirect("/listings");
    });
});

module.exports = router;

