const { validate } = require("jsonschema");
const path = require('path');
// const { Transaction, Sequelize } = require('sequelize');

// app imports
const { users, properties, bookings} = require("../models");
const { APIError, passport, utils, otpGenerator, email, paypal } = require("../helpers");
var { loginSchema, logoutSchema, accountNewSchema } = require("../schemas");
const { logger } = require("../helpers/logger");
const { roles, dbConn, authMethods, paymentStatus } = require("../config");

async function getComplaints(request, response, next) {
    try {
        const result = await properties.getComplaints();
        if (result.results) {
        return response.status(200).json({data: result.results});
        } else {
        return next(new APIError(404, "No complaints found"));
        }
    } catch (error) {
        return next(new APIError(500, "Internal Server Error", error.message));
    }
}

async function getResolvedComplaints(request, response, next) {
    try {
        const result = await properties.getResolvedComplaints();
        if (result.results) {
        return response.status(200).json({data: result.results});
        } else {
        return next(new APIError(404, "No complaints found"));
        }
    } catch (error) {
        return next(new APIError(500, "Internal Server Error", error.message));
    }
}

async function updateComplaint(request, response, next) {
    try {
        const result = await properties.updateComplaint(request.body);
        if (result.results) {
        return response.status(200).json({data: result.results});
        } else {
        return next(new APIError(404, "Some error occurred", "No complaints found"));
        }
    } catch (error) {
        return next(new APIError(500, "Internal Server Error", error.message));
    }
}

async function initiateRefund(request, response, next) {
    try {
        const booking = await bookings.getBookings(`propertyid = '${request.body.propertyid}' and status = '${paymentStatus.BOOKED}'`);
        const result = await paypal.refundPayment(request.body);
        if (result.data) {
            return response.status(200).json({status: "success"});
        } else {
        return next(new APIError(404, "Some error occurred", "No complaints found"));
        }
    } catch (error) {
        return next(new APIError(500, "Internal Server Error", error.message));
    }
}

module.exports = {
    getComplaints,
    getResolvedComplaints,
    updateComplaint,
    initiateRefund
};