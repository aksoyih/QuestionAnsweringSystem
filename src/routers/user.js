const express = require('express')
const auth = require('../middleware/auth')

const User = require('../models/user')

const Student = require('../models/users/student')
const Teacher = require('../models/users/teacher')

const router = new express.Router()

router.post('/user/signup', async (req, res) => {
    const student = new Teacher(req.body)
    try {
        await student.save()
        const token = await student.generateAuthToken()
        res.status(201).send({ student, token })
    } catch (e) {
        if(e.keyPattern.email === 1 && e.code === 11000){
            return res.status(400).send({
                error: "Email is already taken!"
            })
        }
        res.status(400).send(e)
    }
})


module.exports = router