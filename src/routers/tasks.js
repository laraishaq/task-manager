const express = require("express");
const router = new express.Router();
const Tasks = require("../models/tasks");
const auth = require("../middleware/auth");

router.post("/tasks", auth, async (req, res) => {
  // const tasks = new Tasks(req.body);
  const tasks = new Tasks({
    ...req.body, //will copy everything from req.body to this object you're gicing new Tasks
    owner: req.user._id,
  });

  try {
    await tasks.save();
    res.send(tasks);
  } catch (e) {
    res.status(400).send(e);
  }
  // tasks
  //   .save()
  //   .then(() => {
  //     res.send(tasks);
  //   })
  //   .catch((e) => {
  //     res.status(400).send(e);
  //   });
});

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=20
// GET /tasks?sortBy=createdAt:desc

router.get("/tasks", auth, async (req, res) => {
  const completed = req.query.completed === "true";
  const sort = {};

  // createdAt:desc

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    // ['createdAt', 'desc']
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
    /**
     * {
     *  'createdAt': 1
     *  'completed': -1
     * }
     *
     */
  }
  try {
    // const tasks = await Tasks.find({});
    const tasks = await Tasks.find(
      {
        owner: req.user._id,
        // completed,
      },
      undefined,
      {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort,
      }
    );
    res.send(tasks);
  } catch (e) {
    res.status(500).send(e);
  }

  // Tasks.find({})
  //   .then((tasks) => {
  //     res.send(tasks);
  //   })
  //   .catch((e) => {
  //     res.status(500).send(e);
  //   });
});

router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    // const tasks = await Tasks.findById(_id);
    const tasks = await Tasks.findOne({ _id, owner: req.user._id });
    if (!tasks) {
      return res.status(404).send();
    }
    res.send(tasks);
  } catch (e) {
    res.status(500).send();
  }

  // Tasks.findById(_id)
  //   .then((tasks) => {
  //     if (!tasks) {
  //       return res.status(404).send();
  //     }
  //     res.send(tasks);
  //   })
  //   .catch((e) => {
  //     res.status(500).send();
  //   });
});

router.put("/tasks/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidOperation = updates.every((updates) =>
    allowedUpdates.includes(updates)
  );

  if (!isValidOperation) {
    return res.status(400).send("Invalid Operation!");
  }

  try {
    const tasks = await Tasks.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    // const tasks = await Tasks.findById(req.params.id);

    // const tasks = await Tasks.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });

    if (!tasks) {
      return res.status(404).send();
    }
    updates.forEach((update) => (tasks[update] = req.body[update]));
    await tasks.save();
    res.send(tasks);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    // const tasks = await Tasks.findByIdAndDelete(req.params.id);
    const tasks = await Tasks.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!tasks) {
      res.status(400).send();
    }
    res.send(tasks);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
