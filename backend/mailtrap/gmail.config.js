import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create Gmail transporter
export const gmailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

// Sender information
export const gmailSender = {
  email: process.env.GMAIL_USER,
  name: process.env.GMAIL_SENDER_NAME || "Auth Service",
};

// Verify connection configuration
export const verifyGmailConnection = async () => {
  try {
    await gmailTransporter.verify();
    console.log("✅ Gmail transporter is ready to send emails");
    return true;
  } catch (error) {
    console.error("❌ Gmail configuration error:", error.message);
    return false;
  }
};
