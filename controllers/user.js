const User = require("../models/user.js")

//New Route
module.exports.new = (req,res) => {
    res.render("users/signup.ejs");
};


//Create User Route
module.exports.create = async(req,res) => {
    try{
        const {username,email,password} = req.body;
        const newUser = new User({
            email,
            username,
        });
        const registeredUser = await User.register(newUser,password);
        console.log(registeredUser);
        //User is Logged in here.
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
};


//Render Login Form
module.exports.loginForm = (req,res) => {
    res.render("users/login.ejs");
};

//Post-Login Route
module.exports.login = async(req,res) => {
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

//Logout Route
module.exports.logout = (req,res) => {
    req.logout((err) => {
        if(err)
        {
            return next(err);
        }
        req.flash("success","Logged Out Successfully");
        return res.redirect("/listings");
    });
};