const nodemailer = require('nodemailer');

// Create a transporter using SMTP or a service
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use 'gmail' or other email providers
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASS,
    },
});

const sendMail = async (to, subject, text) => {
    return new Promise((resolve, reject) => {
        // Define email options
        const mailOptions = {
            from: process.env.SMTP_FROM, // Sender's email
            to,
            subject,
            // text,
            html: text, // HTML body
        };

        // Send the email
        return transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error:', error);
                reject(error);
            } else {
                console.log('Email sent:', info.response);
                resolve(info.response);
            }
        });
    });
};

const sendBulkEmail = async (emailList, subject, text) => {
    return new Promise((resolve, reject) => {
        // Define email options
        const mailOptions = {
            from: process.env.SMTP_FROM, // Sender's email
            to: emailList.join(','),
            subject,
            // text,
            html: text, // HTML body
        };

        // Send the email
        return transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error:', error);
                reject(error);
            } else {
                console.log('Email sent:', info.response);
                resolve(info.response);
            }
        });
    });
};

module.exports = {
    sendMail,
    sendBulkEmail
};