const mongoose = require('mongoose')
const Base = require('./base');

const Student = Base.discriminator('Student', new mongoose.Schema({
    class: { 
      type: mongoose.Schema.Types.ObjectId,
      required: true ,
      ref: 'Classes'
    },
  }),
);

module.exports = mongoose.model('Student');