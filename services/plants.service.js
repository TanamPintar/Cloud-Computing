import pool from "../configs/db.config.js";

export async function insertTempPlant(plant_name, soil_type) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Inser data to users table
    const [insertTempPlant] = await connection.execute(
      `INSERT INTO plants(plant_name, soil_type, image_url) 
          VALUES(
              ?,
              UUID_TO_BIN(?, true),
              "none"
          );`,
      [plant_name, soil_type],
    );

    const [getPlantID] = await connection.execute(
      `SELECT BIN_TO_UUID(id, true) id FROM plants
          ORDER BY created_at DESC
          LIMIT 1;`,
    );

    await connection.commit();

    console.log("Transaction successful!");

    return {
      status: "success",
      data: {
        id: getPlantID[0]["id"],
      },
    };
  } catch (error) {
    // Roll back if any error occurs
    await connection.rollback();

    console.error("Transaction failed:", error);
    return {
      status: "failed",
      message: error.message,
    };
  } finally {
    connection.release(); // Release the connection back to the pool
  }
}

export async function deleteTempPlant(id) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Delete Temp Soil
    const [deleteTempSoil] = await connection.execute(
      `DELETE FROM plants WHERE id = UUID_TO_BIN(?, true);`,
      [id],
    );

    await connection.commit();

    console.log("Transaction successful!");

    return {
      status: "success",
      data: {},
    };
  } catch (error) {
    // Roll back if any error occurs
    await connection.rollback();

    console.error("Transaction failed:", error);
    return {
      status: "failed",
      message: error.message,
    };
  } finally {
    connection.release(); // Release the connection back to the pool
  }
}

export async function updateImageURLTempPlant(id, image_url) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [updateTempPlant] = await connection.execute(
      `UPDATE plants
          SET image_url = ? 
          WHERE id = UUID_TO_BIN(?, true);`,
      [image_url, id],
    );

    await connection.commit();

    console.log("Transaction successful!");

    return {
      status: "success",
      data: {},
    };
  } catch (error) {
    // Roll back if any error occurs
    await connection.rollback();

    console.error("Transaction failed:", error);
    return {
      status: "failed",
      message: error.message,
    };
  } finally {
    connection.release(); // Release the connection back to the pool
  }
}
