const express = require('express')
const mongoose = require('mongoose')

const auth = require('../../middleware/auth/auth')

const Student = require('../../models/users/student')
const Class = require('../../models/classes/class')

const router = new express.Router()

router.post('/users/student/signup', async (req, res) => {
    const temp_user = new Student(req.body)

    try {
        await temp_user.save()

        const token = await temp_user.generateAuthToken()

        temp_user.addToClass()

        const user = await Student.findOne({ username: temp_user.username }).populate('class')

        res.status(201).send({ user, token })
    } catch (e) {
        if(e.keyPattern){
            if(e.keyPattern.email === 1 && e.code === 11000){
                return res.status(400).send({
                    error: "Email is already taken!"
                })
            }
        }else{
            res.status(400).send({error: e.message})
        }
    }
})

router.patch('/users/student', auth, async (req, res) => {
    const student = req.user

    const updates = Object.keys(req.body)

    const allowedUpdates = ['class']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))


    if (!isValidOperation) {
        return res.status(400).send({error: "Invalid updates!"})
    }

    const old_class = await Class.findOne({_id:student.class})

    old_class.students = old_class.students.filter(function(student) {
        return !student.equals(student._id)
    })

    const new_class = await Class.findOne({_id:req.body.class})
    new_class.students.push(student._id)

    try {
        student.class = []

        student.class = req.body.class
        
        await student.save()
        await old_class.save()
        await new_class.save()

        res.send(student)

    } catch (e) {
        res.status(400).send({error: e.message})
    }
})

module.exports = router