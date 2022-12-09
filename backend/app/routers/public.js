// npm packages
const express = require("express");

// app imports
const { thingHandler } = require("../handlers");

// globals
const router = new express.Router();

/* All the Things Route */
router.route("/home", thingHandler);

module.exports = router;