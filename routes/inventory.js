const {Inventory, validate} = require('../models/inventory');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const customers = await Inventory.find().sort('name');
    res.send(customers);
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
    let item = new Inventory({ 
        name: req.body.name,
        price:req.body.price, 
        quantity:req.body.quantity, 
        summary:req.body.summary, 
        category:req.body.category
      });
      item = await item.save();
      res.send(item);
});

router.put('/:id', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
  
    const item = await Inventory.findByIdAndUpdate(req.params.id,
      {
        name: req.body.name,
        price:req.body.price, 
        quantity:req.body.quantity, 
        summary:req.body.summary, 
        category:req.body.category
      }, { new: true });
  
    if (!item) return res.status(404).send('The item with the given ID was not found.');
    
    res.send(item);
  });

  router.delete('/:id', async (req, res) => {
    const item = await Inventory.findByIdAndRemove(req.params.id);
  
    if (!item) return res.status(404).send('The item with the given ID was not found.');
  
    res.send(item);
  });


module.exports = router;