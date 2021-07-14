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

const achievements = mongoose.model('achievements', achievementsSchema)

module.exports = achievements