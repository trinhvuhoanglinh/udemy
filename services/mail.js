const sgMail = require('@sendgrid/mail');
const config = require('../config');

const sendEmail = async (to, subject, otp) => {
    try {
        sgMail.setApiKey(config.SG_KEY)
        const msg = {
            to: to,
            from: 'trinhthevils@gmail.com', // Không đổi, phải gửi từ đây mới được
            subject: subject,
            text: 'http://localhost:3000/verify?email=' + to + "&otp=" + otp,
        }
        sgMail.send(msg)
    } catch (error) {
        return error;
    }
}

module.exports = {
    sendEmail,
}
