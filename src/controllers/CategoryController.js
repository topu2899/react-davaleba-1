const { Category } = require("@models/Category");

exports.createCategory = async (req, res) => {
  try {
    const trimmedName = req.body.name.trim();
    const category = await Category.create({ name: trimmedName });
    return res.send(category);
  } catch (_) {
    return res.send({ msg: "Opps.. Something went wrong" });
  }
};
