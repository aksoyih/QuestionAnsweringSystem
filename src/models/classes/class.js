const mongoose = require('mongoose')

const classSchema = new mongoose.Schema({
    class_name: {
        type: String,
        required: true,
        trim: true
    },
    logo: {
        type: Buffer
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
},{
    timestamps: true
})

classSchema.methods.toJSON = function () {
    const classObject = this.toObject()

    delete classObject.createdAt
    delete classObject.updatedAt
    delete classObject.__v

    classObject.students.forEach(student => {
        delete student.__t
        delete student.__v
        delete student.tokens
        delete student.password
        delete student.createdAt
        delete student.updatedAt
        delete student.class
    });

    return classObject}

const Class = mongoose.model('Classes', classSchema)

module.exports = Class