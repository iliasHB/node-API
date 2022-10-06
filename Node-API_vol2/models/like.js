const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const likeSchema = new Schema({
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

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;