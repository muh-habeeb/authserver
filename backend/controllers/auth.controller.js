import { User } from "../model/user.model.js";
import bcryptjs from "bcryptjs";
import { genJwtAndSetCookie } from "../util/genJwtAndSetCookie.js";
import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendPasswordResetOkMail,
} from "../mailtrap/emails.js";
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
    await sendVerificationEmail(user.email, verificationToken);

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
    await sendWelcomeEmail(user.email, user.name);
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
    user.save();
    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );
    return res
      .status(200)
      .json({ success: true, message: "rest link sended to your Email" });
  } catch (error) {
    console.log("error in forgotPassword", error);
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
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
    user.password = hashedPassword; //store hshed password
    //make it undefined for non usable attr
    user.resetPasswordExpiresAt = undefined;
    user.resetPasswordToken = undefined;
    user.save(); //save document
    await sendPasswordResetOkMail(user.email); //send  ok mail
    return res.status(200).json({
      success: true,
      message: "password updated successfully",
    });
  } catch (error) {
    console.log("error in reset password", error);
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
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
