const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const Settings = require('../models/Setting');

dotenv.config();
const sendEmail = async (options) => {
  const SettingsFind = await Settings.findOne()

  try {

    const transporter = nodemailer.createTransport({
      host: process.env.SMPT_HOST,
      port: process.env.SMPT_PORT,
      auth: {
        user: process.env.SMPT_MAIL || SettingsFind?.smtp_email,
        pass: process.env.SMPT_PASS || SettingsFind?.smtp_password,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: process.env.SMPT_MAIL,
      to: options.email,
      subject: options.subject,
      html: options.message,
    };

    await transporter.sendMail(mailOptions);
    return true
  } catch (error) {
    console.error("Error sending email:", error);
    return false
  }
};

module.exports = sendEmail;