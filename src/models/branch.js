const mongoose = require('mongoose')

const branchSchema = new mongoose.Schema({
    branch_name: {
        type: String,
        required: true,
        trim: true
    }
},{
    timestamps: true
})

const branch = mongoose.model('Branches', branchSchema)

module.exports = branch