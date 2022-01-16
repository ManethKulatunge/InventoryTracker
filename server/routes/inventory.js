const {Inventory, validate} = require('../models/inventory');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const csvwriter = require('csv-writer')
const createCsvWriter = csvwriter.createObjectCsvWriter
mongoose.set('useFindAndModify', false);

//GET /api/inventory/ : returns all the items in the database
router.get('/', async (req, res) => {
    const customers = await Inventory.find().sort('name');
    res.send(customers);
});

//GET /api/inventory/csv : creates a CSV file with item data
// and returns all the items in the database
router.get('/csv', async (req, res) => {
  const customers = await Inventory.find().sort('name');

  const csvWriter = createCsvWriter({
    path:'../final.csv',
    header: [
      {id:'_id', title: 'ID'}, 
      {id:'category', title:'Category'},
      {id:'name', title:'Name'}, 
      {id:'price', title:'Price'},
      {id:'quantity', title:'Quantity'}
    ]
  })

  csvWriter
    .writeRecords(customers)
    .then(() => console.log('Data uploaded to CSV'))

  res.send(customers);
});

//POST /api/inventory/ : create inventory items
// and adding item to database
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

//PUT /api/inventory/:id edit existing inventory items
router.put('/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(404).send('Enter a valid id');

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

//DELETE /api/inventory/:id delete existing inventory items
router.delete('/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(404).send('Enter a valid id');

  const item = await Inventory.findById(req.params.id)
  if (!item) return res.status(404).send('The item with the given ID was not found.');
  await Inventory.deleteOne({_id : req.params.id});

  res.send(item);
});

//GET /api/inventory/:id retrieve existing inventory item using id
router.get('/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(404).send('Enter a valid id');
  
  const item = await Inventory.findOne({_id:req.params.id});
  if (!item) return res.status(404).send('The customer with the given ID was not found.');
  
  res.send(item);
});

module.exports = router;