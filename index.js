const mongoose = require('mongoose');
const inventory= require('./routes/inventory');
const express = require('express');
const app = express();
const cors = require('cors');

//creating connection to database
mongoose.connect('mongodb://localhost/inventory')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

app.use(express.json());
app.use(cors())
app.use('/api/inventory', inventory);


app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get("/", function(req, res) {
  res.send('Welcome');
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));