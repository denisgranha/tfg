var express = require('express');
var router = express.Router();
var AdmZip = require('adm-zip');
var fs = require('fs');

var fileManager = require(__dirname + "/../helpers/fileManager");
var isDicomDirectory = require(__dirname+"/../helpers/dicomManager").isDicomDirectory;
var getDicomObject = require(__dirname+"/../helpers/dicomManager").getDicomObject;
var Patient = require("../models/Patient");


//Upload a study
router.post('/', function(req, res,next) {
    if(req.files.file_upload){

        var zip = new AdmZip(req.files.file_upload.path);
        //Remove all files of extracted dir
        fileManager.deleteFolderRecursive(__dirname+'/../uploads/extracted');
        zip.extractAllTo(__dirname+"/../uploads/extracted/");


        if(isDicomDirectory(__dirname+"/../uploads/extracted/")){
            //Construct object
            var dicomObject = getDicomObject(__dirname+"/../uploads/extracted");

            //TODO NO GUARDA BIEN CON SUBDOCUMENTS

            if(dicomObject) {
                dicomObject.forEach(function (patient, index, array) {
                    //TODO Al sublevels patient, study, series

                    Patient.find({patientId: patient.patientId}, function (e, patient_doc) {
                        //No existe el paciente
                        if (patient_doc.length == 0) {

                            new Patient(patient).save(function (error, docs) {
                                if(error){
                                    res.set(400).send(
                                        {
                                        status: "error",
                                        content: {
                                            description: error
                                            }
                                        }
                                    )
                                }
                                else if (index >= array.length - 1) {
                                    fileManager.deleteFolderRecursive(__dirname + '/../uploads/extracted');
                                    res.send(
                                        {
                                            status: "success"
                                        }
                                    );
                                }
                            });
                        }
                        else {
                            patient.studies.forEach(function (study) {
                                //Existe el paciente, comprobamos si tiene datos del mismo estudio o serie
                                Patient.find({"studies.studyId": study.studyId}, function (e, doc) {
                                    if (doc.length == 0) {
                                        //No tiene este estudio
                                        //TODO UPDATE
                                    }
                                    else {
                                        //miramos si tiene la misma serie
                                        study.series.forEach(function (serie, index, array) {
                                            Patient.find({"studies.series.serieId": serie.serieId}, function (e, serie_doc) {

                                                if (serie_doc.length == 0) {
                                                    //No tiene esta serie


                                                    if (index >= array.length - 1) {
                                                        res.send({
                                                            status: "success"
                                                        });
                                                    }                              //TODO UPDATE
                                                }
                                                else {
                                                    //TODO falle en cualquiera
                                                    //serie existente manda error
                                                    if (index >= array.length - 1) {
                                                        res.status(400).send({
                                                            status: "error",
                                                            content: {
                                                                description: "serie already exists",
                                                                error_code: "existing_serie"
                                                            }
                                                        })
                                                    }

                                                }
                                            })
                                        });

                                    }
                                });
                            });

                        }
                    });
                });
            }
            else{
                res
                    .status(400)
                    .send(
                    {
                        status: "error",
                        content: {
                            description: "Zip file malformed",
                            error_code: "file_malformed"
                        }
                    }
                )
            }


        }
        else {

            fileManager.deleteFolderRecursive(__dirname+'/../uploads/extracted');
            //If we are here the zip file is malformed
            res
                .status(400)
                .send(
                {
                    status: "error",
                    content: {
                        description: "Zip file malformed",
                        error_code: "file_malformed"
                    }
                }
            );
        }




    }
    else{
        res.status(400).send(
            {
                status : "error",
                content: {
                    description : "Request without file",
                    error_code: "file_needed"
                }
            }
        );
    }


});

router.get('/', function(req, res,next) {
    Patient.find({})
        .select("patientId studies.studyId studies.series.serieId")
        .exec(function(e,docs){
       res.send(
           {
               status: "success",
               content: {
                   patients: docs
               }
           }
       );
    });
});

router.param('id', function(req,res,next,id){
    req.params.id = id;
    next();
});
router.get('/:id',function(req,res){
    Patient.find({patientId: req.params.id})
        .select("patientId studies.studyId studies.series.serieId studies.series.images.imageId studies.series.images._id")
        .exec(function(e,docs){
            res.send(
                {
                    status: "success",
                    content: {
                        patients: docs
                    }
                }
            );
        });
});

module.exports = router;
