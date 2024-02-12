const express = require("express");
const auth = require("../middleware/auth"); //setting up middleware for an individual route
const User = require("../models/user");
const multer = require("multer");
const sharp = require("sharp");
const { sendWelcomeEmail, sendCacnelationEmail } = require("../emails/account");
const router = new express.Router();

//ROUTER FOR SIGN
router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    sendWelcomeEmail(user.email, user.name);
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
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

//NEW ROUTER FOR LOGIN

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken(); //we need to create this function in the model
    res.send({ user, token });
  } catch (e) {
    res.status(400).send();
  }
});

//NEW ROUTER FOR LOGOUT

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token; //return the token that doesn't match in the array of tokens
    });

    await req.user.save();
    res.send();
  } catch (e) {
    res.send(500).send();
  }
});

//NEW ROUTER FOR LOGOUT ALL

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = []; // make the array of tokens empty, delete all tokens

    await req.user.save();
    res.send(200);
  } catch (e) {
    res.send(500).send();
  }
});

//we add middleware to a specific route, the get request is made, auth.js is ran, then the async function here happens
router.get("/users/me", auth, async (req, res) => {
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

// router.get("/users/:id", async (req, res) => {
//   const _id = req.params.id;

//   try {
//     const user_id = await User.findById(_id);
//     if (!user_id) {
//       return res.status(404).send();
//     }
//     res.send(user_id);
//   } catch (e) {
//     res.status(500).send();
//   }

//   // User.findById(_id)
//   //   .then((user) => {
//   //     if (!user) {
//   //       return res.status(404).send();
//   //     }
//   //     res.send(user);
//   //   })
//   //   .catch((e) => {
//   //     res.status(500).send();
//   //   });
// });

router.put("/users/me", auth, async (req, res) => {
  //findByIdAndUpdate hover you'll see it takes 3 arguments
  //new:true returns the new user as opposed to the exisitng one that was found before the update
  //runValidators, makes sure we do run validation for the update
  //three things could happen, user not found, user found and updated, user found but not updated
  //Note: If I try to update a property that does not exist it will be ignored, so if you want it to throw an error you need to write that code.
  const updates = Object.keys(req.body); //we know request.body is an object with all those updates but what I want back is an array of strings, we want to convert the object to a string
  const allowedUpdates = ["name", "email", "age", "password"];
  //for every updated item this function is called once, 5 items to update, function called 5 times, every runs the function for each item in an array
  //if you always return true in in every, every will return true; otherwise it's false, even though there's only one false
  //includes returns a boolean

  const isValidOperation = updates.every(
    (update) => allowedUpdates.includes(update) //shorthand, removed curly braces and return
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "INVALID UPDATE" });
  }
  try {
    // const user = await User.findById(req.params.id);

    updates.forEach((update) => (req.user[update] = req.body[update]));
    // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });
    await req.user.save();

    // if (!user) {
    //   return res.status(404).send();
    // }

    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    // const user = await User.findByIdAndDelete(req.params._id);

    // if (!user) {
    //   res.status(400).send();
    // }

    await req.user.deleteOne(); //removing the user that was authenticated
    sendCacnelationEmail(req.user.email, req.user.name);
    res.send(req.user);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload a jpg, jpeg or png"));
    }

    cb(undefined, true);
  },
});

router.post(
  "/upload/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();

    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.delete("/upload/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});

router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) {
      throw new Error();
    }
    res.set("Content-Type", "image/jpg");
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send();
  }
});
module.exports = router;
