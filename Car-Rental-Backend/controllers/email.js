const nodemailer = require("nodemailer");
require('dotenv').config(); 

let transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
    },
});

const sendConfirmationEmail = (userInfo) => {
    const { name, email, carType, pickUp, dropOff, pickTime, dropTime } = userInfo;
    const mailOptions = {
        from: process.env.EMAIL_USER, 
        to: email, 
        subject: 'Car Booking Confirmation', 
        text: `Hello ${name},

Your car booking has been confirmed.

Car Type: ${carType}
Pick-Up Location: ${pickUp}
Drop-Off Location: ${dropOff}
Pick-Up Time: ${pickTime}
Drop-Off Time: ${dropTime}

Thank you for choosing our service!`, 
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Error while sending email:", error);
        } else {
            console.log("Email sent: " + info.response);
        }
    });
};

module.exports = { sendConfirmationEmail };