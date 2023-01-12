const nodemailer = require('nodemailer');

const emailSender = (user, link) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "769009873146e1",
            pass: "1c6eb18ffdfd08"
        }
    });
    let mailOptions = {
        from: user,
        to: "salmansalimkutty@gmail.com",
        subject: "Welcome to Tectoro",
        text: "Please verify for forget password",
        html: `<a href=${link}>forget</a>`
    }
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err.message);
            return err
        }
        console.log("Mail Sent" + info.response);
    })
}

module.exports = { emailSender }
