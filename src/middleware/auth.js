//load in JSON webtoken library so we can validate the token being provided
const jwt = require("jsonwebtoken");
//load in user model so we can find them in the database once we've validated the auth token
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", ""); //we use replace to remove the bearer portion from the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    }); //is the token still part of the array

    if (!user) {
      throw new Error();
    }

    req.user = user;
    req.token = token;
    // res.locals.user = user; // type script
    next();
  } catch (e) {
    res.status(401).send({ e });
  }
};

module.exports = auth;

//what will this function do to authenticate the whole process?
//the auth process starts with the client taking the auth token that they get from signing up or logging in and providing it with the request they're trying to perform
//So if you have logged in with the user several times and have the auth tokens showing up
