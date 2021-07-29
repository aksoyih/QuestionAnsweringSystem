const express = require('express')
const shortid = require('shortid')
const multer = require('multer')
const fs = require('fs')
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)

const auth = require('../../middleware/auth/auth')
const auth_teacher = require('../../middleware/auth/teacher')
const auth_admin = require('../../middleware/auth/admin')

const {uploadFile, getFile, deleteFile} = require('../../utils/s3')

const Answer = require('../../models/QA/answer')
const Question = require('../../models/QA/question')

const router = new express.Router()

const upload = multer({
    dest: '/uploads/answers/'
})

router.post('/answers/add', upload.single('picture'), auth_teacher ,async (req, res) => {
    const answer = new Answer(req.body)
    const question = await Question.findById(req.body.question)

    answer.teacher = req.user._id

    const generated_shortid = shortid.generate()
    const checkShortId = await Answer.findOne({shortid: generated_shortid})

        if(!checkShortId){
            answer.shortid = generated_shortid
        }else{
            answer.shortid = shortid.generate()
        }

        var result
        try {
        if(req.file){
                result = await uploadFile(req.file, "answers")
                await unlinkFile(req.file.path)
                
                answer.picture = result.key
            }
        } catch (error) {
            console.log(error)
            return res.status(400).send({error: error.message})
        }

    try {
        await answer.save()
        question.answer = answer._id

        await question.save()

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

router.get('/answers/image/:shortid' ,async (req, res) => {
    const shortid = req.params.shortid
    
    try {
        const answer = await Answer.findOne({shortid})

        if (!answer) {
            return res.status(400).send({error: "Could not find answer"})
        }

        const picture_key = answer.picture

        const readStream = getFile(picture_key, "answers")

        res.set('Content-Type','image/png')
        readStream.pipe(res)
    } catch (error) {
        console.log(error)
    }

})

router.patch('/answers/:shortid', upload.single('picture'), auth_teacher, async (req, res) => {

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

        if((answer.teacher != req.user._id) && !(req.user.admin)){
            throw new Error("No permissions to delete this answer")
        }

        updates.forEach((update) => answer[update] = req.body[update])
        
        if(answer.picture){
            try {
                result = await deleteFile(answer.picture)
            } catch (error) {
                return res.status(404).send({error: error.message})
            }
        }

        var result

        try {
        if(req.file){
            result = await uploadFile(req.file, "answers")
            answer.picture = result.key
            }
        } catch (error) {
            return res.status(400).send({error: error.message})
        }
        
        
        
        await answer.save()
        res.send(answer)

    } catch (e) {
        res.status(400).send({error: e.message})
    }
})

router.delete('/answers/:shortid', auth_admin, async (req, res) => {
    const shortid = req.params.shortid

    try {
        const answer = await Answer.findOneAndDelete({shortid})

        if (!answer) {
            return res.status(404).send({error: 'Could not find answer'})
        }

        if(answer.picture){
            try {
                const result = await deleteFile(answer.picture)
            } catch (error) {
                return res.status(404).send({error: error.message})
            }
        }

        res.send(answer)
    } catch (e) {
        res.status(500).send({error: e.message})
    }
})

module.exports = router