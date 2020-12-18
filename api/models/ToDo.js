const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ToDo = new Schema({
  title: { type: String, required: false },
  content: { type: String, required: false },
  category: { type: Number, required: true, default: 0 },
  status: { type: Number, required: true, default: 0 },
  done: { type: String, required: true, default: false },
  imported: { type: String, required: true, default: false },
  importedFrom: { type: String, required: false, default: "" },
  project: { type: String, required: true },
  user: { type: String, required: true },
  sort: { type: Number, required: false }
});

module.exports = mongoose.model("ToDo", ToDo);
