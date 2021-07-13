const express = require('express')
require('./db/mongoose')

const studentRouter = require('./routers/user/student')
const teacherRouter = require('./routers/user/teacher')

const app = express()

app.use(express.json())

app.use(studentRouter)
app.use(teacherRouter)


module.exports = app