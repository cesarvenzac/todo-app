require("dotenv").config();
var express = require("express");
var MongoClient = require("mongodb").MongoClient;
var cors = require("cors");
var bodyParser = require("body-parser");
const multer = require("multer");

var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var CONNECTION_STRING = process.env.CONNECTION_STRING;

var DATABASE_NAME = "todo_app";
var database;

app.listen(5038, () => {
  MongoClient.connect(CONNECTION_STRING, (error, client) => {
    if (error) {
      throw error;
    }
    database = client.db(DATABASE_NAME);
    console.log("Connected to `" + DATABASE_NAME + "`!");
  });
});

app.get("/api/tasks", (request, response) => {
  database
    .collection("tasks")
    .find({})
    .toArray((error, result) => {
      if (error) {
        return response.status(500);
      }
      response.send(result);
    });
});

app.post("/api/add", multer().none(), (request, response) => {
  database.collection("tasks").count({}, (error, count) => {
    if (error) {
      return response.status(500);
    }
    database.collection("tasks").insertOne({
      id: count + 1,
      description: request.body.description,
    });
    response.json("Task added");
  });
});

app.delete("/api/delete/:id", (request, response) => {
  database.collection("tasks").deleteOne({ id: parseInt(request.params.id) }, (error, result) => {
    if (error) {
      return response.status(500);
    }
    response.json("Task deleted");
  });
});
