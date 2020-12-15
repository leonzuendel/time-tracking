const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Project = new Schema({
  title: { type: String, required: false },
  content: { type: String, required: false },
  settings: { type: Object, required: false },
  user: { type: String, required: true }
});

module.exports = mongoose.model("Project", Project);
