const jwt = require('jsonwebtoken')

const User = require('../../models/users/base')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token }).populate('classes')

        if (!user) {
            throw new Error("Login needed")
        }
        
        if(user.__t != "Teacher"){
            throw new Error("Unauthorized")
        }

        req.token = token
        req.user = user
        next()

    } catch (e) {
        res.status(401).send({error: e.message})
    }
}

module.exports = auth