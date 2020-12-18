const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: false },
  settings: { type: Object, required: false },
  login_method: { type: String, required: true }
});

module.exports = mongoose.model("User", User);
