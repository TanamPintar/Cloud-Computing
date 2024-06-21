import express from "express";
import { login, register } from "../controllers/users.controller.js";

const router = express.Router();
router.post("/login", login);

// User Register
router.post("/register", register);

router.get("/", (req, res) => {
  res.send(`Hello ${req.user.name}`);
});

export default router;
