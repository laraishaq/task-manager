const mongoose = require("mongoose");
const validator = require("validator");

const Tasks = mongoose.model("Tasks", {
  description: {
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    deafult: false,
  },
});

module.exports = Tasks;
