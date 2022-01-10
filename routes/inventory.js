const {Inventory, validate} = require('../models/inventory');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
    console.log(error)

    let item = new Inventory({ 
        name: req.body.name,
      });
      item = await item.save();
      
      res.send(item);
});

router.get('/', async (req, res) => {
    const customers = await Inventory.find().sort('name');
    res.send(customers);
});
  

module.exports = router;