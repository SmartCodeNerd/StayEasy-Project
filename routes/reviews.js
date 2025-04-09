const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,validateReviews,isAuthor} = require("../middlewares.js");
const reviewController = require("../controllers/review.js");

//Post Review Route
router.post("/" , isLoggedIn , validateReviews , wrapAsync(reviewController.post));

//Delete Review Route
router.delete("/:rid" , isLoggedIn , isAuthor , wrapAsync(reviewController.destroy));

module.exports = router;
