// npm packages
const { QueryTypes } = require('sequelize');

// app imports
const { APIError } = require("../helpers");
const { dbConn } = require("../config");
const { logger } = require("../helpers/logger");

async function addBooking(data, transaction) {
    const query = `INSERT INTO Customer_OrderHistory (ProductId, UserId, startDate, endDate, PaypalPaymentId, PaypalToken, AmountPaid, Status, LastUpdated)
                    VALUES ('${data.productId}', '${data.userId}', '${data.startDate}', '${data.endDate}',
                    '${data.paypalPaymentId}', '${data.token}', ${data.amountsPaid}, '${data.status}', current_timestamp) RETURNING *;`;
    const [results, metadata] = await dbConn.query(query, {
        replacements: [null],
        transaction: transaction,
        type: QueryTypes.INSERT
    });
    return { results, metadata };
}

async function getBookings(where) {
    const query = `SELECT cust.productid, cust.startdate, cust.enddate, cust.amountpaid, cust.status,
    p.defaultImagelink, p.productspecification FROM (select * from Customer_OrderHistory WHERE ${where}) cust
    left join property p on cust.productid = p.productid;
    `;
    const [results, metadata] = await dbConn.query(query, {
        replacements: [null],
        // type: QueryTypes.SELECT
    });
    return { results, metadata };
}

async function updateBooking(where, updateData, transaction) {
    const query = `UPDATE Customer_OrderHistory SET ${updateData} WHERE ${where} returning *;`;
    const [results, metadata] = await dbConn.query(query, {
        replacements: [null],
        type: QueryTypes.UPDATE,
        transaction: transaction
    });
    return { results, metadata };
}

module.exports = {
    addBooking,
    getBookings,
    updateBooking,
};