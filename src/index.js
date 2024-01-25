const express = require("express");
require("./db/mongoose"); //we dont want to actually grab anything from the file, we just want to ensure it runs and mongoose connects to the database
const User = require("./models/user");
const Tasks = require("./models/tasks");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/tasks");

const app = express();
const port = process.env.PORT || 3000;

//use() to customize our server

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
