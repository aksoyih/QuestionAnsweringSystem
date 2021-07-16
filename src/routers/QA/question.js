const express = require('express')
const mongoose = require('mongoose')

const shortid = require('shortid')

const auth = require('../../middleware/auth/auth')

const Question = require('../../models/QA/question')

const router = new express.Router()

router.post('/questions/add', auth ,async (req, res) => {
    if(req.user.__t == "Teacher")
        res.status(401).send({error: "Only students can ask questions"})

    const question = new Question(req.body)

    question.student = req.user._id
    question.class = req.user.class._id

    const generated_shortid = shortid.generate()
    const checkShortId = await Question.findOne({shortid: generated_shortid})

        if(!checkShortId){
            question.shortid = generated_shortid
        }else{
            question.shortid = shortid.generate()
        }
    

    try {
        await req.user.checkQuota(req.body.course)
    } catch (error) {
        return res.status(400).send({error: error.message})
    }
    
    try {
        await question.save()
        
        return res.status(201).send({question})
    } catch (e) {
        return res.status(400).send({error: e.message})
    }
})

router.get('/questions/:shortid', auth, async (req, res) => {
    const shortid = req.params.shortid

    try {
        const question = await Question.find({shortid})
        .populate('course')
        .populate('subject')
        .populate('student')
        .populate('class')
        .populate('answer')

        if (Object.keys(question).length === 0) {
            return res.status(400).send({error: "Could not find question"})
        }

        res.send(question)
    } catch (error) {
        res.status(400).send({error: error.message})
    }
})

router.patch('/questions/:shortid', auth, async (req, res) => {

    const shortid = req.params.shortid

    const updates = Object.keys(req.body)

    const allowedUpdates = ['subject', 'details', 'picture', 'audio', 'answer']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))


    if (!isValidOperation) {
        return res.status(400).send("Invalid updates!")
    }

    try {
        const question = await Question.findOne({ shortid })

        if (!question) {
            throw new Error("Could not find question")
        }

        updates.forEach((update) => question[update] = req.body[update])
        await question.save()

        res.send(question)

    } catch (e) {
        res.status(400).send({error: e.message})
    }
})

router.delete('/questions/:shortid', auth, async (req, res) => {
    const shortid = req.params.shortid

    try {
        
        var question = await Question.findOne({shortid})

        if (!question) {
            return res.status(404).send({error: 'Could not find question'})
        }

        if( (question.student.toString() === req.user._id.toString()) || (req.user.admin)){
            question = await Question.findOneAndDelete({shortid})
        }else{
            return res.status(404).send({error: 'Not authorized'})
        }

        res.send(question)

    } catch (e) {
        console.log(e)
        res.status(500).send({error: e.message})
    }
})

module.exports = router