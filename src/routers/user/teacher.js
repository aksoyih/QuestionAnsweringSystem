const express = require('express')


const auth = require('../../middleware/auth/auth')
const auth_teacher = require('../../middleware/auth/teacher')

const Teacher = require('../../models/users/teacher')

const router = new express.Router()

router.post('/users/teacher/signup', async (req, res) => {
    var temp_user = new Teacher(req.body)

    try {
        await temp_user.save()
        const token = await temp_user.generateAuthToken()

        const user = await Teacher.findOne({ username: temp_user.username }).populate('classes.class').populate('courses.course')

        res.status(201).send({ user, token })
    } catch (e) {
        return console.log(e)
        if(e.keyPattern.username === 1 && e.code === 11000){
            return res.status(400).send({
                error: "Email is already taken!"
            })
        }
        res.status(400).send(e)
    }
})


module.exports = router