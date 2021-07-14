const mongoose = require('mongoose')
const Base = require('./base');

const Teacher = Base.discriminator('Teacher', new mongoose.Schema({
    branch: { 
      type: mongoose.Schema.Types.ObjectId,
      required: true ,
      ref: 'Branches'
    },
    classes: [
        {
            class:{
                type: String
            }
        }
    ],
    admin:{
        type: Boolean,
        default: false
    }
  }),
);

module.exports = mongoose.model('Teacher');