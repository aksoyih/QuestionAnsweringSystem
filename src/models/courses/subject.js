const mongoose = require('mongoose')

const subjectsSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true,
        trim: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Courses',
        required: true
    }
})

subjectsSchema.methods.toJSON = function () {
    
    const subject = this.toObject()

    
    delete subject.__v
    delete subject.course.createdAt
    delete subject.course.updatedAt
    delete subject.course.__v


    return subject
}

const subjects = mongoose.model('Subjects', subjectsSchema)

module.exports = subjects