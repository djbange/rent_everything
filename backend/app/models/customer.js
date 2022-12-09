// npm packages
const { QueryTypes } = require('sequelize');

// app imports
const { APIError } = require("../helpers");
const { dbConn } = require("../config");
const { logger } = require("../helpers/logger");

async function getCustomer(userId) {
    const [results, metadata] = await dbConn.query(
        'SELECT * FROM customer_profile WHERE userId = :userId',
        {
            replacements: { userId: userId },
            type: QueryTypes.SELECT
        }
    )
    return { results, metadata }
}

async function getCustomerById(id) {
    const [results, metadata] = await dbConn.query(
        'SELECT * FROM customer_profile WHERE customerId = :id',
        {
            replacements: { id: id },
            type: QueryTypes.SELECT
        }
    )
    return { results, metadata }
}

async function createCustomer(data, transaction) {
    const [results, metadata] = await dbConn.query(
        "INSERT INTO Customer_Profile (UserID, Name, Dob, Address, PinCode, PhoneNumber) VALUES \
            (:userID, :name, :dob, :address, :pincode, :phoneNumber) \
            RETURNING *;",
        {
            replacements: {
                userID: data.userId, name: data.name, dob: data.dob,
                address: data.address, pincode: data.pincode, phoneNumber: data.phone_number
            },
            type: QueryTypes.INSERT,
            transaction: transaction
        }
    )
    return { results, metadata }
}

module.exports = {
    getCustomer,
    getCustomerById,
    createCustomer
}