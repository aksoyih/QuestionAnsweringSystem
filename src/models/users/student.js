const mongoose = require('mongoose')
const Base = require('./base');

const studentSchema = new mongoose.Schema({
    class: { 
      type: mongoose.Schema.Types.ObjectId,
      required: true ,
      ref: 'Classes'
    },
})

const Student = Base.discriminator('Student', studentSchema);

module.exports = mongoose.model('Student');