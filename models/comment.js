const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true
    },
    post_id: {
       type: String,
       required: true
    },
    comment_by: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Comment', commentSchema)