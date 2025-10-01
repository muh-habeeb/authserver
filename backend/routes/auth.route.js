import { body } from "express-validator";

import { Router } from "express";
import {
  login,
  logOut,
  signup,
  verifyAccount,forgotPassword,resetPassword,
  checkAuth
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = Router();
router.get('/check-auth',verifyToken,checkAuth)
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logOut);
router.post(
  "/verify-email", 
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
