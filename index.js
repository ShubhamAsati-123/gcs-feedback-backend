const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

let db;

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

app.get("/", (req, res) => {
  res.send("GCS Feed Back Form");
});

app.post("/submit", (req, res) => {
  const { name, email, message } = req.body;

  const inquiriesCollection = db.collection("feedback");
  inquiriesCollection
    .insertOne({ name, email, message })
    .then((result) => {
      res
        .status(200)
        .send(`FeedBack received from ${name} (${email}): ${message}`);
    })
    .catch((err) => {
      console.error("Failed to save feedback", err);
      res.status(500).send("Failed to save feedback");
    });
});

