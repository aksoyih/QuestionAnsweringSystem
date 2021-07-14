const express = require('express')
const auth = require('../../middleware/auth/auth')

const Class = require('../../models/class')

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


module.exports = router