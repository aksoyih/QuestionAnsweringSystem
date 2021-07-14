const express = require('express')
const auth = require('../../middleware/auth/auth')

const Class = require('../../models/classes/class')

const router = new express.Router()

router.post('/classes/add', async (req, res) => {
    const createdClass = new Class(req.body)

    try {
        await createdClass.save()
        res.status(201).send({ createdClass })
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})

router.get('/classes', auth, async (req, res) => {
    try {
        const classes = await Class.find({})
        res.send(classes)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.patch('/classes/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['class_name']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send("Invalid updates!")
    }

    try {
        const savedClass = await Class.findOne({ _id: req.params.id})

        if (!savedClass) {
            throw new Error("Could not find class")
        }

        updates.forEach((update) => savedClass[update] = req.body[update])
        await savedClass.save()
        res.send(savedClass)
    } catch (e) {
        res.status(400).send({error: e.message})
    }
})

router.delete('/classes/:id', auth, async (req, res) => {
    try {
        const savedClass = await Class.findOneAndDelete({ _id: req.params.id})

        if (!savedClass) {
            res.status(404).send({error: 'Could not find class'})
        }

        res.send(savedClass)
    } catch (e) {
        res.status(500).send({error: e.message})
    }
})


module.exports = router