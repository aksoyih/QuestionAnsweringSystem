const mongoose = require('mongoose')

const answersSchema = new mongoose.Schema({
    shortid:{
        type: String,
        required: true
    },
    teacher:{
        type: mongoose.Schema.Types.ObjectId,
        required: true ,
        ref: 'User'
    },
    details:{
        type: String
    },
    picture:{
            type:String
    },
    audio:{
            type:String
    },
    question:{
        type: mongoose.Schema.Types.ObjectId,
        required: true ,
        ref: 'Questions' 
    },
    difficulty:{
        type: Number,
        valide:{
            validator: function(val){
                if(val>5 || val < 1)
                    return false
            }
        }
    }
},
{
    timestamps:true
}
)

answersSchema.methods.toJSON = function () {
    
    const answer = this.toObject()

    delete answer.teacher.courses
    delete answer.teacher.classes
    delete answer.teacher.admin
    delete answer.teacher.tokens
    delete answer.teacher.createdAt
    delete answer.teacher.updatedAt
    delete answer.teacher.__v
    delete answer.teacher.__t
    delete answer.teacher.password
    delete answer.teacher.avatar
    
    if(answer.picture)
        answer.picture = `${process.env.DOMAIN}/answers/image/${answer.shortid}`

    return answer
}

const answers = mongoose.model('Answers', answersSchema)

module.exports = answers