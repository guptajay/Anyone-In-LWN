const mongoose = require("mongoose");

const StatusSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: "Out of Library"
  },
  location: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Status = mongoose.model("Status", StatusSchema);

module.exports = Status;
