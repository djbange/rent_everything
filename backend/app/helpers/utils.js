
const { OAuth2Client } = require('google-auth-library');
const { logger } = require('./logger');
const { users, customers, renters } = require('../models');
const { GOOGLE_CLIENT_ID, paymentStatus } = require("../config");

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

function isBase64(encoded1) {
    try {
        if (encoded1.length == 0) {
            return false
        }
        var decoded1 = Buffer.from(encoded1, 'base64').toString('utf8');
        var encoded2 = Buffer.from(decoded1, 'binary').toString('base64');
        return encoded1 == encoded2;
    } catch (err) {
        return false
    }
}

async function createCustomer(data, transaction) {
    switch (data.role) {
        case 'Customer':
            return await customers.createCustomer(data, transaction);
        case 'Renter':
            return await renters.createOwner(data, transaction);
        case 'Admin':
            break;
        default:
            logger.error('Error in createCustomer');
            throw "Can not create an account"
    }
}

async function verifyGoogleToken(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    return payload
}

module.exports = {
    isBase64,
    createCustomer,
    verifyGoogleToken,
}