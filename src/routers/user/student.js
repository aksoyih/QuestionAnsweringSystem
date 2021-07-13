const express = require('express')
const auth = require('../../middleware/user_auth/student')

const Student = require('../../models/users/student')

const router = new express.Router()

router.post('/users/student/signup', async (req, res) => {
    const student = new Student(req.body)
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