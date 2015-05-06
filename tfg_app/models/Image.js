var mongoose = require('mongoose');
var mongooseFS = require('mongoose-fs');

var ImageSchema = new mongoose.Schema(
    {
        imageId: String,
        headers: [
            {
                tag: String,
                value: String
            }
        ],
        image: Buffer
    }
);

ImageSchema.plugin(mongooseFS, {keys: ['image'], mongoose: mongoose});

module.exports = mongoose.model('Image', ImageSchema);