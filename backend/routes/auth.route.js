import express from "express";
import { Router } from "express";
import { login, logOut, signup ,verifyAccount} from "../controllers/auth.controller.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logOut);
router.post("/verify", verifyAccount);



export default router;
