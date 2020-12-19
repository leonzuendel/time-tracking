const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Workspace = new Schema({
  title: { type: String, required: false },
  projects: { type: Object, required: false },
  users: { type: Array, required: true }
});

module.exports = mongoose.model("Workspace", Workspace);
