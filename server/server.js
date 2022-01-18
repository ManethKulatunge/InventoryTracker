//creating connection to database
const app = require("./index.js");
const mongoose = require('mongoose')

let dbUrl = "";

(process.env.DB_URL)
    ? dbUrl = process.env.DB_URL
    : dbUrl = "mongodb://127.0.0.1:27017/inventory";


mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

const port = 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));