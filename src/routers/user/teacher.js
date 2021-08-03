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

        var user = await Teacher.findOne({ username: temp_user.username }).populate('classes').populate('courses')

        const userObject = user.toObject()

        userObject.courses.forEach(course => {
            delete course.__v
            delete course.createdAt
            delete course.updatedAt
        })

        userObject.classes.forEach(classObj => {
            delete classObj.students
            delete classObj.createdAt
            delete classObj.updatedAt
            delete classObj.__v
        })

        delete userObject.password
        delete userObject.tokens
        delete userObject.avatar

        delete userObject.__t
        delete userObject.__v

        user = userObject

        res.status(201).send({ user, token })

    } catch (e) {
        if(e.keyPattern){
            if(e.keyPattern.username === 1 && e.code === 11000){
                return res.status(400).send({
                    error: "Email is already taken!"
                })
            }
        }else{
            res.status(400).send({error: e.message})
        }
    }
})

router.patch('/users/teacher', auth, async (req, res) => {
    const user = req.user

    const updates = Object.keys(req.body)

    const allowedUpdates = ['courses', 'classes']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))


    if (!isValidOperation) {
        return res.status(400).send({error: "Invalid updates!"})
    }

    try {
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()

        res.send(user)
    } catch (e) {
        res.status(400).send({error: e.message})
    }
})



module.exports = router