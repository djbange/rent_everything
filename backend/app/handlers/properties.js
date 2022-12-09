const { validate } = require("jsonschema");
const url = require("url");
// const { Transaction, Sequelize } = require('sequelize');

// app imports
const { users, properties } = require("../models");
const { APIError, passport, utils, propertyQueryBuilder } = require("../helpers");
var { homeSchema } = require("../schemas");
const { logger } = require("../helpers/logger");

async function getProperty(request, response, next) {
    const queryParams = url.parse(request.url, true).query;
    if (!queryParams.productid) {
        return next(
        new APIError(
            400,
            "Bad Request",
            "No product id in the query_prams"
        )
        );
    }
    try {
        var query = await propertyQueryBuilder.getPropertyQuery(queryParams.productid);
        if (query) {
            var data = await properties.getProperties(query);
            if (data && data.results) {
                return response.status(200).json({ 'data': data.results });
            }
        }
        return next(
            new APIError(
                400,
                "Bad request",
                "Please provide the correct details"
            )
        );
    } catch (err) {
        logger.error("Error occurred: " + err)
        return next(
            new APIError(
            400,
            "Bad request",
            "Internal server Error"
            )
        );
    }
}

async function getPropertyReviews(request, response, next) {
    const queryParams = url.parse(request.url, true).query;
    if (!queryParams.productid) {
        return next(
        new APIError(
            400,
            "Bad Request",
            "No product id in the query_params"
        )
        );
    }
    try {
        var query = await propertyQueryBuilder.getPropertyReview(queryParams.productid);
        if (query) {
            var data = await properties.getProperties(query);
            if (data && data.results) {
                return response.status(200).json({ 'data': data.results });
            }
        }
        return next(
            new APIError(
                400,
                "Bad request",
                "Please provide the correct details"
            )
        );
    } catch (err) {
        logger.error("Error occurred: " + err)
        return next(
            new APIError(
            400,
            "Bad request",
            "Internal server Error"
            )
        );
    }
}

async function getLandingProperties(request, response, next) {
    const validation = validate(request.body, homeSchema);
    if (!validation.valid) {
        return next(
        new APIError(
            400,
            "Bad Request",
            validation.errors.map(e => e.stack).join(". ")
        )
        );
    }
    try {
        var query = await propertyQueryBuilder.getPropertiesDist(request.body);
        if (query) {
            var data = await properties.getProperties(query);
            if (data && data.results) {
                return response.status(200).json({ 'data': data.results });
            }
        }
        return next(
            new APIError(
                400,
                "Bad request",
                "Please provide the correct details"
            )
        );
    } catch (err) {
        logger.error("Error occurred: " + err)
        return next(
            new APIError(
            400,
            "Bad request",
            "Internal server Error"
            )
        );
    }
};

module.exports = {
    getLandingProperties,
    getProperty,
    getPropertyReviews
};