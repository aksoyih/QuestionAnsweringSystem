const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Class = require('../classes/class')

const baseOptions = {
  discriminatorKey: 'itemtype', // our discriminator key, could be anything
  collection: 'users', // the name of our collection
};

const baseSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    name:{
        type:String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
    }, {
    timestamps: true
    },baseOptions,
  )

baseSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

baseSchema.methods.generateAuthToken = async function () {
    const user = this

    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

baseSchema.methods.addToClass = async function () {
    const user = this
    const class_id = user.class

    const given_class = await Class.findOne({ _id: class_id })

    if(given_class.students.includes(user._id)){
        return console.log('exists')
    }else{
        given_class.students.push(mongoose.Types.ObjectId(user._id))
    }

    given_class.save()
}


baseSchema.statics.findByCredentials = async (username, password) => {    

    var user = await Base.findOne({ username })


    if (!user) {
        throw new Error('Unable to login')
    }

    
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    if(user.__t == "Teacher"){
        user = await Base.findOne({ username }).populate('classes').populate('courses')
    }else{
        user = await Base.findOne({ username }).populate('classes')
    }

    return user
}

// Hash the plain text password before saving
baseSchema.pre('save', async function (next) {
    //console.log("pre save initiated")

    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})


const Base = mongoose.model('User', baseSchema)

module.exports = mongoose.model('User');