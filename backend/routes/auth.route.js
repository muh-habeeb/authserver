import { body } from "express-validator";

import { Router } from "express";
import {
  login,
  logOut,
  signup,
  verifyAccount,forgotPassword,resetPassword
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logOut);
router.post(
  "/verify",
  [
    body("code")
      .notEmpty()
      .withMessage("Code is required")
      .isLength({ min: 6, max: 6 })
      .withMessage("Code must be 6 digits")
      .isNumeric()
      .withMessage("Code must contain only numbers")
      .toInt(), // convert string digits -> number
  ],
  verifyAccount
);


router.post("/forgot-password",forgotPassword)
router.post("/reset-password/:token",resetPassword)
export default router;
