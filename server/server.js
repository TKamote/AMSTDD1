// Assuming you have the necessary libraries (Node.js, Express, Mongoose, dotenv, nodemon) installed

// server.js

require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

// Define a Mongoose schema for the data
const submissionSchema = new mongoose.Schema({
  image: String,
  text: String,
  severity: [String],
  intensity: [String],
  extent: [String]
});

const Submission = mongoose.model('Submission', submissionSchema);

app.use(express.static('public')); // Serve static files from the 'public' directory
app.use(express.json()); // Parse JSON requests

app.post('/submit', (req, res) => {
  // Create a new Submission object with the data from the request
  const submission = new Submission({
    image: req.body.image,
    text: req.body.text,
    severity: req.body.severity,
    intensity: req.body.intensity,
    extent: req.body.extent
  });

  // Save the submission to the database
  submission.save()
    .then(() => {
      console.log('Submission saved:', submission);
      res.sendStatus(200);
    })
    .catch(err => {
      console.error('Failed to save submission:', err);
      res.sendStatus(500);
    });
});

app.get('/submissions', (req, res) => {
  // Retrieve all submissions from the database
  Submission.find()
    .then(submissions => {
      res.json(submissions);
    })
    .catch(err => {
      console.error('Failed to retrieve submissions:', err);
      res.sendStatus(500);
    });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
