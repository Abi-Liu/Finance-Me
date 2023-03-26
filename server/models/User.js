const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  googleId: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  avatar: { type: String },
});

module.exports = mongoose.model("User", UserSchema);
