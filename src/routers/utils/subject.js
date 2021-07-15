const express = require('express')
const mongoose = require('mongoose')

const auth = require('../../middleware/auth/auth')

const Subject = require('../../models/courses/subject')

const router = new express.Router()

router.post('/subjects/add', auth ,async (req, res) => {
    const subject = new Subject(req.body)

    try {
        await subject.save()
        res.status(201).send({subject})
    } catch (e) {
        res.status(400).send({error: e.message})
    }
})

router.get('/subjects/:course_id', auth, async (req, res) => {
    const course_id = req.params.course_id

    try {
        const subject = await Subject.find({course: course_id}).populate('course')
        res.send(subject)
    } catch (error) {
        res.status(400).send({error: error.message})
    }
})

router.patch('/subjects/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['subject', 'course']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))


    if (!isValidOperation) {
        return res.status(400).send("Invalid updates!")
    }

    try {
        const subject = await Subject.findOne({ _id: req.params.id})

        if (!subject) {
            throw new Error("Could not find course")
        }

        updates.forEach((update) => subject[update] = req.body[update])
        await subject.save()

        res.send(subject)

    } catch (e) {
        res.status(400).send({error: e.message})
    }
})

router.delete('/subjects/:id', auth, async (req, res) => {
    try {
        const subject = await Subject.findOneAndDelete({ _id: req.params.id})

        if (!subject) {
            res.status(404).send({error: 'Could not find subject'})
        }

        res.send(subject)
    } catch (e) {
        res.status(500).send({error: e.message})
    }
})

module.exports = router