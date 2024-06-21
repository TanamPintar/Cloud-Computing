import pool from "../configs/db.config.js";

export async function isUserAlreadyExist(email, password) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Inser data to users table
    const [getUserResult] = await connection.execute(
      `SELECT COUNT(*) count FROM users WHERE email = ?;`,
      [email],
    );

    await connection.commit();

    console.log("Transaction successful!");

    if (getUserResult[0]["count"] != 0) {
      return {
        status: "failed",
        message: "Account with the same email alrady exist",
      };
    }

    return {
      status: "success",
      data: "No such account with the same email was found",
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

export async function checkUser(email, password) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Inser data to users table
    const [getUserResult] = await connection.execute(
      `SELECT
        BIN_TO_UUID(id, true) id, name, email
    FROM
        users
    WHERE
        email = ?
    AND
        password = ?`,
      [email, password],
    );

    await connection.commit();

    console.log("Transaction successful!");

    if (getUserResult.length == 0) {
      return {
        status: "failed",
        message: "No such account was found",
      };
    }

    return {
      status: "success",
      data: getUserResult[0],
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

export async function addUserToDB(name, email, password) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Inser data to users table
    const [insertUserResult] = await connection.execute(
      `INSERT INTO 
                users(name, email, password)
            VALUES
                (?, ?, ?)
            ;`,
      [name, email, password],
    );

    // Get the id
    const [getIDResult] = await connection.execute(
      `SELECT 
                BIN_TO_UUID (id, true) id
            FROM
                users
            WHERE 
                email = ? 
            AND
                password = ?
            ;`,
      [email, password],
    );

    await connection.commit();

    console.log("Transaction successful!");

    return {
      status: "success",
      id: getIDResult[0]["id"],
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
