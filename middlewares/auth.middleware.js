import jwt from "jsonwebtoken";

export const checkAuthToken = (req, res, next) => {
  const excludedPath = ["/users/login", "/users/register", "/soils/{:id}"];

  console.log(req.path);

  if (excludedPath.includes(req.path)) {
    next();
    return;
  }

  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res.status(401).send("Unauthorized: No token provided");

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err != null) return res.status(401).send("Unauthorized: Invalid token");

    req.user = user;
    next();
  });
};
