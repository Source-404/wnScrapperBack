const mongoose = require("mongoose");
const Report = require("./report");

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
  },
});

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
