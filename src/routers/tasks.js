const express = require("express");
const router = new express.Router();
const Tasks = require("../models/tasks");

router.post("/tasks", async (req, res) => {
  const tasks = new Tasks(req.body);

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

router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Tasks.find({});
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

router.get("/tasks/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const tasks = await Tasks.findById(_id);
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

router.put("/tasks/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidOperation = updates.every((updates) =>
    allowedUpdates.includes(updates)
  );

  if (!isValidOperation) {
    return res.status(400).send("Invalid Operation!");
  }

  try {
    const tasks = await Tasks.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!tasks) {
      return res.status(404).send();
    }
    res.send(tasks);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/tasks/:id", async (req, res) => {
  try {
    const tasks = await Tasks.findByIdAndDelete(req.params.id);
    if (!tasks) {
      res.status(400).send();
    }
    res.send(tasks);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
