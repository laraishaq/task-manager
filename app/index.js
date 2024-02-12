const express = require("express");
require("./db/mongoose"); //we dont want to actually grab anything from the file, we just want to ensure it runs and mongoose connects to the database
const User = require("./models/user");
const Tasks = require("./models/tasks");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/tasks");
// const multer = require("multer");

const app = express();
const port = process.env.PORT;

// const upload = multer({
//   dest: "images", //destination
//   limits: {
//     fileSize: 1000000,
//   },
//   fileFilter(req, file, cb) {
//     if (!file.originalname.match(/\.(doc|docx)$/)) {
//       return cb(new Error("Please upload a word document"));
//     }

//     cb(undefined, true);
//     // cb(new Error("File must be a PDF"));
//     // cb(undefined, true);
//     // cb(undefined, false);
//   },
// });

// const errorMiddleware = (req, res, next) => {
//   throw new Error("From my middleware");
// };

// app.post(
//   "/upload",
//   upload.single("upload"),
//   (req, res) => {
//     res.send();
//   },
//   (error, req, res, next) => {
//     res.status(400).send({ error: error.message });
//   }
// );

//With Middleware we can customize the behavior to fit our needs, and add a step in the middle
//We have a new request coming in, we do something, whatever function we want, then we run the route handler
//This function can be anything, maybe we want to log statistics about the request, or we want to check if there's a valid auth token
//This function is what will run between the request and the handler router running, has access to the same info as the route handler
//next is specific to setting up middleware
//if someone tries to use a get method we send a message to say u cant, anything else is ok
// app.use((req, res, next) => {
//   if (req.method === "GET") {
//     res.send("GET REQUESTS ARE DISABLED");
//   } else {
//     next(); //we call next to let middleware know we're done with this function, we don't have to give it any arguments
//   }
// });

// //Any request will not work
// app.use((req, res, next) => {
//   res.status(503).send("MAINTAINENCE");
// });

//use() to customize our server
////Without Middleware (our current setup): a new request comes into the server and our route handler is run; so new request comes in, app.use runs our specific route we requested because this is how we set it up

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log("Server is up on port " + port);
});

// const bycrypt = require("bcryptjs");

// const myFunction = async () => {
//   const password = "Red12345";
//   //using the hash() from the bycrypt library,since it return a promise we can use await
//   //8 is the number of times you want to "run" it, number of rounds the algorithim is executed
//   //Note: Hashing algorithims are non reversible, encryption algorithims are, meaning we can rejumble it back to what the initial password was
//   //So if we use a hashedpassword algorithim for log in, we would have to take in the input password, hash it, then compare it to the hashed password that exists in the database
//   const hashedPassword = await bycrypt.hash(password, 8);

//   console.log(password);
//   console.log(hashedPassword);

//   const isMatch = await bycrypt.compare(password, hashedPassword);
//   console.log(isMatch);
// };

// const jwt = require("jsonwebtoken");
// const myFunction = async () => {
//   //takes in two arguments, an object and a string
//   //the object contains the data that is going to embedded in your token; we need to store a unique identifier for the user to be authenticated
//   //the second argument is the sign token
//   //we can expire web tokens after a certain amount of time; to do this we give a third argument when we create the token
//   const token = jwt.sign({ _id: "abc123kj" }, "12345678ijhbvfdrtyu", {
//     expiresIn: "7 days",
//   }); //the return value is a new auth token

//   //To verify the token
//   //2 arguments, the first is the token you want to verify and the second is the secret
//   //returns the payload/data of the token, if not it throws an error
//   const data = jwt.verify(token, "12345678ijhbvfdrtyu");
//   // console.log(data);
// };

// myFunction();
