import express from "express";
import { register, login, logout, verifyAuth } from "../controllers/auth.controllers.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/verifyAuth", verifyAuth);

export default router;