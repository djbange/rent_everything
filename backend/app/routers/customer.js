// npm packages
const express = require("express");
const passport = require('passport');

// app imports
const { propertiesHandler , userHandler} = require("../handlers");

// globals
const router = new express.Router();

/* All the Things Route */
router.post("/home", propertiesHandler.getLandingProperties);
router.get("/property", propertiesHandler.getProperty);
router.get("/property_reviews", propertiesHandler.getPropertyReviews);
router.post("/profile", passport.authenticate('jwt',{session: false}), userHandler.getUser);
router.post("/checkout", passport.authenticate('jwt',{session: false}), userHandler.userCheckout);
router.post("/checkout_success", passport.authenticate('jwt',{session: false}), userHandler.userCheckoutSuccess);
router.post("/checkout_cancel", passport.authenticate('jwt',{session: false}), userHandler.userCheckoutFailure);
router.post("/bookings", passport.authenticate('jwt',{session: false}), userHandler.getBookings);
router.post("/write_review", passport.authenticate('jwt',{session: false}), userHandler.writeReview);
router.post("/add_complaint", passport.authenticate('jwt',{session: false}), userHandler.addComplaint);

module.exports = router;