const nodeMailer = require("nodemailer");

const sendEmail = async ( 
    email,subject,html ) => {

        const transporter = nodeMailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: subject,
            html: html
        });
};

module.exports = sendEmail;