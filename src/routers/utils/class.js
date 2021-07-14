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
        res.status(400).send({error: error.message})
    }
})

router.get('/classes', auth, async (req, res) => {
    try {
        const classes = await Class.find({}).populate('students')
        res.send(classes)
    } catch (error) {
        res.status(400).send({error: error.message})
    }
})

router.get('/classes/:id', auth, async (req, res) => {
    try {
        const classes = await Class.findOne({ _id: req.params.id}).populate('students')

        if(!classes){
            return res.status(400).send({error: "Class not found"})
        }
        
        res.send(classes)
    } catch (error) {
        res.status(400).send({error: error.message})
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
            res.status(400).send("Class not found")
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
            res.status(404).send({error: 'Class not found'})
        }

        res.send(savedClass)
    } catch (e) {
        res.status(500).send({error: e.message})
    }
})

router.patch('/classes/:id/students', async (req, res) => {

    try {
        const savedClass = await Class.findOne({ _id: req.params.id})

        if (!savedClass) {
            return res.status(400).send("Class not found")
        }

        savedClass.students = req.body.students
        await savedClass.save()
        
        savedClass.populate('students')

        res.send(savedClass)
    } catch (error) {
        res.status(400).send({error:error.message})
    }

})

module.exports = router