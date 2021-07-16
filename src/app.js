const express = require('express')
require('./db/mongoose')

const helmet = require("helmet");
const morgan = require('morgan')

const studentRouter = require('./routers/user/student')
const teacherRouter = require('./routers/user/teacher')
const userRouter = require('./routers/user/user')

const classRouter = require('./routers/utils/class')
const courseRouter = require('./routers/utils/course')
const achievementRouter = require('./routers/utils/achievement')
const subjectRouter = require('./routers/utils/subject')

const questionRouter = require('./routers/QA/question')
const answerRouter = require('./routers/QA/answer')


const app = express()

app.use(express.json())
app.use(helmet())
app.use(morgan('tiny'))

app.use(studentRouter)
app.use(teacherRouter)
app.use(userRouter)

app.use(questionRouter)
app.use(answerRouter)

app.use(courseRouter)
app.use(classRouter)
app.use(achievementRouter)
app.use(subjectRouter)


module.exports = app