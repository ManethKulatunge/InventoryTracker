const Joi = require('joi');
const mongoose = require('mongoose');

const Inventory = mongoose.model('Inventory', new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  }
}));

function validateInventory(inventory) {
  const schema = {
    name: Joi.string().min(5).required()
  };

  return Joi.validate(inventory, schema);
}

exports.Inventory = Inventory; 
exports.validate = validateInventory;