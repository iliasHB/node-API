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

const ImageModel = mongoose.model('ImageModel', ImageSchema);

module.exports = ImageModel;

//module.exports = ImageModel = mongoose.model('ImageModel', ImageSchema)