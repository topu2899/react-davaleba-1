const mongoose = require("mongoose");
const { CategorySchema } = require("./Category");

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, unique: true, minlength: 1, required: true },
    text: { type: String, minlength: 1, required: true },
    category: { type: CategorySchema, required: true },
  },
  { versionKey: false }
);

const Post = mongoose.model("Post", PostSchema);


module.exports = Post;
