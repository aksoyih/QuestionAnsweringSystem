const mongoose = require('mongoose')

const classSchema = new mongoose.Schema({
    class_name: {
        type: String,
        required: true,
        trim: true
    },
    logo: {
        type: Buffer
    }
},{
    timestamps: true
})

const Class = mongoose.model('Class', classSchema)

module.exports = Class