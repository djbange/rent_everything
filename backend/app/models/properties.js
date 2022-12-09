// npm packages
const { QueryTypes } = require('sequelize');

// app imports
const { APIError } = require("../helpers");
const { dbConn, paymentStatus } = require("../config");
const { logger } = require("../helpers/logger");

async function getProperties(query) {
    const [results, metadata] = await dbConn.query(
        query,
        {
            replacements: [null],
            // type: QueryTypes.
        }
    )
    return { results, metadata }
}

async function getPropertyId(propertyId) {
    const [results, metadata] = await dbConn.query(
        'SELECT * FROM Property WHERE PropertyId = :id',
        {
            replacements: { id: propertyId },
            type: QueryTypes.SELECT
        }
    )
    return { results, metadata }
}

async function getPropertiesByOwner(ownerId) {
    const [results, metadata] = await dbConn.query(
        'SELECT * FROM Property WHERE renterId = :id',
        {
            replacements: { id: ownerId },
            // type: QueryTypes.SELECT
        }
    )
    return { results, metadata }
}

async function addProperty(data, transaction) {
    const [results, metadata] = await dbConn.query(
        "INSERT INTO Property (ProductType, Amount, ProductSpecification, DefaultImageLink, Zipcode, Address, Longitude, Latitude) VALUES \
        (:productType, :amount, :productSpecification, :defaultImageLink, :pincode, :address, :lat, :long)\
        RETURNING *;",
        {
            replacements: {
                productType: data.productType, amount: data.amount, productSpecification: data.productSpecification,
                defaultImageLink: data.defaultImageLink, pincode: data.pincode,
                address: data.address, phoneNumber: data.phone_number,
                lat: data.lat, long: data.long
            },
            type: QueryTypes.INSERT,
            transaction: transaction
        }
    )
    return { results, metadata }
}

async function addImages(data, transaction) {
    var insertVales = "";
    for (let i = 0; i < data.length; i++) {
        insertVales += `('${data[i].propertyId}', '${data[i].imageLink}'),`;
    }
    insertVales = insertVales.slice(0, -1);
    const query = `INSERT INTO PropertyImage (PropertyId, ImageLink)
                    VALUES ${insertVales} RETURNING *;`;
    const [results, metadata] = await dbConn.query(query,
        {
            replacements: [null],
            type: QueryTypes.INSERT,
            transaction: transaction
        });
    return { results, metadata }
}

async function updateProperty(propertyId, data, transaction) {
    const [results, metadata] = await dbConn.query(
        "UPDATE Property \
        SET ProductType = :productType, \
        Amount = :amount, \
        ProductSpecification = :productSpecification, \
        DefaultImageLink = :defaultImageLink, \
        Zipcode = :pincode, \
        Address = :address, \
        Longitude = :long, \
        Latitude = :lat, \
        WHERE PropertyId = :propertyId \
        RETURNING *;",
        {
            replacements: {
                propertyId: propertyId, productType: data.productType, amount: data.amount,
                productSpecification: data.productSpecification,
                defaultImageLink: data.defaultImageLink, pincode: data.pincode,
                address: data.address, lat: data.lat, long: data.long
            },
            type: QueryTypes.UPDATE,
            transaction: transaction
        });
    return { results, metadata }
}

async function addReview(data, transaction) {
    const query = `INSERT INTO Review (ProductId, CustomerId, Rating, Comments, ReviewDate)
                    VALUES ('${data.productId}', '${data.userId}', ${data.rating}, '${data.content}', current_timestamp)
                    ON CONFLICT (ProductId, CustomerId) 
                    DO 
                        UPDATE 
                            SET rating = ${data.rating}, comments = '${data.content}', reviewdate = current_timestamp
                    RETURNING *;`;
    const [results, metadata] = await dbConn.query(query, {
        replacements: [null],
        transaction: transaction,
        type: QueryTypes.INSERT
    });
    return { results, metadata };
}

async function addComplaint(data) {
    const query = `INSERT INTO Complaints (UserID, ProductId, Complaint, ComplaintDate, ComplaintStatus)
                    VALUES ('${data.userId}', '${data.productId}', '${data.content}', current_timestamp, '${data.status}')
                    RETURNING *;`;
    const [results, metadata] = await dbConn.query(query,
        {
            replacements: [null],
            type: QueryTypes.INSERT
        });
    return { results, metadata };
}

async function getComplaints(status) {
    const query = `SELECT p.defaultImageLink, p.productId, p.productSpecification,
    C.complaint, C.complaintDate, C.complaintStatus, u.email as c_email, cp.phoneNumber as c_phoneNumber, cp.name as c_name,
    rp.phoneNumber as r_phoneNumber, rp.name as r_name, rp.email as r_email
     FROM (select * from Complaints where lower(complaintStatus) != '${paymentStatus.RESOLVED}') C
    left join property p on C.productid = p.productid
    left join user_details u on u.userId = C.userid
    left join customer_profile cp on cp.userId = u.userId
    left join (select r.*, ur.email from renter_profile r inner join user_details ur on ur.userId = r.userid
        ) rp on rp.renterId = p.renterId
    ;`;
    const [results, metadata] = await dbConn.query(query,
        {
            replacements: [null],
            // type: QueryTypes.SELECT
        });
    return { results, metadata };
}

async function getResolvedComplaints() {
    const query = `SELECT * FROM Complaints where lower(complaintStatus) = '${paymentStatus.RESOLVED}';`;
    const [results, metadata] = await dbConn.query(query,
        {
            replacements: [null],
            // type: QueryTypes.SELECT
        });
    return { results, metadata };
}



module.exports = {
    getProperties,
    addProperty,
    updateProperty,
    getPropertyId,
    getPropertiesByOwner,
    addReview,
    addComplaint,
    getComplaints,
    getResolvedComplaints
};