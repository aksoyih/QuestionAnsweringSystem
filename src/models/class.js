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

classSchema.methods.toJSON = function () {
    const classObject = this.toObject()

    delete classObject.createdAt
    delete classObject.updatedAt
    delete classObject.__v

    return classObject
}

const Class = mongoose.model('Classes', classSchema)

module.exports = Class