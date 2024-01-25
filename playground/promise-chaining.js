require("../src/db/mongoose");
const User = require("../src/models/user");

//65b0b01034c22b2b8f31103a

//so when we find the document by ID and we update it
//thennnnn print user
// User.findByIdAndUpdate("65b0c9346578e45c2c81a572", { age: 17 })
//   .then((user) => {
//     console.log(user);
//     return User.countDocuments({ age: 17 });
//   })
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((e) => {
//     console.log(e);
//   });

// better way than above
const updateAgeAndCount = async (id, age) => {
  const user = await User.findByIdAndUpdate(id, { age });
  const count = await User.countDocuments({ age });
  return count;
};

updateAgeAndCount("65b0c9346578e45c2c81a572", 3)
  .then((count) => {
    console.log(count);
  })
  .catch((e) => {
    console.log(e);
  });
