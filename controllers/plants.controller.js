import pool from "../configs/db.config.js";
import {
  insertTempPlant,
  updateImageURLTempPlant,
  deleteTempPlant,
} from "../services/plants.service.js";
import { uploadImageToBucket } from "../helpers/uploadImage.helper.js";

export const getAllPlants = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(
      "SELECT BIN_TO_UUID(id, true) id, plant_name, BIN_TO_UUID(soil_type, true) soil_type, image_url FROM plants",
    );
    const plantData = [];
    rows.forEach((plant) => {
      plantData.push({
        id: plant.id,
        plant_name: plant.plant_name,
        soil_type: plant.soil_type,
        image_url: plant.image_url,
      });
    });
    res.json({ status: "success", data: plantData });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  } finally {
    connection.release();
  }
};

export const getPlantById = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(
      "SELECT BIN_TO_UUID(id, true) id, plant_name, BIN_TO_UUID(soil_type, true) soil_type, image_url FROM plants WHERE id = UUID_TO_BIN(?, true)",
      [req.params.id],
    );
    if (rows.length > 0) {
      const plant = rows[0];
      res.json({
        status: "success",
        data: {
          id: plant.id,
          plant_name: plant.plant_name,
          soil_type: plant.soil_type,
          image_url: plant.image_url,
        },
      });
    } else {
      res.status(404).json({ status: "failed", message: "Plant not found" });
    }
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  } finally {
    connection.release();
  }
};

export const uploadPlants = async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "No image uploaded" });
  }

  try {
    // Get All Neccesarry Data
    const plant_name = req.body.plant_name;
    const soil_type = req.body.soil_type;

    // Insert Temporary Soil
    const tempStorePlant = await insertTempPlant(plant_name, soil_type);

    if (tempStorePlant.status == "failed") {
      res.status(500).send(tempStorePlant);
      return;
    }

    const plantID = tempStorePlant.data["id"];

    // Upload image to bucket
    const uploadResult = await uploadImageToBucket(
      "tanam-pintar-bucket",
      "soils",
      req.file.path,
      plantID,
    );
    if (uploadResult.status == "failed") {
      await deleteTempPlant(soilID);
      res.status(500).send(uploadResult);
      return;
    }

    // Update the image_url
    await updateImageURLTempPlant(plantID, uploadResult["data"]["image_url"]);

    // Send Response Success
    res.send({
      status: "success",
      data: {
        id: plantID,
        plant_name: plant_name,
        image_url: uploadResult["data"]["image_url"],
      },
    });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};
