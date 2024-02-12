const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Tasks = require("./tasks");

const userSchema = new mongoose.Schema(
  {
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
      unique: true,
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

    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    avatar: { type: Buffer },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject(); //we want a raw object with our user data attached, this is what the mongoose toObject does

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;

  return userObject;
};

//methods are accessible on intances, instance methods
//we can call such functions only after creating an object of that class. In fact, the call to the instance method is made through the created object itself.
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

//static models are accessible on the model, model methods
//using the method statics, we're setting that up as something we could access directly on the model once we have actual access to it
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Unable to login");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Password is not a match");
  }

  return user;
};

//pre is for doing something before an event; we must pass 2 arguments to it
//basically we're saying run this code before you save
//we call next when the function is done
//HASH the plain text password before saving
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

//Delete User tasks when user is removed

userSchema.pre("deleteOne", async function (next) {
  const userId = this._conditions._id;
  await Tasks.deleteMany({ owner: userId });
  next();
});

//the object that's being passed as the second argument is called a schema, to be able to use middleware we should define the schema first
const User = mongoose.model("User", userSchema);

module.exports = User;
