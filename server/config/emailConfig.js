// const dotenv = require('dotenv')
// dotenv.config()
// const nodemailer = require('nodemailer');

// let transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_PORT,
//     secure: false,
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//     }
// })

// module.exports = transporter

var nodemailer = require("nodemailer");
var mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mithunajhas.20cse@kongu.edu",
    pass: "Mithunajha2002@31",
  },
});

var details = {
  from: "mithunajhas.20cse@kongu.edu",
  to: "kamalgopika54@gmail.com",
  subject: "hall booking",
  text: "your hall is booked",
};

mailTransporter.sendMail(details, function (err, info) {
  if (err) {
    console.log("it has an error", err);
  } else {
    console.log("email has sent successfully" + info.response);
  }
});

module.exports = mailTransporter;