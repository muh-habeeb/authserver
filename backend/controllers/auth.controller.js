import { User } from "../model/user.model.js";
import bcryptjs from "bcryptjs";
import { genJwtAndSetCookie } from "../util/genJwtAndSetCookie.js";
import { sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/emails.js";
import { validationResult } from "express-validator";

export const signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      throw new Error("all field are required");
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
      message: "internal server error",
      error: error.message,
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
      console.log(user);

      return res.status(400).json({
        success: false,
        message: "token  not found",
      });
    }

    if (user.verificationTokenExpiresAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "verification token expired",
      });
    }

    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpiresAt = null;
    await user.save(); // save the new user
    await sendWelcomeEmail(user.email, user.name);
    return res.status(200).json({
      success: true,
      message: "account verified successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "internal server error",
      error: error.message,
    });
  }
};

export const login = async (req, res, next) => {};

export const logOut = async (req, res, next) => {
  res.clearCookie("token");

  return res.status(200).json({
    // 204 for no content
    success: true,
    message: "Logged out successfully",
  });
};
