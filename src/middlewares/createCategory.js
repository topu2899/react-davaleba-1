const createCategory = (req, res, next) => {
  const trimmedName = req.body.name.trim();

  if (!trimmedName) return res.status(422).send({ msg: "Invalid name" });
  return next();
};

module.exports = createCategory
