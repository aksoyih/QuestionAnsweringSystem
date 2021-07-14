const express = require('express')
const auth = require('../../middleware/auth')

const User = require('../../models/users/base')

const router = new express.Router()

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.username, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user: user, token })
    } catch (e) {
        console.log(e)
        res.status(400).send()
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

module.exports = router