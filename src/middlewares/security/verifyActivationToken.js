const jwt = require("jsonwebtoken");
const messages = require("@constants/messages");
const { checkToken } = require("@utils/securityUtils");

const verifyActivationToken = (req, res, next) => {
  checkToken(req, res);
  let decoded;
  try {
    const [_, token] = req.headers.authorization.split(" ");
    decoded = jwt.verify(token, process.env.SECRET_KEY);
  } catch (err) {
    return res.status(401).send(messages.INVALID_CREDENTIALS);
  }

  if (decoded.type !== "activation") return res.status(400).send(INVALID_TOKEN);
  req.activationData = { email: decoded.email };

  return next();
};

module.exports = verifyActivationToken;