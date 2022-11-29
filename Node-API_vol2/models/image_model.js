const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = Schema({
    name: {
        type: String,
        required: true
    },
    Image: {
        data:Buffer,
        contentType: String
    }
})

const imageUpload = mongoose.model('imageUpload', ImageSchema);

module.exports = imageUpload;

//module.exports = ImageModel = mongoose.model('ImageModel', ImageSchema)