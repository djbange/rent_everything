const { logger } = require("../helpers/logger");

async function getPropertiesDist(filters) {
    if (filters && filters.zipCode) {
        filters.distance = parseInt(filters.distance) || 20;
        var query = `Select distinct p.ProductID, p.Address, p.Zipcode, p.DefaultImageLink, p.ProductType, p.Amount, ar.Rating, \
                    round(z3.distance::numeric, 1) as distance, p.ProductSpecification\
                    FROM property p \
                    JOIN ( \
                    select z2.zip,z2.latitude, z2.longitude, SQRT(POW(69.1 * (z1.latitude - z2.latitude), 2) + \
                        POW(69.1 * (z1.longitude - z2.longitude) * COS(z2.latitude / 57.3), 2)) AS distance \
                    FROM (Select * from zip  where zip = '${filters.zipCode}') z1 JOIN zip z2 ON SQRT(POW(69.1 * (z1.latitude - z2.latitude), 2) + \
                        POW(69.1 * (z1.longitude - z2.longitude) * COS(z2.latitude / 57.3), 2)) < ${filters.distance} ) z3 \
                        ON p.zipcode = z3.zip \
                    left JOIN Average_Rating ar ON p.productid = ar.productid
                    left join customer_orderhistory coh on p.productid = coh.productid and coh.status = 'Booked'`
        // return query
        const keys = Object.keys(filters);
        var where = "WHERE";
        for (let i = 0; i < keys.length; i++) {
            if (keys[i].toLowerCase() == 'distance' || keys[i].toLowerCase() == 'zipcode' || keys[i].toLowerCase() == 'enddate') {
                continue;
            }
            if (where != "WHERE") {
                where = `${where} and`
            }
            const key = keys[i];
            switch(key.toLowerCase()) {
                case "category":
                    if (filters[key].toLowerCase() == 'all') {
                        if(where.length > 5){
                            where = where.slice(0, where.length - 4);
                        }
                    } else {
                        where = `${where} p.ProductType = '${filters[key]}'`;
                    }
                    break;
                case "price":
                    var priceM = false
                    if (filters[key].min && parseInt(filters[key].min) > 0){
                        where = `${where} p.Amount >= ${filters[key]['min']}`
                        priceM = true
                    } else {
                        if (where != 'WHERE') {
                            // where = where.slice(0, where.length - 4);
                            priceM = true;
                        }
                    }
                    if (filters[key].max ){
                        if (priceM) {
                            where = `${where} and`
                        }
                        where = `${where} p.Amount <= ${filters[key]['max'] }`
                    }
                    break;
                case "rating":
                    if (filters[key].min && parseInt(filters[key].min) >0){
                        where = `${where} (ar.Rating >= ${filters[key]['min']} or ar.Rating is null)`
                    } else {
                        where = where.slice(0, where.length - 4);
                    }
                    break;
                case "startdate":
                    // if (where.length > 5) {
                    //     where = where.slice(0, where.length - 4);
                    // }
                    where = `${where} p.productid not in (select productid from customer_orderhistory where status = 'Booked' and \
                    ((startdate >= '${filters.startDate}' and startdate <= '${filters.endDate}') or \
                    (enddate >= '${filters.startDate}' and enddate <= '${filters.endDate}') or \
                    (startdate <= '${filters.startDate}' and enddate >= '${filters.endDate}')))`
                    break;
                default:
                    throw "Unexpected data in request body"
            }
        }
        if (where === "WHERE"){
            return query;
        }
        return `${query} ${where};`
    }
    throw 'Provide correct details in the query'
}

async function getPropertyQuery(productId) {
    return `select 
    p.productId,
    p.ProductType,
    p.Amount,
    p.ProductSpecification,
    p.Zipcode,
    p.Address,
    p.Longitude,
    p.Latitude,
    rp."name" as renter_name,
    rp.phonenumber as renter_ph,
    ud.email as renter_email,
    pi.images
    from (select * from property where productid='${productId}') p
    inner join renter_profile rp on p.renterid = rp.renterid 
    inner join user_details ud on rp.userid = ud.userid
    left join (select productid, array_agg(imagelink) as images from propertyimage where productid = '${productId}' group by productid ) pi
    on pi.productid = p.productid;`
}

async function getPropertyReview(productId) {
    return `select 
    cp.name,
    r.rating,
    r.comments,
    r.reviewDate
    from (select * from review where productid='${productId}') r
    inner join customer_profile cp on r.customerid = cp.customerid;`
}


module.exports = {
    getPropertiesDist,
    getPropertyQuery,
    getPropertyReview
};