const jwt = require("jsonwebtoken");
const messages = require("@constants/messages");
const { checkToken } = require("@utils/securityUtils");

const verifyNewPassToken = (req, res, next) => {
  checkToken(req, res);
  let decoded;
  try {
    const [_, token] = req.headers.authorization.split(" ");
    decoded = jwt.verify(token, process.env.SECRET_KEY);
  } catch (err) {
    return res.status(401).send(messages.INVALID_CREDENTIALS);
  }

  if (decoded.type !== "newPass") return res.status(400).send(messages.INVALID_TOKEN);
  req.newPassData = { email: decoded.email };

  return next();
};

module.exports = verifyNewPassToken;