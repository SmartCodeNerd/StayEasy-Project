//Phase 1(Part A)

//L-1
//Required Packages such as express and ,mongoose.
//Started a Connection between Node and MongoDB
//Created Basic app.listen and app.get routes
//Created .gitignore and included node_modules and package-lock.json

//L-2
//Created Listing model for DB(Will Contain details about every location)
//Created it's Schema and Model
//module.exports it to the main file i.e.,app.js;
//Inserted a Sample Data into the DB

//L-3
//Created a init folder for Dataabase initialisation
//Created a data.js file in it containing the sample data and exporting it - module.exports {data:sampleListings}
//Created a index.js file 
    //Required all mongoose packages and started a connection
    //Initialised the DB

//L-4
//Created index route that displays all the title of the listings
//Each listing is in an anchor tag that will point to a show route to show that entire listing

//L-5
//Created a Show Route that will display every details for a listing

//L-6
//Created a New Route by adding a Add New button.
//It renders a form to add details.
//Form will send a Post request and the form data will be saved in the database.

//L-7
//Created Edit and Update Routes
//Edit Route renders a form 
//After Submitted through Update route it will be POSTed on the DB

//L8
//Created a delete route to delete that listing from the DB

//Phase 1(Part B) [Styling Part]

//L-1
//Installed ejs-mate used to structure and organise ejs templates
//Created a Public directory to serve static files

//L-2
//Created Navbar
//Included Bootstrap
//Modified the Navbar
//Attached request routes with the anchor tags

//L-3
//Added Footer and some basic CSS styling

//L-4
//Add Styling to the index.ejs page.

//L-5
//Added Styling to the Add New Listing Page

//Phase 1(Part C) [Form Validation]
//L-1
//Added Form Validation Styling using Bootstrap Classes using the needs-validation class.

//L-2
//Added Success and Failure Text to the input fields
//Using Classes valid-feedback and invalid-feedback inside each individual divs.

//L-3


//Phase 2(Part E)

//L-3
//Added a dropdown menu for signup,login, and logout for the user
//Also using res.locals and req.user, added a functionality that if the user is logged in then show logout option else show sign in and login options.

//L-4
//To establish a flow that after signup the user should automatically be logged in, we used a MW req.login() that automatically //assigns req.user with the curr user in the session after signup.

//L-5
//Created the flow in which if the user is not logged in and tries to access to add new listing or edit listing then after login he will be redirected to the same page only s.t. to make the user journey smooth.

//L-6

 





