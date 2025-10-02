import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE
} from "./emailTemplate.js";
import { gmailTransporter, gmailSender } from "./gmail.config.js";
import dotenv from "dotenv";

dotenv.config();

export const sendVerificationEmail = async (email, verificationToken) => {
  const mailOptions = {
    from: `${gmailSender.name} <${gmailSender.email}>`,
    to: email,
    subject: "Verify Your Email - Auth Service",
    html: VERIFICATION_EMAIL_TEMPLATE.replace(
      "{verificationCode}",
      verificationToken
    )
  };

  try {
    const info = await gmailTransporter.sendMail(mailOptions);
    console.log("✅ Verification email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Failed to send verification email:", error.message);
    throw new Error("Failed to send verification email: " + error.message);
  }
};

export const sendWelcomeEmail = async (email, name) => {
  const mailOptions = {
    from: `${gmailSender.name} <${gmailSender.email}>`,
    to: email,
    subject: "Welcome to Auth Service! 🎉",
    html: WELCOME_EMAIL_TEMPLATE.replace("{userName}", name)
  };

  try {
    const info = await gmailTransporter.sendMail(mailOptions);
    console.log("✅ Welcome email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Failed to send welcome email:", error.message);
    throw new Error("Failed to send welcome email: " + error.message);
  }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
  const mailOptions = {
    from: `${gmailSender.name} <${gmailSender.email}>`,
    to: email,
    subject: "Reset Your Password - Auth Service",
    html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL)
  };

  try {
    const info = await gmailTransporter.sendMail(mailOptions);
    console.log("✅ Password reset email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Failed to send password reset email:", error.message);
    throw new Error("Failed to send password reset email: " + error.message);
  }
};

export const sendPasswordResetOkMail = async (email) => {
  const mailOptions = {
    from: `${gmailSender.name} <${gmailSender.email}>`,
    to: email,
    subject: "Password Reset Successful - Auth Service",
    html: PASSWORD_RESET_SUCCESS_TEMPLATE
  };

  try {
    const info = await gmailTransporter.sendMail(mailOptions);
    console.log("✅ Password reset confirmation email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Failed to send password reset confirmation:", error.message);
    throw new Error("Failed to send password reset confirmation: " + error.message);
  }
};