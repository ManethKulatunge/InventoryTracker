//creating connection to database
const app = require("./index.js");
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/inventory')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));