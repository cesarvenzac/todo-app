require("dotenv").config();
const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const CONNECTION_STRING = process.env.CONNECTION_STRING;
const JWT_SECRET = process.env.JWT_SECRET;
const DATABASE_NAME = "todo_app";
let database;

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.listen(5038, () => {
  MongoClient.connect(CONNECTION_STRING, (error, client) => {
    if (error) throw error;
    database = client.db(DATABASE_NAME);
    console.log("Connected to `" + DATABASE_NAME + "`!");

    database.collection("users").createIndex({ email: 1 }, { unique: true });
  });
});

app.post("/api/register", multer().none(), async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await database.collection("users").insertOne({
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/login", multer().none(), async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await database.collection("users").findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "24h",
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/tasks", authenticateToken, async (req, res) => {
  try {
    const tasks = await database.collection("tasks").find({ userId: req.user.userId }).toArray();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/add", authenticateToken, multer().none(), async (req, res) => {
  try {
    const count = await database.collection("tasks").countDocuments({});
    await database.collection("tasks").insertOne({
      id: count + 1,
      description: req.body.description,
      userId: req.user.userId,
      createdAt: new Date(),
    });
    res.json({ message: "Task added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/api/tasks/:id", authenticateToken, async (req, res) => {
  try {
    const result = await database.collection("tasks").updateOne(
      {
        id: parseInt(req.params.id),
        userId: req.user.userId,
      },
      {
        $set: {
          description: req.body.description,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ message: "Task updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/api/delete/:id", authenticateToken, async (req, res) => {
  try {
    const result = await database.collection("tasks").deleteOne({
      id: parseInt(req.params.id),
      userId: req.user.userId,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
