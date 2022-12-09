//npm packages
const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

// imports
const { users } = require('../models');
const secretKey = 'rent_everything_secret_key_%$#%^^&&&&#$@!#!#'
const divideKey = '__(re$98)__'

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: secretKey
},
    async function (jwt, done) {
        var emailRole = jwt.sub.split(divideKey);
        return await users.getUser(emailRole[0], emailRole[1])
            .then(user => {
                if (user.results) {
                    return done(null, user.results);
                } else {
                    return done("Invalid token");
                }
            }
            ).catch(err => {
                return done(err);
            });
    }
));

async function getJWTDetails(token) {
    var decodeToken = await jwt.decode(token);
    var emailRole = await decodeToken.sub.split(divideKey);
    return {email: emailRole[0], role: emailRole[1]};
}

async function getToken(user) {
    return await jwt.sign({
        iss: 'rent_everything',
        sub: `${user.email}${divideKey}${user.role}`,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1)
    }, secretKey);
}

module.exports = {
    getToken,
    passport,
    getJWTDetails
}