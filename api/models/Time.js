const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Time = new Schema({
  _eid: { type: String, required: false },
  start: { type: Date, required: true, default: Date.now() },
  startTimeMinutes: { type: Number, required: false },
  end: { type: Date, required: true, default: Date.now() },
  endTimeMinutes: { type: Number, required: false },
  title: { type: String, required: false },
  content: { type: String, required: false },
  background: { type: Boolean, required: false },
  allDay: { type: Boolean, required: false },
  daysCount: { type: Number, required: false },
  deletable: { type: Boolean, required: false, default: false },
  deleting: { type: Boolean, required: false, default: false },
  titleEditable: { type: Boolean, required: false, default: true },
  resizable: { type: Boolean, required: false, default: true },
  resizing: { type: Boolean, required: false, default: false },
  draggable: { type: Boolean, required: false, default: true },
  dragging: { type: Boolean, required: false, default: false },
  draggingStatic: { type: Boolean, required: false, default: false },
  focused: { type: Boolean, required: false, default: false },
  class: { type: String, required: false, default: "" },
  user: { type: String, required: true },
  project: { type: String, required: false },
  sort: { type: Number, required: false }
});

module.exports = mongoose.model("Time", Time);
