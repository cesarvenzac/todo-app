const express = require("express");
const { getTasks, addTask, updateTask, deleteTask } = require("../controllers/taskController");
const { authenticateToken } = require("../middlewares/authMiddleware");
const multer = require("multer");

module.exports = (database) => {
  const router = express.Router();

  router.get("/", authenticateToken, (req, res) => getTasks(req, res, database));
  router.post("/add", authenticateToken, multer().none(), (req, res) =>
    addTask(req, res, database)
  );
  router.put("/update/:id", authenticateToken, multer().none(), (req, res) =>
    updateTask(req, res, database)
  );
  router.delete("/delete/:id", authenticateToken, (req, res) => deleteTask(req, res, database));

  return router;
};
