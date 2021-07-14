const express = require('express')

const auth = require('../../middleware/auth/auth')

const Student = require('../../models/users/student')

const router = new express.Router()

router.post('/users/student/signup', async (req, res) => {
    const temp_user = new Student(req.body)
    try {
        await temp_user.save()
        const token = await temp_user.generateAuthToken()

        const user = await Student.findOne({ username: temp_user.username }).populate('classes')

        res.status(201).send({ user, token })
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