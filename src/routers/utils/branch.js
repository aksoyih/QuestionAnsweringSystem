const express = require('express')
const auth = require('../../middleware/auth/auth')

const Branch = require('../../models/branch')

const router = new express.Router()

router.post('/branches/add', auth ,async (req, res) => {
    const branch = new Branch(req.body)

    try {
        await branch.save()
        res.status(201).send({branch})
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/branches', auth, async (req, res) => {
    try {
        const branches = await Branch.find({})
        res.send(branches)
    } catch (error) {
        res.status(400).send({error: error.message})
    }
})


module.exports = router