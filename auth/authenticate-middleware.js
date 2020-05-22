const jwt = require("jsonwebtoken");
const secrets = require("../config/secrets.js")
module.exports = (req, res, next) => {

  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, secrets.jwtSecret, (error, decodedToken) => {
      if (error) {
        res.status(401).json({ error: "You do not have permission to access this data" });
      } 
      else {
        req.jwt = decodedToken;
        next();
      }
    });
  } else {
    res.status(400).json({ error: "You do not have permission to access this data" });
  }
};