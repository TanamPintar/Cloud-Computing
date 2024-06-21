import express from "express";
import {
  getAllSoils,
  getSoilById,
  uploadSoil,
} from "../controllers/soils.controller.js";

import multer from "multer";

const upload = multer({
  dest: "uploads/", // Temporary directory for uploaded files (optional)
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB (adjust as needed)
});

const router = express.Router();
router.get("/", getAllSoils);
router.get("/:id", getSoilById);
router.post("/upload", upload.single("image"), uploadSoil);

export default router;
