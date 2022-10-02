const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const commentSchema = new Schema({
    userId:{
        type: String,
        require: true
    },
    postId:{
        type: String,
        require: true
    },
    username:{
        type: String,
        require: true
    },
    post_comment:{
        type: String,
        require: true
    },
},{ timestamps: true });

const comment = mongoose.model("comment", commentSchema);

module.exports = comment;