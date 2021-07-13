const mongoose = require('mongoose')
const Base = require('./base');

const Student = Base.discriminator('Student', new mongoose.Schema({
    class: { type: String, required: true },
  }),
);

module.exports = mongoose.model('Student');