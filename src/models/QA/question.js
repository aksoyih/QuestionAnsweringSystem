const mongoose = require('mongoose')

const questionsSchema = new mongoose.Schema({
    shortid:{
        type: String,
        required: true
    },
    student:{
        type: mongoose.Schema.Types.ObjectId,
        required: true ,
        ref: 'User'
    },
    course:{
        type: mongoose.Schema.Types.ObjectId,
        required: true ,
        ref: 'Courses'
    },
    class:{
        type: mongoose.Schema.Types.ObjectId,
        required: true ,
        ref: 'Classes' 
    },
    details:{
        type: String
    },
    picture:{
        type: String
    },
    audio:{
        type: String
    },
    subject:{
        type: mongoose.Schema.Types.ObjectId,
        required: true ,
        ref: 'Subjects' 
    },
    answer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Answers' 
    }
},
{
    timestamps:true
}
)

questionsSchema.methods.toJSON = function () {
    
    const question = this.toObject()

    delete question.course.createdAt
    delete question.course.updatedAt
    delete question.course.__v

    delete question.subject.course
    delete question.subject.__v

    delete question.student.tokens
    delete question.student.password
    delete question.student.class
    delete question.student.createdAt
    delete question.student.updatedAt
    delete question.student.__v
    delete question.student.__t

    delete question.class.students
    delete question.class.createdAt
    delete question.class.updatedAt
    delete question.class.__v

    if(question.answer){
        delete question.answer.createdAt
        delete question.answer.updatedAt
        delete question.answer.__v
        delete question.answer.question
    }


    delete question.__v

    if(question.picture)
        question.picture = `${process.env.DOMAIN}/questions/image/${question.shortid}`

        
    return question
}

const questions = mongoose.model('Questions', questionsSchema)

module.exports = questions