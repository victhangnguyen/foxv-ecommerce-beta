import nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';
//! imp library
import Logging from '../library/Logging.js';
//! imp config
import config from '../config/index.js';

async function sendEmail(email, subject, text, htmlTemplate) {
  // Send verification email to registered email
  const emailUsername = config.general.email.emailUsername;
  const emailPassword = config.general.email.emailPassword;

  const transporter = nodemailer.createTransport(
    smtpTransport({
      service: 'Gmail',
      auth: {
        user: emailUsername,
        pass: emailPassword,
      },
    })
  );

  const mailOptions = {
    from: emailUsername,
    to: email,
    subject: subject,
    text: text,
    html: htmlTemplate,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        Logging.error('Error sending email:' + error);
        reject(error);
      }
      Logging.success('Email sent:' + info.response);
      resolve(info);
    });
  });
}

export default sendEmail;
