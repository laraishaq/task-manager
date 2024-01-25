const express = require("express");
const router = new express.Router();
const User = require("../models/user");

router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.status(201).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
  // user
  //   .save()
  //   .then(() => {
  //     res.send(user);
  //   })
  //   .catch((e) => {
  //     res.status(400).send(e);
  //   });
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (e) {
    res.status(500).send(e);
  }
  // User.find({})
  //   .then((users) => {
  //     res.send(users);
  //   })
  //   .catch((e) => {
  //     res.status(500).send(e);
  //   });
});

router.get("/users/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const user_id = await User.findById(_id);
    if (!user_id) {
      return res.status(404).send();
    }
    res.send(user_id);
  } catch (e) {
    res.status(500).send();
  }

  // User.findById(_id)
  //   .then((user) => {
  //     if (!user) {
  //       return res.status(404).send();
  //     }
  //     res.send(user);
  //   })
  //   .catch((e) => {
  //     res.status(500).send();
  //   });
});

router.put("/users/:id", async (req, res) => {
  //findByIdAndUpdate hover you'll see it takes 3 arguments
  //new:true returns the new user as opposed to the exisitng one that was found before the update
  //runValidators, makes sure we do run validation for the update
  //three things could happen, user not found, user found and updated, user found but not updated
  //Note: If I try to update a property that does not exist it will be ignored, so if you want it to throw an error you need to write that code.
  const updates = Object.keys(req.body); //we know request.body is an object with all those updates but what I want back is an array of strings, we want to convert the object to a string
  const allowedUpdates = ["name", "email", "age", "email"];
  //for every updated item this function is called once, 5 items to update, function called 5 times, every runs the function for each item in an array
  //if you always return true in in every, every will return true; otherwise it's false, even though there's only one false
  //includes returns a boolean
  const isValidOperation = updates.every(
    (updates) => allowedUpdates.includes(updates) //shorthand, removed curly braces and return
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "INVALID UPDATE" });
  }
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).send();
    }

    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      res.status(400).send();
    }

    res.send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
