const jwt = require("jsonwebtoken");
const messages = require("@constants/messages");

const generateToken = (tokenParams, expTime) => {
  const token = jwt.sign(tokenParams, process.env.SECRET_KEY, {
    expiresIn: expTime,
  });
  return token;
};

const checkToken = (req, res) => {

  if (!req.headers.authorization) {
    return res.status(400).send(messages.NO_AUTH);
  }

  const [type, token] = req.headers.authorization.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).send(messages.INVALID_TOKEN);
  }
}
module.exports = { generateToken, checkToken }