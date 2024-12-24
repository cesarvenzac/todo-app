require("dotenv").config();
const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

const CONNECTION_STRING = process.env.CONNECTION_STRING;
const DATABASE_NAME = "todo_app";
let database;

app.listen(5038, () => {
  MongoClient.connect(CONNECTION_STRING, (error, client) => {
    if (error) throw error;
    database = client.db(DATABASE_NAME);
    console.log("Connected to `" + DATABASE_NAME + "`!");

    database.collection("users").createIndex({ email: 1 }, { unique: true });

    app.use("/api/auth", authRoutes(database));
    app.use("/api/tasks", taskRoutes(database));
  });
});
