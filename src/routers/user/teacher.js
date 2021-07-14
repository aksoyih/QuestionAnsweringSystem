const express = require('express')


const auth = require('../../middleware/auth/auth')
const auth_teacher = require('../../middleware/auth/teacher')

const Teacher = require('../../models/users/teacher')

const router = new express.Router()

router.post('/users/teacher/signup', async (req, res) => {
    const user = new Teacher(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
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