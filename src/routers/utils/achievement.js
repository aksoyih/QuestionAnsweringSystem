const express = require('express')

const auth = require('../../middleware/auth/auth')
const auth_admin = require('../../middleware/auth/admin')

const Achievement = require('../../models/courses/achievement')

const router = new express.Router()

router.post('/achievements/add', auth, async (req, res) => {
    const achievement = new Achievement(req.body)

    try {
        await achievement.save()
        res.status(201).send({ achievement })
    } catch (e) {
        res.status(400).send({error: error.message})
    }
})

router.get('/achievements', auth, async (req, res) => {
    try {
        const achievement = await Achievement.find({}).populate('course')
        res.send(achievement)
    } catch (error) {
        res.status(400).send({error: error.message})
    }
})

router.patch('/achievements/:id', auth_admin, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['achievement_name','course']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send("Invalid updates!")
    }

    try {
        const achievement = await Achievement.findOne({ _id: req.params.id})

        if (!achievement) {
            throw new Error("Could not find class")
        }

        updates.forEach((update) => achievement[update] = req.body[update])
        await achievement.save()
        res.send(achievement)
    } catch (e) {
        res.status(400).send({error: e.message})
    }
})

router.delete('/achievements/:id', auth_admin, async (req, res) => {
    try {
        const achievement = await Achievement.findOneAndDelete({ _id: req.params.id})

        if (!achievement) {
            res.status(404).send({error: 'Could not find class'})
        }

        res.send(achievement)
    } catch (e) {
        res.status(500).send({error: e.message})
    }
})


module.exports = router