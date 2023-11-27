const nodemailer = require('nodemailer');
const credentials = require('./credentials');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: credentials.GMAIL_ID,
    pass: credentials.GMAIL_PASSWORD
  }
});

module.exports.transporter = transporter;