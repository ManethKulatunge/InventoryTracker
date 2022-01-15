const inventory= require('./routes/inventory');
const express = require('express');
const app = express();
const mongoose = require('mongoose');

app.use(express.json());
app.use('/api/inventory', inventory);

module.exports = app;