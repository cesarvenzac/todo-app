const { getAllTasks, createTask, modifyTask, removeTask } = require("../services/taskService");

async function getTasks(req, res, database) {
  try {
    const tasks = await getAllTasks(req.user.userId, database);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

async function addTask(req, res, database) {
  try {
    const { name, description, status, priority } = req.body;
    const result = await createTask(req.user.userId, name, description, status, priority, database);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

async function updateTask(req, res, database) {
  try {
    const { name, description, status, priority } = req.body;
    const result = await modifyTask(
      req.user.userId,
      req.params._id,
      name,
      description,
      status,
      priority,
      database
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

async function deleteTask(req, res, database) {
  try {
    const result = await removeTask(req.user.userId, req.params._id, database);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { getTasks, addTask, updateTask, deleteTask };
