const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
    course_name: {
        type: String,
        required: true,
        trim: true
    }
})

const course = mongoose.model('Courses', courseSchema)

module.exports = course