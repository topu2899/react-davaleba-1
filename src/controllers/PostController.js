const Post = require("@models/Post");
const { Category } = require("@models/Category");

exports.createPost = async (req, res) => {
  try {
    const { categoryId } = req.body;
    const category = await Category.findById(categoryId);
    if (!category) return res.status(404).send({ msg: "Specified category not found" })
    const post = await Post.create({ ...req.body, category });
    return res.send(post);
  } catch (_) {
    return res.status(400).send({ msg: "Opps.. Something went wrong" });
  }
};

exports.createPostDavaleba = async (req, res) => {
  try {
    const { title, description, category, timestamp } = req.body;
    if (!title) return res.status(404).send({ msg: "Specified title not found" })
    if (!category) return res.status(404).send({ msg: "Specified category not found" })
    if (!description) return res.status(404).send({ msg: "Specified description not found" })
    if (!timestamp) return res.status(404).send({ msg: "Specified timestamp not found" })
    const post = await Post.create(req.body);
    return res.send(post);
  } catch (_) {
    return res.status(400).send({ msg: "Opps.. Something went wrong" });
  }
}