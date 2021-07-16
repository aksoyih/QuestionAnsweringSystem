const mongoose = require('mongoose')
const Base = require('./base');
const Course = require('../courses/course')
const Question = require('../QA/question')

const studentSchema = new mongoose.Schema({
    class: { 
      type: mongoose.Schema.Types.ObjectId,
      required: true ,
      ref: 'Classes'
    },
})

studentSchema.methods.checkQuota = async function (course_id) {
  const course = await Course.findOne({_id: mongoose.Types.ObjectId(course_id)})
  const quota = course.quota


  var start = new Date();
  start.setHours(0,0,0,0);

  var end = new Date();
  end.setHours(23,59,59,999);

  const nQuestions = await Question.countDocuments({
    createdAt: {$gte: start, $lt: end},
    student: this._id
  })
  
  if(nQuestions+1 > quota){
    throw new Error("Quota exceeded")
  }
}

const Student = Base.discriminator('Student', studentSchema);

module.exports = mongoose.model('Student');