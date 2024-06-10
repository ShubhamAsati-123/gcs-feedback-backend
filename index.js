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
    process.exit(1); // Exit the process if the connection fails
  });

// Routes
app.get("/", async (req, res) => {
  res.send("GCS Feedback Backend");
});

app.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).send("All fields are required.");
  }

  try {
    const inquiriesCollection = db.collection("feedback");
    await inquiriesCollection.insertOne({ name, email, message });
    res.status(200).send(`Feedback Submitted`);
  } catch (err) {
    res.status(500).send("Failed to save feedback");
  }
});

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
