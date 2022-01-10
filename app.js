const mongoose = require('mongoose');
const inventory= require('./routes/inventory');
const express = require('express');
const app = express();

mongoose.connect('mongodb://localhost/Yoo')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

const YoSchema = new mongoose.Schema({
    name:String
})
const Yo = mongoose.model('Yoo', YoSchema)
async function createYo() {
    const yos = new Yo({
        name:'Sup'
    })
    const result = await yos.save();
    console.log(result)
}

createYo()