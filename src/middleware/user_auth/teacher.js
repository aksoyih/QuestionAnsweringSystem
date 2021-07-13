const jwt = require('jsonwebtoken')
const Teacher = require('../../models/users/teacher')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await Teacher.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!user) {
            console.log('user not found?')
            throw new Error()
        }

        req.token = token
        req.user = user
        next()

    } catch (e) {

        res.status(401).send({ error: e })
    }
}

module.exports = auth