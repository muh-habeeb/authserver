import express from "express";
import { Router } from "express";
import { login, logOut, signup } from "../controllers/auth.controller.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logOut);

export default router;
