// CRUD create read update delete

const { MongoClient, ObjectID } = require("mongodb"); //require installed module

//to initialize the connection we need a mongo client

const connectionURL =
  "mongodb+srv://hello:kOqEQoP419bV6Xso@cluster0.4g4inkv.mongodb.net";
const id = new ObjectID();
console.log(id); // Print new id to the console

const databaseName = "task-manager";

MongoClient.connect(
  connectionURL,
  { useNewUrlParser: true },
  (error, client) => {
    if (error) {
      return console.log("Unable to connect to database!");
    }

    const db = client.db(databaseName);
    // Start to interact with the database

    // db.collection("users").insertOne({
    //   _id: id,
    //   name: "vfdvf",
    //   age: 23,
    // }),
    //   (error, result) => {
    //     if (error) {
    //       return console.log("Unable to insert user");
    //     }

    //     console.log(result.ops);
    //   };

    //if i want to write to an existing one (CREATE)
    // db.collection("tasks").insert(
    //   { description: "test", completed: true },
    //   (error, result) => {
    //     if (error) {
    //       return console.log("Unable to insert tasks!");
    //     }
    //     console.log(result.ops);
    //   }
    // );

    // db.collection("tasks").insertMany(
    //   [
    //     {
    //       description: "Clean the house",
    //       completed: true,
    //     },
    //     {
    //       description: "Renew inspection",
    //       completed: false,
    //     },
    //   ],
    //   (error, result) => {
    //     if (error) {
    //       return console.log("Unable to insert tasks!");
    //     }
    //     console.log(result.ops);
    //   }
    // );

    // FOR READ

    // fetch only those tasks that haven’t been completed.

    // db.collection("tasks")
    //   .find({ completed: false })
    //   .toArray((error, tasks) => {
    //     console.log(tasks);
    //   });

    // uses findOne to find a single document by its ID

    // db.collection("tasks").findOne(
    //   { _id: new ObjectID("65ae6c8a3f0c8e22642027fc") },
    //   (error, task) => {
    //     console.log(task);
    //   }
    // );

    // FOR UPDATING

    // db.collection("users")
    //   .updateOne(
    //     {
    //       _id: new ObjectID("65af5b4ba9a1262ae44a66dc"),
    //     },
    //     {
    //       $inc: {
    //         age: 1,
    //       },
    //     }
    //   )
    //   .then((result) => {
    //     console.log(result);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });

    //DELETING DOCUMENTS

    db.collection("tasks")
      .deleteOne({
        description: "Clean the house",
      })
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  }
);
