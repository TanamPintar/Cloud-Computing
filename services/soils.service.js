import pool from "../configs/db.config.js";

export async function insertTempSoil(soil_name, description) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Inser data to users table
    const [insertTempSoil] = await connection.execute(
      `INSERT INTO soils(soil_name, description, image_url) 
        VALUES(
            ?, 
            ?,
            "none"
        );`,
      [soil_name, description],
    );

    const [getSoilID] = await connection.execute(
      `SELECT BIN_TO_UUID(id, true) id FROM soils
        ORDER BY created_at DESC
        LIMIT 1;`,
    );

    await connection.commit();

    console.log("Transaction successful!");

    return {
      status: "success",
      data: {
        id: getSoilID[0]["id"],
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

export async function deleteTempSoil(id) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Delete Temp Soil
    const [deleteTempSoil] = await connection.execute(
      `DELETE FROM soils WHERE id = UUID_TO_BIN(?, true);`,
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

export async function updateImageURLTempSoil(id, image_url) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Delete Temp Soil
    const [updateTempSoil] = await connection.execute(
      `UPDATE soils
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
