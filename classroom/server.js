const express = require("express");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.use(session({
                secret:"secretCode",
                resave:false,
                saveUninitialized:true}));

app.use(flash());
app.set("views engine","ejs");
app.set("views",path.join(__dirname, "/views" ));
    

app.get("/test" , (req,res) => {
    res.send("Test Success");
});

app.get("/reqCount" , (req,res) => {
    if(req.session.count)
        req.session.count++;
    else
        req.session.count = 1;
    res.send(`Session Count:${req.session.count}`);
});

app.get("/register" , (req,res) => {
    let {name = "Anonymous"} = req.query;
    req.session.name = name;
    if(name === "Anonymous")
        req.flash("error","User Not Registered");
    else    
        req.flash("success","User Registered Successfully");
    res.redirect("/hello");
});

app.get("/hello" , (req,res) => {
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    res.render("flash.ejs",{name:req.session.name});
});

app.listen(8080,() => {
    console.log("Server Started");
})