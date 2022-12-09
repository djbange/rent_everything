const otpGenerator = require('otp-generator');

const { logger } = require('./logger');

async function generateOTP() {
    return await otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });
}

async function saveOTP(email, role, otp) {
    const query = `INSERT INTO otp (email, role, otp, createDate) VALUES ('${email}', '${role}', '${otp}', current_timestamp);`;
    const { results, metadata } = await dbConn.query(query, {
        replacements: [null],
        type: QueryTypes.INSERT
        });
    return { results, metadata };
}

async function getOTP(email, role) {
    const query = `SELECT * FROM otp WHERE email = '${email}' AND role = '${role}' \
                    where createDate <= current_timestamp + (15 ||' minutes')::interval ORDER BY createDate DESC LIMIT 1;`;
    const { results, metadata } = await dbConn.query(query, {'type': QueryTypes.SELECT});
    return { results, metadata };
}

module.exports = {
    generateOTP,
    saveOTP,
    getOTP
}