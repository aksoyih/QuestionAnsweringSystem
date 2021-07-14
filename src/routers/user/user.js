const express = require('express')
const multer = require('multer')
const sharp = require('sharp')

const auth = require('../../middleware/auth/auth')
const auth_teacher = require('../../middleware/auth/teacher')
const auth_admin = require('../../middleware/auth/admin')

const User = require('../../models/users/base')

const router = new express.Router()

const upload = multer({
    limits: {
        fileSize: 3000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }

        cb(undefined, true)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.username, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user: user, token })
    } catch (e) {
        console.log(e)
        res.status(400).send({error: e.message})
    }
})

router.post('/users/logout', auth, async (req, res) => {
    if(req.body.all){
        try {
            req.user.tokens = []
            await req.user.save()
            return res.send()
        } catch (e) {
            return res.status(500).send()
        }
    }

    console.log(req.body)
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/profile/me', auth, async (req, res) => {
    const user = req.user
    const userObject = user.toObject()

    if(userObject.__t == "Student"){
        delete userObject.class.students
        delete userObject.class.createdAt
        delete userObject.class.updatedAt
        delete userObject.class.__v
    }else{

        userObject.courses.forEach(course => {
            delete course.__v
            delete course.createdAt
            delete course.updatedAt
        })

        userObject.classes.forEach(classObj => {
            delete classObj.students
            delete classObj.createdAt
            delete classObj.updatedAt
            delete classObj.__v
        })


    }

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    delete userObject.__t
    delete userObject.__v

    res.send(userObject)
})

router.get('/profile/:username', auth_admin, async (req, res) => {
    
    const username = req.params.username;

    try {
        const user = await User.findOne({username})
        
        console.log(user)
        
        if(!user){
            return res.status(404).send()
        }

        res.send(user)

    } catch (error) {
        res.status(500).send(error)
    }

})

router.post('/profile/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()

    req.user.avatar = buffer
    await req.user.save()

    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.get('/profile/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById({_id: req.params.id})

        if(!user || !user.avatar){
            throw new Erro()
        }

        res.set('Content-Type','image/png')
        res.send(user.avatar)
    } catch (error) {
        res.status(400).send()
    }
})

router.delete('/profile/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()

    res.send()
})

module.exports = router