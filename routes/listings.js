const express = require("express");
const router = express.Router({});
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn,isOwner,validateListing} = require("../middlewares.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const { validate } = require("../models/review.js");
const upload = multer({storage});

//Index Route
router.get("/" , wrapAsync(listingController.index));

//New Route
router.get("/new" , isLoggedIn , listingController.new);

//Create Route
router.post("/" , isLoggedIn , upload.single("image") , validateListing ,  wrapAsync(listingController.create));
// router.post("/" , upload.single("image") , (req,res) => {
//     res.send(req.file);
// });

//Show Route
router.get("/:id" , wrapAsync(listingController.show));

//Edit Route
router.get("/:id/edit" , isOwner , wrapAsync(listingController.edit));

//Update Route
router.patch("/:id" , isOwner , upload.single("image") , validateListing , wrapAsync(listingController.update));

//Delete Route
router.delete("/:id" , isLoggedIn , isOwner , wrapAsync(listingController.destroy));

module.exports = router;