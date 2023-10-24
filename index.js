const express = require('express');
const app = express();
const cors = require('cors');

const mongoose = require('mongoose');
const port = 3001;
app.use(cors({
  origin: '*'
}));

app.use(express.json());
const stockPrice = require('./routes/index.js');

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

app.get("/messages", (req, res) => {
  res.send("Hello");
});

app.use(stockPrice);

app.get("/:universalURL", (req, res) => {
  res.status(404).send("Given URL NOT FOUND");
});

// MongoDb Connectivity
const dbURL = 'mongodb://127.0.0.1:27017/StockMarketPrice';

mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));
