const mongoose = require('mongoose')

const achievementsSchema = new mongoose.Schema({
    achievement_name: {
        type: String,
        required: true,
        trim: true
    },
    course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Courses'
    }
})

achievementsSchema.methods.toJSON = function () {
    
    const achievement = this.toObject()

    delete achievement.createdAt
    delete achievement.updatedAt
    delete achievement.__v

    delete achievement.course._id
    delete achievement.course.createdAt
    delete achievement.course.updatedAt
    delete achievement.course.__v

    return achievement
}

const achievements = mongoose.model('achievements', achievementsSchema)

module.exports = achievements