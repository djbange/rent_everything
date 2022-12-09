// npm packages
const express = require("express");
const passport = require('passport');

// app imports
const { renterHandler, propertiesHandler } = require("../handlers");

// globals
const router = new express.Router();

const jwtGuard = passport.authenticate('jwt',{session: false});
/* All the Things Route */
router.get("/profile", jwtGuard, renterHandler.getRenter);
router.get("/bookings", jwtGuard, renterHandler.getBookings);
router.get("/past_bookings", jwtGuard, renterHandler.getPastBookings);
router.get("/item", jwtGuard, renterHandler.getItem);
router.get("/items", jwtGuard, renterHandler.getItems);
router.post("/item", jwtGuard, renterHandler.addItem);
router.put("/item", jwtGuard, renterHandler.updateItem);

module.exports = router;