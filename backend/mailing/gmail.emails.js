import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE
} from "./emailTemplate.js";
import { gmailTransporter, gmailSender } from "./gmail.config.js";
import dotenv from "dotenv";

dotenv.config();

// Custom error classes for better error handling
class NetworkError extends Error {
  constructor(message) {
    super(message);
    this.name = "NetworkError";
    this.type = "NETWORK_ERROR";
  }
}

class EmailServiceError extends Error {
  constructor(message) {
    super(message);
    this.name = "EmailServiceError";
    this.type = "EMAIL_SERVICE_ERROR";
  }
}

// Helper function to determine if error is network-related
const isNetworkError = (error) => {
  const networkErrorCodes = [
    'EHOSTUNREACH',  // Host unreachable (no internet)
    'ENOTFOUND',     // DNS lookup failed
    'ETIMEDOUT',     // Connection timeout
    'ECONNREFUSED',  // Connection refused
    'ECONNRESET',    // Connection reset
    'ENETUNREACH'    // Network unreachable
  ];
  
  return networkErrorCodes.some(code => 
    error.code === code || error.message.includes(code)
  );
};

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
    
    if (isNetworkError(error)) {
      throw new NetworkError("Unable to send verification email. Please check your internet connection and try again.");
    } else {
      throw new EmailServiceError("Failed to send verification email. Please try again later.");
    }
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
    
    if (isNetworkError(error)) {
      throw new NetworkError("Unable to send welcome email. Please check your internet connection and try again.");
    } else {
      throw new EmailServiceError("Failed to send welcome email. Please try again later.");
    }
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
    
    if (isNetworkError(error)) {
      throw new NetworkError("Unable to send password reset email. Please check your internet connection and try again.");
    } else {
      throw new EmailServiceError("Failed to send password reset email. Please try again later.");
    }
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
    if (isNetworkError(error)) {
      throw new NetworkError("Unable to send password reset confirmation. Please check your internet connection and try again.");
    } else {
      throw new EmailServiceError("Failed to send password reset confirmation. Please try again later.");
    }
  }
};