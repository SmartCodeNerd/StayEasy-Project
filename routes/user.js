const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectURL } = require("../middlewares.js");
const userController = require("../controllers/user.js");

//New Route
router.get("/signup" , userController.new);


//Create Route
router.post("/signup" , userController.create);


//Render Login Form
router.get("/login" , userController.loginForm);

//Login Route
router.post("/login" ,saveRedirectURL,passport.authenticate("local" , { 
        failureRedirect : "/login" , 
        failureFlash : "Invalid Username or Password!",
    }), userController.login);

//Logout User
router.get("/logout" , userController.logout);

module.exports = router;

