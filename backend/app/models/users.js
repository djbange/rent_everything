// npm packages
const { QueryTypes } = require('sequelize');

// app imports
const { dbConn } = require("../config");
const { logger } = require("../helpers/logger");

async function getUser(email, role) {
    const [results, metadata] = await dbConn.query(
            'SELECT * FROM user_details WHERE email = :email and logintype = :role',
            {
              replacements: { email: email, role: role },
              type: QueryTypes.SELECT
            }
          )
    return {results, metadata}
}

async function getCustomer(email, role) {
  const [results, metadata] = await dbConn.query(
          'SELECT ud.userid, cp.customerid, ud.email, ud.logintype, cp."name" , cp.dob , cp.address, cp.pincode, cp.phonenumber  FROM user_details ud \
          inner join customer_profile cp \
          on ud.userid = cp.userid \
          WHERE ud.email = :email and ud.logintype = :role \
          ',
          {
            replacements: { email: email, role: role },
            type: QueryTypes.SELECT
          }
        )
  return {results, metadata}
}

async function getUserById(id) {
  const [results, metadata] = await dbConn.query(
          'SELECT * FROM user_details WHERE userId = :id',
          {
            replacements: { id: id },
            type: QueryTypes.SELECT
          }
        )
  return {results, metadata}
}

async function createUser(data, transaction) {
  const [results, metadata] = await dbConn.query(
          "INSERT INTO User_Details (Email, Password, AuthMethod, LoginType) VALUES \
          (:email, :password, :authMethod, :role)\
          RETURNING *;",
          {
            replacements: { email: data.email, password: data.password, authMethod: data.auth_method, role: data.role },
            type: QueryTypes.INSERT,
            transaction: transaction
          }
        )
  return {results, metadata}
}

async function getUsers(ids) {
    // await dbConn.query(
    //     'SELECT * FROM users_details WHERE email = :email',
    //     {
    //       replacements: { ema: 'active' },
    //       type: QueryTypes.SELECT
    //     }
    //   )
}

async function updateUser(id, t) {

}

async function removeUser(ids) {

}

module.exports = {
    getUser,
    getUsers,
    updateUser,
    removeUser,
    createUser,
    getCustomer
}