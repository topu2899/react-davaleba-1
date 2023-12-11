const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, minlength: 5, unique: true },
    password: { type: String, required: true, minlength: 8 },
    lastLogin: { type: Number, required: true, default: 0 },
    nickName: { type: String, unique: true },
    blocked: { type: Boolean, default: false },
    active: { type: Boolean, default: false },
    role: { type: String, required: true, enum: ['USER', 'ADMIN', "MODER"], default: "USER" }
  },
  { versionKey: false }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
