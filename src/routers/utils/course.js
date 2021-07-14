const express = require('express')
const auth = require('../../middleware/auth/auth')

const Course = require('../../models/courses/course')

const router = new express.Router()

router.post('/courses/add', auth ,async (req, res) => {
    const course = new Course(req.body)

    try {
        await course.save()
        res.status(201).send({course})
    } catch (e) {
        res.status(400).send({error: error.message})
    }
})

router.get('/courses', auth, async (req, res) => {
    try {
        const courses = await Course.find({})
        res.send(courses)
    } catch (error) {
        console.log(error)
        res.status(400).send({error: error.message})
    }
})

router.patch('/courses/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['course_name']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))


    if (!isValidOperation) {
        return res.status(400).send("Invalid updates!")
    }

    try {
        const course = await Course.findOne({ _id: req.params.id})

        if (!course) {
            throw new Error("Could not find course")
        }

        updates.forEach((update) => course[update] = req.body[update])
        await course.save()
        res.send(course)

    } catch (e) {
        res.status(400).send({error: e.message})
    }
})

router.delete('/courses/:id', auth, async (req, res) => {
    try {
        const course = await Course.findOneAndDelete({ _id: req.params.id})

        if (!course) {
            res.status(404).send({error: 'Could not find course'})
        }

        res.send(course)
    } catch (e) {
        res.status(500).send({error: e.message})
    }
})


module.exports = router