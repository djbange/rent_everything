// npm packages
const express = require("express");
const passport = require('passport');

// app imports
const { adminHandler } = require("../handlers");

// globals
const router = new express.Router();
const jwtGuard = passport.authenticate('jwt',{session: false});
/* All the Things Route */
router.get("/complaints",jwtGuard, adminHandler.getComplaints);
router.get("/resolved_complaints",jwtGuard, adminHandler.getResolvedComplaints);
router.post("/complaint",jwtGuard, adminHandler.updateComplaint);
router.post("/initiate_refund",jwtGuard, adminHandler.initiateRefund);

module.exports = router;