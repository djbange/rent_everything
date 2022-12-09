const { validate } = require("jsonschema");
// const { Transaction, Sequelize } = require('sequelize');

// app imports
const { renters, properties } = require("../models");
const { APIError, passport, utils } = require("../helpers");
const { logger } = require("../helpers/logger");
const { roles, dbConn, authMethods } = require("../config");
var { addPropertySchema } = require("../schemas");

async function getRenter(request, response, next) {
    try{
        const body = request.body;
        var data = await renters.getOwner(body.email, body.role);
        if (!data || !data.results ) {
            console.log(data.results);
            return next(
                new APIError(
                409,
                "Incorrect details",
                "Please provide the correct details"
                )
            );
        }
        return response.status(200).json({
              email: data.results.email,
              id: data.results.renterid,
              address: data.results.address,
              pincode: data.results.pincode,
              phoneNumber: data.results.phonenumber
          });
    } catch(err) {
        logger.error("Error occurred: " + err)
        return next(
            new APIError(
            409,
            "Invalid Request",
            validation.errors.map(e => e.stack).join(". ")
            )
        );
    }
};

async function getBookings(request, response, next) {
    try{
        var bearer = request.headers.authorization;
        var token = bearer.split(" ")[1];
        var jwtData = await passport.getJWTDetails(token);
        var data = await renters.getBookings(jwtData.email, jwtData.role);
        if (!data || !data.results ) {
            return next(
                new APIError(
                409,
                "Incorrect details",
                "No bookings found"
                )
            );
        }
        return response.status(200).json({
              data: data.results
          });
    } catch(err) {
        logger.error("Error occurred: " + err)
        return next(
            new APIError(
            409,
            "Invalid Request",
            "Unable to fetch bookings"
            )
        );
    }
}

async function getPastBookings(request, response, next) {
    try{
        
    } catch(err) {
        logger.error("Error occurred: " + err)
        return next(
            new APIError(
            409,
            "Invalid Request",
            "Unable to fetch past bookings"
            )
        );
    }
}

async function addItem(request, response, next) {
    try{
        var transaction = undefined;
        transaction = await dbConn.transaction();
        const {result, metadata} = await properties.addProperty(request.body, transaction);
        if (result) {
            await transaction.commit();
            return response.status(200).json({
                message: "Property added successfully",
                result: result
            });
        } else {
            await transaction.rollback();
            return next(
                new APIError(
                400,
                "Invalid Request",
                "Unable to add property"
                )
            );
        }
    } catch(err) {
        if (transaction) {
            await transaction.rollback();
        }
        logger.error("Error occurred: " + err)
        return next(
            new APIError(
            409,
            "Invalid Request",
            "Unable to add property"
            )
        );
    }
}

async function updateItem(request, response, next) {
    try{
        var transaction = undefined;
        var validateRequest = validate(request.body, addPropertySchema);
        if (!validateRequest.valid) {
            return next(
                new APIError(
                409,
                "Invalid Request",
                validateRequest.errors.map(e => e.stack).join(". ")
                )
            );
        }
        transaction = await dbConn.transaction();
        const {result, metadata} = await properties.updateProperty(request.body, transaction);
        if (result) {
            await transaction.commit();
            return response.status(200).json({
                message: "Property updated successfully",
                result: result
            });
        } else {
            await transaction.rollback();
            return next(
                new APIError(
                400,
                "Invalid Request",
                "Unable to update property"
                )
            );
        }
    } catch(err) {
        if (transaction) {
            await transaction.rollback();
        }
        logger.error("Error occurred: " + err)
        return next(
            new APIError(
            409,
            "Invalid Request",
            "Unable to update property"
            )
        );
    }
}

async function getItem(request, response, next) {
    try{
        var {results, metadata} = await properties.getPropertyId(request.params.id);
        if (results) {
            return response.status(200).json({
                message: "Property fetched successfully",
                result: results
            });
        } else {
            return next(
                new APIError(
                400,
                "Invalid Request",
                "Unable to fetch property"
                )
            );
        }
    } catch(err) {
        logger.error("Error occurred: " + err)
        return next(
            new APIError(
            409,
            "Invalid Request",
            "Unable to fetch property"
            )
        );
    }
}

async function getItems(request, response, next) {
    try{
        var bearer = request.headers.authorization;
        var token = bearer.split(" ")[1];
        var jwtData = await passport.getJWTDetails(token);
        const user = await renters.getOwner(jwtData.email, jwtData.role);
        if (!user) {
            throw new Error("Invalid Token");
        }
        const renter = user.results;
        var {results, metadata} = await properties.getPropertiesByOwner(renter.renterid);
        if (results) {
            return response.status(200).json({
                results: results
            });
        } else {
            return next(
                new APIError(
                400,
                "Invalid Request",
                "Unable to fetch properties"
                )
            );
        }
    } catch(err) {
        logger.error("Error occurred: " + err)
        return next(
            new APIError(
            409,
            "Invalid Request",
            "Unable to fetch properties"
            )
        );
    }
}

module.exports = {
    getRenter,
    getBookings,
    getPastBookings,
    addItem,
    updateItem,
    getItem,
    getItems
};