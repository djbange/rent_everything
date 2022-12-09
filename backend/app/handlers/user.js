const { validate } = require("jsonschema");
const URL = require('url');
// const { Transaction, Sequelize } = require('sequelize');

// app imports
const { users, renters, properties, bookings } = require("../models");
const { APIError, passport, utils, paypal, propertyQueryBuilder } = require("../helpers");
const { logger } = require("../helpers/logger");
const { roles, dbConn, authMethods, paymentStatus, HOST_URL } = require("../config");

async function getUser(request, response, next) {
    try {
        const body = request.body;
        var data = undefined;
        switch (body.role) {
            case 'Customer':
                data = await users.getUser(body.email, body.role);
                break;
            case 'Renter':
                data = await renters.getOwner(body.email, body.role);
                break;
            default:
                return next(
                    new APIError(
                        409,
                        "Incorrect details",
                        "Please provide the correct details"
                    )
                );
        }
        if (data && data.results) {
            return response.status(200).json({ user: data.results[0] });
        }
        return next(
            new APIError(
                409,
                "Incorrect details",
                "Please provide the correct details"
            )
        );
    } catch (err) {
        logger.error("Error occurred: " + err)
        return next(
            new APIError(
                409,
                "Incorrect username or password",
                validation.errors.map(e => e.stack).join(". ")
            )
        );
    }

};

async function userCheckout(request, response, next) {
    try {
        const body = request.body;
        const user = await users.getUser(body.email, body.role);
        if (user && user.results) {
            var query = await propertyQueryBuilder.getPropertyQuery(body.product_id);
            if (query) {
                var data = await properties.getProperties(query);
                if (!data || !data.results) {
                    throw "Invalid product details";
                }
            }
            const bookingQuery = `productid='${body.product_id}'
                                    and (status='${paymentStatus.BOOKED}'
                                        or status='${paymentStatus.COMPLETED} '
                                        or status='${paymentStatus.REFUNDED}'
                                        )
                                    and (
                                        ('${body.startDate}' between startDate and endDate)
                                        or ('${body.endDate}' between startDate and endDate)
                                        )`;
            const isBookingAvailable = await bookings.getBookings(bookingQuery);
            if (isBookingAvailable && isBookingAvailable.results && isBookingAvailable.results.length > 0) {
                throw "Property is not available for selected dates";
            }
            const property = data.results[0];
            let nights = new Date(body.endDate).getTime() - new Date(body.startDate).getTime();
            nights /= 1000 * 3600 * 24;
            const payment = await paypal.createPayment(property.renter_email, property.amount * nights, 
                        'USD', property.productspecification, body.product_id, HOST_URL);
            if (payment) {
                const links = payment.links;
                var checkoutUrl = undefined;
                for (let i = 0; i < links.length; i++) {
                    if (links[i].rel === 'approval_url') {
                        checkoutUrl = links[i].href
                    }
                }
                if (!checkoutUrl) {
                    throw "Invalid payment details";
                }
                var token = URL.parse(checkoutUrl, true).query.token;
                const transaction = await dbConn.transaction();
                const booking = await bookings.addBooking({
                        status: paymentStatus.CREATED, startDate: body.startDate, endDate: body.endDate,
                        productId: property.productid, userId: user.results.userid,
                        paypalPaymentId: payment.id, amountsPaid: payment.transactions[0].amount.total, token: token
                    }, transaction);
                if (booking && booking.results) {
                    await transaction.commit();
                    return response.status(200).json({ url: checkoutUrl });
                } else {
                    transaction.rollback();
                }
            }
        }
        return next(
            new APIError(
                400,
                "Incorrect details",
                "Please provide the correct details"
            )
        );
    } catch (err) {
        logger.error("Error occurred: " + err)
        return next(
            new APIError(
                400,
                "Internal server error",
                err
            )
        );
    }
}

async function userCheckoutSuccess(request, response, next) {
    try {
        const body = request.body;
        const user = await users.getUser(body.email, body.role);
        if (user && user.results) {
            const payment = await paypal.executePayment(body.paymentId, body.payerID);
            if (payment) {
                const paymentId = payment.id;
                const transaction = await dbConn.transaction();
                // update booking
                const bookingUpdate = await bookings.updateBooking(`PaypalPaymentId='${paymentId}'`,
                                                                `status= '${paymentStatus.BOOKED}'`, transaction);
                if (bookingUpdate && bookingUpdate.results) {
                    transaction.commit();
                    return response.status(200).json({ message: "Booking successful" });
                }
            }
        }
        return next(
            new APIError(
                400,
                "Incorrect details",
                "Please provide the correct details"
            )
        );
    } catch (err) {
        logger.error("Error occurred: " + err)
        return next(
            new APIError(
                400,
                "Internal server error",
                err
            )
        );
    }
}

async function userCheckoutFailure(request, response, next) {
    try {
        const body = request.body;
        const user = await users.getUser(body.email, body.role);
        if (user && user.results) {
            const transaction = await dbConn.transaction();
            const bookingUpdate = await bookings.updateBooking(`paypalToken='${body.token}'`,
                                                             `status= '${paymentStatus.FAILED}'`, transaction);
            if (bookingUpdate && bookingUpdate.results) {
                transaction.commit();
                return response.status(200).json({ message: "Updated Booking status" });
            }
        }
        return next(
            new APIError(
                400,
                "Incorrect details",
                "Please provide the correct details"
            )
        );
    } catch (err) {
        logger.error("Error occurred: " + err)
        return next(
            new APIError(
                400,
                "Internal server error",
                err
            )
        );
    }
}

async function getBookings(request, response, next) {
    try {
        const body = request.body;
        const user = await users.getUser(body.email, body.role);
        if (user && user.results) {
            const data = await bookings.getBookings(`userId='${user.results.userid}' and (status='${paymentStatus.BOOKED}' or status='${paymentStatus.COMPLETED}' or status='${paymentStatus.REFUNDED}')`);
            if (data && data.results) {
                return response.status(200).json({ data: data.results });
            }
        }
        return next(
            new APIError(
                400,
                "Incorrect details",
                "Please provide the correct details"
            )
        );
    } catch (err) {
        logger.error("Error occurred: " + err)
        return next(
            new APIError(
                400,
                "Internal server error",
                err
            )
        );
    }
}

async function writeReview(request, response, next) {
    try {
        const body = request.body;
        const user = await users.getCustomer(body.email, body.role);
        if (user && user.results) {
            const review = await properties.addReview({
                    userId: user.results.customerid, productId: body.product_id,
                    content: body.content, rating: body.rating
                });
            if (review && review.results) {
                return response.status(200).json({ message: "Review added successfully" });
            }
        }
        return next(
            new APIError(
                400,
                "Incorrect details",
                "Please provide the correct details"
            )
        );
    } catch (err) {
        logger.error("Error occurred: " + err)
        return next(
            new APIError(
                400,
                "Internal server error",
                err
            )
        );
    }
}

async function addComplaint(request, response, next) {
    try {
        const body = request.body;
        const user = await users.getCustomer(body.email, body.role);
        if (user && user.results) {
            const complaint = await properties.addComplaint({
                    userId: user.results.userid, productId: body.product_id,
                    content: body.content, status: paymentStatus.CREATED,
            });
            if (complaint && complaint.results) {
                return response.status(200).json({ message: "Complaint added successfully" });
            }
        }
    } catch (err) {
        logger.error("Error occurred: " + err)
        return next(
            new APIError(
                400,
                "Internal server error",
                err
            )  
        );
    }
}


module.exports = {
    getUser,
    userCheckout,
    userCheckoutSuccess,
    userCheckoutFailure,
    getBookings,
    writeReview,
    addComplaint
};