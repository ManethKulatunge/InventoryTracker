const Joi = require('joi');
const mongoose = require('mongoose');

const Inventory = mongoose.model('Inventory', new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  summary: {
    type: String, 
    required: false,
    maxlength: 140
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  category: {
    type:Array, 
    require:true
  }

}));

function validateInventory(inventory) {
  const schema = {
    name: Joi.string().min(5).required(),
    summary:Joi.string().max(140),
    price:Joi.number().integer().required(),
    quantity:Joi.number().integer().required(),
    category:Joi.array()
  };

  return Joi.validate(inventory, schema);
}

exports.Inventory = Inventory; 
exports.validate = validateInventory;