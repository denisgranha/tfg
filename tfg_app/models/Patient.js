var mongoose = require('mongoose');

var PatientSchema = new mongoose.Schema(
    {
        patientId: String,
        studies: [
            {
                studyId: String,
                series: [
                    {
                        serieId: String,
                        images: [
                            {
                                imageId: mongoose.Schema.ObjectId
                            }
                        ]
                    }
                ]
            }
        ]
    }
);

module.exports = mongoose.model('Patient', PatientSchema);
