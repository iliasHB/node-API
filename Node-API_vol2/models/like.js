const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const likeSchema = new Schema({
    like:{
        type: String,
        require: true
    }
},{ timestamps: true })

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;