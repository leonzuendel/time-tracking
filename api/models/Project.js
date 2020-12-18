const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Project = new Schema({
  title: { type: String, required: false },
  content: { type: String, required: false },
  settings: { type: Object, required: false },
  users: { type: Array, required: true },
  sort: { type: Number, required: false },
  color: { type: String, required: false }
});

module.exports = mongoose.model("Project", Project);
