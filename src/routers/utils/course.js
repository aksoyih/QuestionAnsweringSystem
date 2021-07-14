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
        res.status(400).send(e)
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


module.exports = router