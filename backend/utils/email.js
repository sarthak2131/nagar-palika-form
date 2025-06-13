import nodemailer from 'nodemailer';
import { config } from 'dotenv';
import {AppError} from '../utils/appError.js';

config({ path: '../.env' });

const sendEmail = async (options) => {
  try {
    console.log('sendEmail called with options:', options); // Log options

    // 1) Create a transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, // upgrade later with STARTTLS
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      },
      tls: {
        rejectUnauthorized: false // Only for development!
      },
      startTLS: {
        enable: true
      }
    });

    console.log('Transporter created:', transporter.options); // Log transporter options

    // 2) Define the email options
    const mailOptions = {
      from: 'Your Name <your.email@example.com>',
      to: options.email,
      subject: options.subject,
      text: options.message,
    };

    console.log('Mail options:', mailOptions); // Log mail options

    // 3) Actually send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info); // Log email sending info
    return info;
  } catch (error) {
    console.error('Email sending error:', error);
    console.error('Email sending error stack:', error.stack); // Log stack trace
    throw new AppError('Email sending failed', 500);
  }
};

export default sendEmail;