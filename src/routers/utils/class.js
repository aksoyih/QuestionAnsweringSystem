const express = require('express')
const auth = require('../../middleware/user_auth/teacher')

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


module.exports = router