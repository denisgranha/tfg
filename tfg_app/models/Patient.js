var mongoose = require('mongoose');

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

var SerieSchema = new mongoose.Schema(
    {
        serieId: String,
        images: [ImageSchema]
    }
);

var StudySchema = new mongoose.Schema(
    {
        studyId: String,
        series: [SerieSchema]
    }
);

var PatientSchema = new mongoose.Schema(
    {
        patientId: String,
        studies: [StudySchema]
    }
);

module.exports = mongoose.model('Study', StudySchema);
module.exports = mongoose.model('Serie', SerieSchema);
module.exports = mongoose.model('Image', ImageSchema);
module.exports = mongoose.model('Patient', PatientSchema);