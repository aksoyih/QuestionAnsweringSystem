const express = require('express')
require('./db/mongoose')

const studentRouter = require('./routers/user/student')
const teacherRouter = require('./routers/user/teacher')
const userRouter = require('./routers/user/user')

const classRouter = require('./routers/utils/class')
const courseRouter = require('./routers/utils/course')

const app = express()

app.use(express.json())

app.use(studentRouter)
app.use(teacherRouter)
app.use(userRouter)


app.use(courseRouter)
app.use(classRouter)


module.exports = app