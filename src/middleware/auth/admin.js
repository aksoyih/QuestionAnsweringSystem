const jwt = require('jsonwebtoken')

const User = require('../../masdasdodels/users/base')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        var user = await User.findOne({ _id: decoded._id, 'tokens.token': token }).populate('class')

        if(user.__t == "Teacher"){
            user = await User.findOne({ _id: decoded._id, 'tokens.token': token }).populate('classes').populate('courses')
        }
        
        if(!user.admin){
            throw new Error("You need admin permissions")
        }

        req.token = token
        req.user = user
        next()

    } catch (e) {
        res.status(401).send({error: e.message})
    }
}

module.exports = auth