// const paypal = require("paypal-rest-sdk");
const { logger } = require("./logger");
const { promisify } = require('util');

// imports
const { users } = require('../models');
const { paypal } = require('../config');
// const { PAYPAL_CLIENT_ID, PAYPAL_SECRET_ID} = process.env
// paypal.configure({
//     'mode': 'sandbox', //sandbox or live
//     'client_id': PAYPAL_CLIENT_ID,
//     'client_secret': PAYPAL_SECRET_ID
//   });

async function createMerchantAccount(email, renterId) {
    const create_request_json = {
        "email": email,
        "preferred_language_code": "en-US",
        "tracking_id": renterId,
        "legal_consents": [
            {
                "type": "SHARE_DATA_CONSENT",
                "granted": true
            }
        ],
        "products": [
            "EXPRESS_CHECKOUT"
        ]
    };
    await paypal.merchant.create(create_request_json, function (error, response) {
        if (error) {
            logger.error(error);
            throw error;
        } else {
            logger.info("Create Merchant Account Response");
            return response;
        }
    });
}

function createPayment(merchant_email, amount, currency, item_name, item_id, redirectUrl) {
    const create_payment_json = {
        intent: 'SALE',
        payer: {
            "payment_method": "paypal"
        },
        redirect_urls: {
            "return_url": `${redirectUrl}/success`,
            "cancel_url": `${redirectUrl}/cancel`
        },
        transactions: [{
            "item_list": {
                "items": [{
                    "name": item_name,
                    "sku": item_id,
                    "price": amount,
                    "currency": currency,
                    "quantity": 1
                }]
            },
            amount: {
                "currency": currency,
                "total": amount
            },
            payee: {
                email: merchant_email
            },
            description: `Pay for the '${item_name}' and contact the owner for further details.`
        }]
    };
    return new Promise(function(resolve,reject){
            paypal.payment.create(create_payment_json, function (error, payment) {
                if (error) {
                    logger.info(error);
                    reject(error);
                } else {
                    logger.info("Created Payment Response");
                    resolve(payment);
                }
            })
    });
}

async function executePayment(paymentId, payerId) {

    return new Promise(function(resolve,reject){
        const execute_json = {
                payer_id: payerId
            }
        paypal.payment.execute(paymentId, execute_json, function (error, payment) {
            if (error) {
                logger.info(error);
                reject(error);
            } else {
                logger.info("Executed Payment Response");
                resolve(payment);
            }
        })
    });
}

async function refundPayment(paymentId, amount, currency) { 
    const refund_request_json = {
        "amount": {
            "currency_code": currency,
            "value": amount
        }
    };
    await paypal.payment.refund(paymentId, refund_request_json, function (error, refund) {
        if (error) {
            logger.error(error);
            throw error;
        } else {
            logger.info("Refund Payment Response");
            return {data: refund};
        }
    });
}

module.exports = {
    createMerchantAccount,
    createPayment,
    refundPayment,
    executePayment
}