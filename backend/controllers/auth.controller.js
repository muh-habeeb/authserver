import { User } from "../model/user.model.js";
import bcryptjs from "bcryptjs";
import { genJwtAndSetCookie } from "../util/genJwtAndSetCookie.js";

export const signup = async (req, res, next) => {
  try {
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
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const user = new User({
      email,
      name,
      password: hashPassword,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hour
    });
    await user.save();

    // jwt

    genJwtAndSetCookie(res, user._id);
    res.status(201).json({
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

export const login = async (req, res, next) => {};

export const logOut = async (req, res, next) => {};
