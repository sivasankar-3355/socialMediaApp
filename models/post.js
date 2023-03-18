const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    comment_ids: {
      type: [String],
      default: []
    },
    likes: {
       type: Number,
       default: 0
    },
    created_by_id: {
      type: String,
      required: true
    },
    liked_by: {
        type: [String],
        default: []
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Post', PostSchema)