const express = require("express");
const { register, login } = require("../controllers/authController");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

module.exports = (database) => {
  const router = express.Router();

  router.post("/register", upload.single("avatar"), (req, res) => register(req, res, database));
  router.post("/login", multer().none(), (req, res) => login(req, res, database));

  return router;
};
