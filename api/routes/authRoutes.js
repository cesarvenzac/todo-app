const express = require("express");
const { register, login } = require("../controllers/authController");
const multer = require("multer");

module.exports = (database) => {
  const router = express.Router();

  router.post("/register", multer().none(), (req, res) => register(req, res, database));
  router.post("/login", multer().none(), (req, res) => login(req, res, database));

  return router;
};
