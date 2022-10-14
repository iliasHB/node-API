const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const commentlikeSchema = new Schema({
    commentId:{
        type: String,
        require: true
    },
    postId:{
        type: String,
        require: true
    },
    userId:{
        type: String,
        require: true
    },
    like:{
        type: Number,
        require: true
    },
    username:{
        type: String,
        require: true
    },
},{ timestamps: true })

const CommentLike = mongoose.model('CommentLike', commentlikeSchema);

module.exports = CommentLike;