async function getAllTasks(userId, database) {
  return await database.collection("tasks").find({ userId }).toArray();
}

async function createTask(
  userId,
  name,
  description = "",
  status = "to start",
  priority = "medium",
  database
) {
  if (!name) {
    throw { status: 400, message: "Task name is required" };
  }

  const count = await database.collection("tasks").countDocuments({});
  await database.collection("tasks").insertOne({
    id: count + 1,
    name,
    description,
    status,
    priority,
    userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return { message: "Task added successfully" };
}

async function modifyTask(userId, taskId, name, description, status, priority, database) {
  const validStatuses = ["to start", "in progress", "completed"];
  if (status && !validStatuses.includes(status)) {
    throw { status: 400, message: "Invalid status" };
  }

  const validPriorities = ["low", "medium", "high"];
  if (priority && !validPriorities.includes(priority)) {
    throw { status: 400, message: "Invalid priority" };
  }

  const result = await database.collection("tasks").updateOne(
    {
      id: parseInt(taskId),
      userId,
    },
    {
      $set: {
        ...(name && { name }),
        ...(description && { description }),
        ...(status && { status }),
        ...(priority && { priority }),
        updatedAt: new Date(),
      },
    }
  );

  if (result.matchedCount === 0) {
    throw { status: 404, message: "Task not found" };
  }

  return { message: "Task updated successfully" };
}

async function removeTask(userId, taskId, database) {
  const result = await database.collection("tasks").deleteOne({
    id: parseInt(taskId),
    userId,
  });

  if (result.deletedCount === 0) {
    throw { status: 404, message: "Task not found" };
  }

  return { message: "Task deleted successfully" };
}

module.exports = { getAllTasks, createTask, modifyTask, removeTask };
