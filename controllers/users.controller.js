import jwt from "jsonwebtoken";
import {
  addUserToDB,
  checkUser,
  isUserAlreadyExist,
} from "../services/users.service.js";

export const login = async (req, res) => {
  try {
    // Get All The Data
    const email = req.body.email;
    const password = req.body.password;

    const result = await checkUser(email, password);
    if (result.status == "failed") {
      res.send(result);
    }

    const user = result["data"];
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

    res.send({
      status: "success",
      data: {
        id: user["id"],
        name: user["name"],
        token: accessToken,
      },
    });
  } catch (error) {
    res.status(400).send({
      status: "failed",
      message: error.message,
    });
  }
};

export const register = async (req, res) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    // TODO: Check the user email if already exist or not
    const resultIfExist = await isUserAlreadyExist(email, password);
    if (resultIfExist.status == "failed") {
      res.status(400).send(resultIfExist);
      return;
    }

    const resultInsert = await addUserToDB(name, email, password);
    if (resultInsert.status == "failed") {
      res.status(500).send(resultInsert);
      return;
    }

    const user = { id: resultInsert["id"], name: name, email: email };

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

    const result = {
      status: "success",
      data: {
        id: resultInsert["id"],
        token: accessToken,
      },
    };

    res.send(result);
  } catch (error) {
    res.status(400).send({
      status: "failed",
      message: error.message,
    });
  }
};
