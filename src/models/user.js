const mongoose = require("mongoose");
const validator = require("validator");

const User = mongoose.model("User", {
  name: {
    type: String,
    required: true, //name is required
    trim: true, //is used to remove extra spaces before or after data
  },
  age: {
    type: Number,
  },

  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true, //used to convert the data to lowercase before saving it to the database
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      } //The method gets called with the value to validate, and it should throw an error if the data is invalid. The example below uses the isEmail method from validator to validate the email address is valid before saving it to the database.
    },
  },
  password: {
    type: String,
    required: true,
    minLength: 7,
    trim: true,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error("Password cannot contain password");
      }
    },
  },
});

module.exports = User;
