const express = require('express')
const shortid = require('shortid')

const auth = require('../../middleware/auth/auth')
const Answer = require('../../models/QA/answer')

const router = new express.Router()

router.post('/answers/add', auth ,async (req, res) => {
    const answer = new Answer(req.body)

    answer.teacher = req.user._id

    const generated_shortid = shortid.generate()
    const checkShortId = await Answer.findOne({shortid: generated_shortid})

        if(!checkShortId){
            answer.shortid = generated_shortid
        }else{
            answer.shortid = shortid.generate()
        }

    try {
        await answer.save()

        res.status(201).send({answer})
    } catch (e) {
        res.status(400).send({error: e.message})
    }
})

router.get('/answers/:shortid', auth, async (req, res) => {
    const shortid = req.params.shortid

    try {
        const answer = await Answer.find({shortid})
        .populate('question')
        .populate('teacher')
        
        if (Object.keys(answer).length === 0) {
            return res.status(400).send({error: "Could not find answer"})
        }

        res.send(answer)
    } catch (error) {
        res.status(400).send({error: error.message})
    }
})

router.patch('/answers/:shortid', auth, async (req, res) => {

    const shortid = req.params.shortid

    const updates = Object.keys(req.body)

    const allowedUpdates = ['subject', 'details', 'picture', 'audio']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))


    if (!isValidOperation) {
        return res.status(400).send("Invalid updates!")
    }

    try {
        const answer = await Answer.findOne({ shortid })

        if (!answer) {
            throw new Error("Could not find answer")
        }

        updates.forEach((update) => answer[update] = req.body[update])
        await answer.save()

        res.send(answer)

    } catch (e) {
        res.status(400).send({error: e.message})
    }
})

router.delete('/answers/:shortid', auth, async (req, res) => {
    const shortid = req.params.shortid

    try {
        const answer = await Answer.findOneAndDelete({shortid})

        if (!answer) {
            return res.status(404).send({error: 'Could not find answer'})
        }

        res.send(answer)
    } catch (e) {
        res.status(500).send({error: e.message})
    }
})

module.exports = router