const mongoose = require('mongoose')
const Base = require('./base');

const Teacher = Base.discriminator('Teacher', new mongoose.Schema({
    courses: [{
        course: {type: mongoose.Schema.Types.ObjectId,
            required: true ,
            ref: 'Courses'
        }
    }],
    classes: [
        {
            class:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Classes'
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