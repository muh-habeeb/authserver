import { User } from "../model/user.model.js";
import bcryptjs from "bcryptjs";
import { genJwtAndSetCookie } from "../util/genJwtAndSetCookie.js";
import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendPasswordResetOkMail,
} from "../mailing/gmail.emails.js";
import { validationResult } from "express-validator";
import crypto from "crypto";

export const signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({
        success: false,
        message: "user already exist",
      });
    }

    const hashPassword = await bcryptjs.hash(password, 10);
    //create verification code
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    //user model
    const user = new User({
      email,
      name,
      password: hashPassword,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 1 * 60 * 60 * 1000, // 1 hours
    });
    // save the user
    await user.save();

    // jwt
    genJwtAndSetCookie(res, user._id);
    
    try {
      await sendVerificationEmail(user.email, verificationToken);
    } catch (emailError) {
      // Even if email fails, account was created successfully
      console.log("Email sending failed:", emailError.message);
      
      if (emailError.type === "NETWORK_ERROR") {
        return res.status(201).json({
          success: true,
          message: "Account created successfully, but verification email could not be sent due to network issues. Please check your internet connection and try verifying later.",
          ...user._doc,
          password: null,
          verificationToken: null,
          emailWarning: "Verification email failed to send - network issue"
        });
      } else {
        return res.status(201).json({
          success: true,
          message: "Account created successfully, but verification email could not be sent. Please try verifying later.",
          ...user._doc,
          password: null,
          verificationToken: null,
          emailWarning: "Verification email failed to send - service issue"
        });
      }
    }

    // success response
    return res.status(201).json({
      success: true,
      message: "user created successfully",
      ...user._doc,
      password: null, //security reasons
      verificationToken: null, //security reasons
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
      error: "internal server error ",
      path: "/signup",
      code: 500,
    });
  }
};

export const verifyAccount = async (req, res, next) => {
  // const { email, verificationToken } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { code: verificationToken } = req.body; // already sanitized
  try {
    console.log("code", verificationToken);

    // const user = await User.findOne({ email });
    const user = await User.findOne({ verificationToken });

    // check for user?
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired  code",
      });
    }

    if (user.verificationTokenExpiresAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "verification code expired",
      });
    }
    // update user
    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpiresAt = null;

    await user.save(); // save the new user
    
    //send welcome email
    try {
      await sendWelcomeEmail(user.email, user.name);
    } catch (emailError) {
      // Account verification still succeeded even if welcome email fails
      console.log("Welcome email sending failed:", emailError.message);
    }
    
    //send response
    return res.status(200).json({
      success: true,
      message: "account verified successfully",
      ...user._doc,
      password: null, //security reasons
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
      error: "internal server error ",
      path: "/verify-account",
    });
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user not found",
      });
    }
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }
    genJwtAndSetCookie(res, user._id);
    user.lastLogin = new Date();
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      ...user._doc,
      password: null,
    });
  } catch (error) {
    console.log("Error in login ,", error);
    return res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};

export const logOut = async (req, res, next) => {
  res.clearCookie("token");
  return res.status(200).json({
    // 204 for no content
    success: true,
    message: "Logged out successfully",
  });
};

export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return res.status(403).json({ success: true, message: "email required" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user dose not found",
      });
    }
    //generate reset token

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;
    await user.save();
    
    try {
      await sendPasswordResetEmail(
        user.email,
        `${process.env.CLIENT_URL}/reset-password/${resetToken}`
      );
      return res
        .status(200)
        .json({ success: true, message: "Reset link sent to your email" });
    } catch (emailError) {
      console.log("Password reset email sending failed:", emailError.message);
      
      if (emailError.type === "NETWORK_ERROR") {
        return res.status(500).json({
          success: false,
          message: "Unable to send reset email due to network issues. Please check your internet connection and try again.",
          error: "NETWORK_ERROR"
        });
      } else {
        return res.status(500).json({
          success: false,
          message: "Failed to send reset email. Please try again later.",
          error: "EMAIL_SERVICE_ERROR"
        });
      }
    }
  } catch (error) {
    console.log("error in forgotPassword", error);
    return res
      .status(500)
      .json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "invalid or expired token",
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    user.password = hashedPassword; //store hashed password
    //make it undefined for non usable attr
    user.resetPasswordExpiresAt = undefined;
    user.resetPasswordToken = undefined;
    await user.save(); //save document
    
    try {
      await sendPasswordResetOkMail(user.email); //send  ok mail
    } catch (emailError) {
      // Password was still reset successfully even if confirmation email fails
      console.log("Password reset confirmation email failed:", emailError.message);
    }
    
    return res.status(200).json({
      success: true,
      message: "password updated successfully",
    });
  } catch (error) {
    console.log("error in reset password", error);
    return res
      .status(500)
      .json({ success: false, message: error.message });
  }
};
//for user is logged or not
export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user)
      return res.status(400).json({
        message: "user not found",
        success: false,
      });

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "server error",
      success: false,
    });
  }
};

// Resend verification email with rate limiting
export const resendVerificationEmail = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified"
      });
    }

    // Check rate limiting (2 minutes = 120000ms)
    const now = Date.now();
    const twoMinutes = 2 * 60 * 1000;
    
    if (user.lastResendTime && (now - user.lastResendTime.getTime()) < twoMinutes) {
      const remainingTime = Math.ceil((twoMinutes - (now - user.lastResendTime.getTime())) / 1000);
      return res.status(429).json({
        success: false,
        message: `Please wait ${Math.ceil(remainingTime / 60)} minutes before requesting another verification email`,
        remainingTime: remainingTime
      });
    }

    // Generate new verification token
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Update user with new token, expiry, and resend time
    user.verificationToken = verificationToken;
    user.verificationTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour
    user.lastResendTime = new Date();
    
    await user.save();

    // Send verification email
    try {
      await sendVerificationEmail(user.email, verificationToken);
      
      return res.status(200).json({
        success: true,
        message: "Verification email sent successfully",
        canResendAt: new Date(Date.now() + twoMinutes).toISOString()
      });
    } catch (emailError) {
      console.log("Resend verification email failed:", emailError.message);
      
      if (emailError.type === "NETWORK_ERROR") {
        return res.status(500).json({
          success: false,
          message: "Unable to send verification email due to network issues. Please check your internet connection and try again.",
          error: "NETWORK_ERROR"
        });
      } else {
        return res.status(500).json({
          success: false,
          message: "Failed to send verification email. Please try again later.",
          error: "EMAIL_SERVICE_ERROR"
        });
      }
    }

  } catch (error) {
    console.log("Error in resendVerificationEmail:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
