var mongoose = require('mongoose');
var mongooseFS = require('mongoose-fs');

var ImageSchema = new mongoose.Schema(
    {
        imageId: mongoose.Schema.ObjectId,
        imageName: String,
        studyId: String,
        serieId: String,
        headers: [
            {
                tag: String,
                value: String
            }
        ],
        image: Buffer// De esto se encarga GridFS
    }
);

ImageSchema.plugin(mongooseFS, {keys: ['image'], mongoose: mongoose});

module.exports = mongoose.model('Image', ImageSchema);