import pool from "../configs/db.config.js";
import {
  deleteTempSoil,
  insertTempSoil,
  updateImageURLTempSoil,
} from "../services/soils.service.js";

import {uploadImageToBucket} from '../helpers/uploadImage.helper.js';

export const getAllSoils = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(
      "SELECT BIN_TO_UUID(id, true) id, soil_name, description, image_url FROM soils",
    );
    const soilData = [];
    rows.forEach((soil) => {
      soilData.push({
        id: soil.id,
        soil_name: soil.soil_name,
        description: soil.description,
        image_url: soil.image_url,
      });
      
    });
    res.json({ status: "success", data: soilData });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  } finally {
    connection.release();
  }
};

export const getSoilById = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    console.log(req.params.id);
    const [rows] = await connection.execute(
      "SELECT BIN_TO_UUID(id, true) id, soil_name, description, image_url FROM soils WHERE id = UUID_TO_BIN(?, true)",
      [req.params.id],
    );
    if (rows.length > 0) {
      const soil = rows[0];
      res.json({
        status: "success",
        data: {
          id: soil.id,
          soil_name: soil.soil_name,
          description: soil.description,
          image_url: soil.image_url,
        },
      });
    } else {
      res.status(404).json({ status: "failed", message: "Soil not found" });
    }
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  } finally {
    connection.release();
  }
};

export const uploadSoil = async (req, res) => {
  const connection = await pool.getConnection();
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "No image uploaded" });
  }

  try {
    // Get All Neccesarry Data
    const soil_name = req.body.soil_name;
    const description = req.body.description;

    // Insert Temporary Soil
    const tempStoreSoil = await insertTempSoil(soil_name, description);

    if (tempStoreSoil.status == "failed") {
      res.status(500).send(tempStoreSoil);
      return;
    }

    const soilID = tempStoreSoil.data["id"];

    console.log(`Here`);

    // Upload image to bucket
    const uploadResult = await uploadImageToBucket(
      "tanam-pintar-bucket",
      "soils",
      req.file.path,
      soilID,
    );

    if (uploadResult.status == "failed") {
      await deleteTempSoil(soilID);
      res.status(500).send(uploadResult);
      return;
    }

    // Update the image_url
    await updateImageURLTempSoil(soilID, uploadResult["data"]["image_url"]);

    // Send Response Success
    res.send({
      status: "success",
      data: {
        id: soilID,
        soil_name: soil_name,
        description: description,
        image_url: uploadResult["data"]["image_url"],
      },
    });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};
