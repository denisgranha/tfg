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
                                imageId: String
                            }
                        ]
                    }
                ]
            }
        ]
    }
);

module.exports = mongoose.model('Patient', PatientSchema);
