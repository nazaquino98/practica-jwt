// routes/authRoutes.js

import { Router } from "express";
import { login, getSession, logout, register } from "../controllers/authController.js";

const router = Router();

router.post("/login", login);
router.get("/session", getSession);
router.post("/logout", logout);
router.post("/register", register);
export default router;
