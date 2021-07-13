const mongoose = require('mongoose')
const Base = require('./base');

const Teacher = Base.discriminator('Teacher', new mongoose.Schema({
    branch: { 
        type: String, 
        required: true 
    },
    classes: [
        {
            type: String
        }
    ],
    admin:{
        type: Boolean,
        default: false
    }
  }),
);

module.exports = mongoose.model('Teacher');