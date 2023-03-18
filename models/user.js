const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    userName: {
       type: String,
       required: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        required: true,
        type: String,
    },
    noOfFollowers: {
        type: Number,
        default: 0
    },
    noOfFollowings: {
        type: Number,
        default: 0
    },
    followedByIds: {
        type: [String],
        default: []
    },
    followingIds: {
        type: [String],
        default: []
    },
    post_ids: {
        type: [String],
        default: []
    }
})

module.exports = mongoose.model('User', UserSchema)