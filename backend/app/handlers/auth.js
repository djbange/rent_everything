const fs = require('fs');

const { validate } = require("jsonschema");
const path = require('path');
// const { Transaction, Sequelize } = require('sequelize');

// app imports
const { users } = require("../models");
const { APIError, passport, utils, otpGenerator, email } = require("../helpers");
var { loginSchema, logoutSchema, accountNewSchema } = require("../schemas");
const { logger } = require("../helpers/logger");
const { roles, dbConn, authMethods } = require("../config");

async function login(request, response, next) {
  loginSchema.properties.role.enum = roles;
  loginSchema.properties.source.enum = authMethods;
  const validation = validate(request.body, loginSchema);
  if (!validation.valid) {
    return next(
      new APIError(
        400,
        "Bad Request",
        validation.errors.map(e => e.stack).join(". ")
      )
    );
  }
  var user = undefined;
  try {
    const body = request.body;
    var loginVerified = false;
    if (request.body.source == authMethods[0]) {
      const result = await users.getUser(body.email, body.role);
      if (!result.results) {
        return next(
          new APIError(
            409,
            "Incorrect username or password",
            validation.errors.map(e => e.stack).join(". ")
          )
        );
      }
      user = result.results;
      const passwordValidation = await utils.isBase64(body.password);
      if (passwordValidation && user.password == body.password) {
        loginVerified = true;
      }
    } else if (request.body.source == authMethods[1]) {
      var payload = await utils.verifyGoogleToken(body.password);
      if (payload.email_verified == true) {
        const result = await users.getUser(payload.email, body.role);
        if (!result.results) {
          return next(
            new APIError(
              409,
              "Incorrect username or password",
              validation.errors.map(e => e.stack).join(". ")
            )
          );
        }
        user = result.results;
        loginVerified = true;
        body.email = payload.email;
      }
    }

  if (loginVerified) {
    const token = await passport.getToken({ email: body.email, role: body.role });
    return response.status(201).json({ token: token, user: { 'email': user.email, role: user.logintype, id: user.userid  } });
  } else {
    return next(
      new APIError(
        409,
        "Bad Request",
        "Incorrect username or password"
      )
    );
  }

  // verify with google
  // store token in db - JWT??
  // return token
} catch (err) {
  logger.error("Error occurred: " + err)
  return next(
    new APIError(
      409,
      "Bad Request",
      "Incorrect username or password"
    )
  );
}
}

async function logout(request, response, next) {
  const validation = validate(request.body, logoutSchema);
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
    // db query - verify user
    // verify with google logout user google
    // store token in db - remove/invalidate token
    // return success
    return response.status(201);
  } catch (err) {
    return next(err);
  }
}

async function register(request, response, next) {
  accountNewSchema.properties.role.enum = roles;
  accountNewSchema.properties.auth_method.enum = authMethods;
  const validation = validate(request.body, accountNewSchema);
  if (!validation.valid) {
    return next(
      new APIError(
        400,
        "Bad Request",
        validation.errors.map(e => e.stack).join(". ")
      )
    );
  }
  // create transaction
  const transaction = await dbConn.transaction();
  try {
    var body = request.body;

    const result = await users.getUser(body.email, body.role);
    const user = result.results;
    if (user) {
      return next(
        new APIError(
          409,
          "Bad Request",
          "User already exists!"
        )
      )
    };
    const passwordValidation = await utils.isBase64(body.password);
    if (passwordValidation) {
      // Create user
      const newUserResult = await users.createUser(body, transaction);
      const newUser = newUserResult.results[0];
      body.userId = newUser.userid;
      const newCustResult = await utils.createCustomer(body, transaction);
      const newCustomer = newCustResult.results[0];
      const token = await passport.getToken({ email: body.email, role: body.role });
      await transaction.commit();
      try {
        const mailBody = fs.readFileSync(path.join(__dirname, '../templates/welcomeEmail.html'), 'utf8');
        const mailBodyWithParams = mailBody.replace(/{{ROLE}}/g, body.role);
        const mail = await email.sendEmail(body.email, "Registration confirmation email", mailBodyWithParams);
      } catch (err) {
        logger.error("Error occurred: " + err)
      }
      return response.status(200).json({
        token: token,
        user: {
          email: newUser.email,
          role: newUser.logintype,
          address: newCustomer.address,
          pincode: newCustomer.pincode
        }
      });
    } else {
      return next(
        new APIError(
          409,
          "Bad Request",
          "Please provide the correct details"
        )
      );
    }
  }
  catch (error) {
    logger.error(error);
    await transaction.rollback();
    return next(
      new APIError(
        500,
        "Bad Request",
        "Internal server error, Please tray again later!"
      )
    )
  }
}

async function getOTP(request, response, next) {
  try {
    const body = request.body;
    const result = await users.getUser(body.email, body.role);
    if (!result.results) {
      return next( new APIError( 409, "Invalid Request!", "Incorrect username or password") );
    }
    const user = result.results;
    const otp = otpGenerator.generateOTP();
    const otpInsert = await otpGenerator.saveOTP(user.userid, otp);
    if (otpInsert.results) {
      const mailHTML = await fs.readFileSync(path.join(__dirname, '../templates/sendOtp.html'), 'utf8');
      const mailBody = mailHTML.replace(/{{OTP}}/g, otp);
      const mail = await email.sendEmail(user.email, 'Rent Everything - OTP', mailBody);
      return response.status(200).json({ status: 'success' });
    } else {
      return next( new APIError( 400, "Bad Request", "Incorrect user details" ) );
    }
  } catch (err) {
    logger.error("Error occurred: " + err)
    return next( new APIError( 400, "Bad Request", "Incorrect user details" ) );
  }
}

async function verifyOTP(request, response, next) {
  try {
    const body = request.body;
    const result = await users.getUser(body.email, body.role);
    if (!result.results) {
      return next( new APIError( 409, "Incorrect username or password", validation.errors.map(e => e.stack).join(". ") ) );
    }
    const user = result.results;
    const otp = await otpGenerator.getOTP(user.userid, user.role);
    if (otp.results) {
      if (otp.results.otp == body.otp) {
        const token = await passport.getToken({ email: body.email, role: body.role });
        return response.status(200).json({ token: token });
      } else {
        return next( new APIError( 400, "Bad Request", "Incorrect OTP" ) );
      }
    } else {
      return next( new APIError( 400, "Bad Request", "Incorrect user details" ) );
    }
  } catch (err) {
    logger.error("Error occurred: " + err)
    return next( new APIError( 400, "Bad Request", "Incorrect user details" ) );
  }
}




module.exports = {
  login,
  logout,
  register,
  getOTP,
  verifyOTP
};
