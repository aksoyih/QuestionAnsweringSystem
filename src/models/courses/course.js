const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
    course_name: {
        type: String,
        required: true,
        trim: true
    },
    quota:{
        type: Number,
        required: true,
        valide:{
            validator: function(val){
                if(val<0)
                    return false
            }
        }
    }
})

courseSchema.methods.toJSON = function () {
    
    const course = this.toObject()

    delete course.createdAt
    delete course.updatedAt
    delete course.__v

    return course
}

const course = mongoose.model('Courses', courseSchema)

module.exports = course