const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const postSchema = new Schema({
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
    postBody:{
        type: String,
        require: true
    },
},{ timestamps: true });

const userPost = mongoose.model("userPost", postSchema);

module.exports = userPost;