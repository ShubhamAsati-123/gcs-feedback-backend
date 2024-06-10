const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());

let db;

// MongoDB connection
const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client
  .connect()
  .then(() => {
    db = client.db();
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

// Routes
app.get("/", (req, res) => {
  res.send("GCS Feedback Backend");
});

app.post("/", (req, res) => {
  const { name, email, message } = req.body;

  // Save to MongoDB
  const inquiriesCollection = db.collection("feedback");
  inquiriesCollection
    .insertOne({ name, email, message })
    .then((result) => {
      res
        .status(200)
        .send(`Feedback from ${name} (${email}): ${message}`);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

