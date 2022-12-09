const { QueryTypes } = require('sequelize');

// app imports
const { dbConn } = require("../config");
const { logger } = require("../helpers/logger");

async function getOwner(email, role) {
  const [results, metadata] = await dbConn.query(
    'SELECT rp.renterid, ud.email, ud.logintype, rp."name", rp.address, rp.pincode, rp.phonenumber  FROM user_details ud \
          inner join renter_profile rp \
          on ud.userid = rp.userid \
          WHERE ud.email = :email and ud.logintype = :role \
          ',
    {
      replacements: { email: email, role: role },
      type: QueryTypes.SELECT
    }
  )
  return { results, metadata }
}

async function getOwnerById(id) {
  const [results, metadata] = await dbConn.query(
    'SELECT * FROM renter_profile WHERE RenterId = :id',
    {
      replacements: { id: id },
      type: QueryTypes.SELECT
    }
  )
  return { results, metadata }
}

async function createOwner(data, transaction) {
  const [results, metadata] = await dbConn.query(
    "INSERT INTO Customer_Profile (UserID, Name, Dob, Address, PinCode, PhoneNumber) VALUES \
          (:userID, :name, :dob, :address, :pincode, :phoneNumber)\
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

async function updateOwner(customerId, data, transaction) {
  const [results, metadata] = await dbConn.query(
    "UPDATE table_name \
      SET Name = :name, \
          Dob = :dob, \
          Address = :address, \
          PinCode = :pincode, \
          PhoneNumber = :phoneNumber, \
      WHERE customerId = :customerId \
      RETURNING *;",
    {
      replacements: {
        customerId: customerId, name: data.name, dob: data.dob,
        address: data.address, pincode: data.pincode, phoneNumber: data.phone_number
      },
      type: QueryTypes.INSERT,
      transaction: transaction
    }
  )
  return { results, metadata }
}

async function getBookings(email, role) {
  const query = `SELECT coh.OrderId, coh.startdate, coh.enddate, coh.amountpaid, coh.status, coh.lastupdated,
                  p.ProductSpecification, p.amount, p.DefaultImageLink, p.producttype, p.Zipcode,
                  cp."name" as customer_name, cp.phonenumber
                  FROM (SELECT * from user_details where email = '${email}' and logintype = '${role}') ud
                  inner join renter_profile rp on rp.userid = ud.userid
                  inner join property p on p.renterid  = rp.renterid 
                  inner join Customer_OrderHistory coh on p.productid  = coh.productid and coh.status = 'Booked'
                  inner join user_details ud1 on ud1.userid = coh.userid 
                  inner join customer_profile cp on cp.userid = ud1.userid 
                  order by coh.startdate desc;`;
  const [results, metadata] = await dbConn.query(query,
                          {
                            replacements: { email: email, role: role },
                            // type: QueryTypes.SELECT
                          }
                      )
  return { results, metadata }
}

module.exports = {
  createOwner,
  getOwner,
  updateOwner,
  getBookings,
  getOwnerById
}