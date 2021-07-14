const express = require('express')

const auth = require('../../middleware/auth/auth')

const Student = require('../../models/users/student')

const router = new express.Router()

router.post('/users/student/signup', async (req, res) => {
    const user = new Student(req.body)
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