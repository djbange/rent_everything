//
const { APIError } = require("./APIError");
const passport = require('passport');

const checkUserMiddleware = (role) => {
    return (req, res, next) => {
        if (req._user && req._user.email == req.userId) {
            next();
        }
        return next(
            new APIError(
                401,
                "Unauthorized request",
                "Please try with correct credentials"
            )
        );
    };
};


module.exports = {
    checkUserMiddleware
}