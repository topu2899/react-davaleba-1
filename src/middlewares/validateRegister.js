const validateRegister = (req, res, next) => {
  const errors = [];
  for (const prop in req.body) {
    if (!req.body[prop]) {
      return res.send({ message: "All fields are required" });
    }
  }
  const emailRegex = new RegExp(
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  );

  if (!emailRegex.test(req.body["email"])) {
    errors.push("Invalid email");
  }

  if (req.body.password.length < 8) {
    errors.push("Invalid password");
  }

  if (errors.length) return res.status(422).send({ message: errors });
  return next();
};

module.exports = validateRegister;
