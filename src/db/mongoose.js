const mongoose = require("mongoose");
const validator = require("validator");

mongoose.connect(process.env.MONGODB_URL);

//Define a user model
//The model definition is where you define what makes up a user.
// This would include all the pieces of data you want to store in the database.
//The user model below has just two fields, a name and an age.

// const User = mongoose.model("User", {
//   name: {
//     type: String,
//     required: true, //name is required
//     trim: true, //is used to remove extra spaces before or after data
//   },
//   age: {
//     type: Number,
//   },

//   email: {
//     type: String,
//     required: true,
//     trim: true,
//     lowercase: true, //used to convert the data to lowercase before saving it to the database
//     validate(value) {
//       if (!validator.isEmail(value)) {
//         throw new Error("Email is invalid");
//       } //The method gets called with the value to validate, and it should throw an error if the data is invalid. The example below uses the isEmail method from validator to validate the email address is valid before saving it to the database.
//     },
//   },
//   password: {
//     type: String,
//     required: true,
//     minLength: 7,
//     trim: true,
//     validate(value) {
//       if (value.toLowerCase().includes("password")) {
//         throw new Error("Password cannot contain password");
//       }
//     },
//   },
// });

// const Tasks = mongoose.model("Tasks", {
//   description: {
//     type: String,
//   },
//   completed: {
//     type: Boolean,
//   },
// });

//With the model defined, it’s time to start creating and saving users.
//The User variable above stores the Mongoose model. This is a constructor function that can be used to create new users.
//The snippet below creates a new user with the name 'Andrew' and the age 27. This alone won’t save any data to the database, but it’s a step in the right direction.

// const me = new User({
//   name: "Miana",
//   age: 24,
//   email: "hjkl@gmail.com",
//   password: "password",
// });

// const new_task = new Tasks({
//   description: "Do it all",
//   completed: false,
// });

//The new model instance can be saved to the database using the save method.

// new_task
//   .save()
//   .then(() => {
//     console.log(new_task);
//   })
//   .catch((error) => {
//     console.log("Error!", error);
//   });

// me.save()
//   .then(() => {
//     console.log(me);
//   })
//   .catch((error) => {
//     console.log("Error!", error);
//   });
