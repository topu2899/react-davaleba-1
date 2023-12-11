const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    text: { type: String, minlength: 1, required: true },
    user: { type: String, required: true },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  },
  { timestamps: true, versionKey: false }
);

const Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;