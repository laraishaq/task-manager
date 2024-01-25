require("../src/db/mongoose");
const Tasks = require("../src/models/tasks");

// Tasks.findByIdAndDelete("65ae6c8a3f0c8e22642027fc")
//   .then((tasks) => {
//     console.log(tasks);
//     return Tasks.countDocuments({ completed: false });
//   })
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((e) => {
//     console.log(e);
//   });

//better way than above

const deleteTaskAndCount = async (id) => {
  const tasks = await Tasks.findByIdAndDelete(id);
  const count = await Tasks.countDocuments({ completed: false });
  return count;
};

deleteTaskAndCount("65ae6c8a3f0c8e22642027fc")
  .then((count) => {
    console.log(count);
  })
  .catch((e) => {
    console.log(e);
  });
