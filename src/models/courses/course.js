const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
    course_name: {
        type: String,
        required: true,
        trim: true
    },
    quota:{
        type: Number,
        valide:{
            validator: function(val){
                if(val<0)
                    return false
            }
        },
        default: 10
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