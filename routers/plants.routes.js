import express from "express";
import {
  getAllPlants,
  getPlantById,
  uploadPlants,
} from "../controllers/plants.controller.js";
import multer from "multer";

const upload = multer({
  dest: "uploads/", // Temporary directory for uploaded files (optional)
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB (adjust as needed)
});

const router = express.Router();
router.get("/", getAllPlants);
router.get("/:id", getPlantById);
router.post("/upload", upload.single("image"), uploadPlants);

export default router;
