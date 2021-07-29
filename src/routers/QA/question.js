const express = require('express')
const shortid = require('shortid')
const multer = require('multer')
const fs = require('fs')
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)

const auth = require('../../middleware/auth/auth')
const Question = require('../../models/QA/question')
const {uploadFile, getFile, deleteFile} = require('../../utils/s3')

const router = new express.Router()

const upload = multer({
    dest: '/uploads/question/'
})

router.post('/questions/add', upload.single('picture'), auth ,async (req, res) => {
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
    

    var result
    try {
        if(req.file){
            result = await uploadFile(req.file, "questions")
            console.log(result)
            question.picture = result.key
            await unlinkFile(req.file.path)
        }
    } catch (error) {
        console.log(error)
        return res.status(400).send({error: error.message})
    }

    try {
        await question.save()

        return res.status(201).send({question})
    } catch (e) {
        return res.status(400).send({error: e.message})
    }
})

router.get('/questions/image/:shortid' ,async (req, res) => {
    const shortid = req.params.shortid
    
    try {
        const question = await Question.findOne({shortid})

        if (!question) {
            return res.status(400).send({error: "Could not find question"})
        }

        const picture_key = question.picture

        const readStream = getFile(picture_key, "questions")

        res.set('Content-Type','image/png')
        readStream.pipe(res)
    } catch (error) {
        console.log(error)
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

router.patch('/questions/:shortid', upload.single('picture'), auth, async (req, res) => {

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

        var result

        if(question.picture){
            try {
                result = await deleteFile(question.picture)
            } catch (error) {
                return res.status(404).send({error: error.message})
            }
        }

        if(req.file){
            try {
                if(req.file){
                    result = await uploadFile(req.file, "questions")
                    question.picture = result.key
                }
            } catch (error) {
                console.log(error)
                return res.status(400).send({error: error.message})
            }
        }

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

        if(question.picture){
            try {
                const result = await deleteFile(question.picture)
            } catch (error) {
                return res.status(404).send({error: error.message})
            }
        }
        res.send(question)

    } catch (e) {
        console.log(e)
        res.status(500).send({error: e.message})
    }
})

module.exports = router