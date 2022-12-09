const nodemailer = require('nodemailer');
const { logger } = require('../helpers/logger');

let testAccount =  nodemailer.createTestAccount();

const transporter = nodemailer.createTransport({
    service: 'smtp.ethereal.email',
    auth: {
        user: testAccount.user,
        pass: testAccount.pass,
    },
});

async function updateHtml(html, data) {
    for (var key in data) {
        html = html.replace(new RegExp(`{{${key}}}`, 'g'), data[key]);
    }
    return html;
}

async function sendEmail(to, subject, html) {
    const message = {
        from: 'djbange@iu.edu',
        to: to,
        subject: subject,
        html: html,
    };
    const info = await transporter.sendMail(message);
    if (info.rejected.length > 0) {
        logger.error("Email rejected: " + info.rejected);
    } else {
        logger.info("Email sent: " + info.messageId);
    }
}

module.exports = {
    sendEmail,
    updateHtml,
};