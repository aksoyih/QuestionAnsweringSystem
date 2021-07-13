const express = require('express')
require('./db/mongoose')

const studentRouter = require('./routers/user/student')
const teacherRouter = require('./routers/user/teacher')

const classRouter = require('./routers/utils/class')

const app = express()

app.use(express.json())

app.use(studentRouter)
app.use(teacherRouter)
app.use(classRouter)


module.exports = app