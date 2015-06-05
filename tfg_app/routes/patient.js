var express = require('express');
var router = express.Router();
var AdmZip = require('adm-zip');
var fs = require('fs');

var fileManager = require("../helpers/fileManager");
var isDicomDirectory = require("../helpers/dicomManager").isDicomDirectory;
var getDicomObject = require("../helpers/dicomManager").getDicomObject;
var Patient = require("../models/Patient");
var Image = require("../models/Image");


//Upload a study
router.post('/', function(req, res,next) {
    if(req.files.file_upload){

        var zip = new AdmZip(req.files.file_upload.path);
        //Remove all files of extracted dir
        fileManager.deleteFolderRecursive(__dirname+'/../uploads/extracted');
        zip.extractAllTo(__dirname+"/../uploads/extracted/");


        if(isDicomDirectory(__dirname+"/../uploads/extracted/")){
            //Construct object
            var dicom = getDicomObject(__dirname+"/../uploads/extracted");
            var patientsObject = dicom.patients;
            var imagesObject = dicom.images;

            //TODO NO GUARDA BIEN CON SUBDOCUMENTS

            if(patientsObject) {
                patientsObject.forEach(function (patient, index, array) {
                    //TODO Al sublevels patient, study, series

                    Patient.find({patientId: patient.patientId}, function (e, patient_doc) {
                        //No existe el paciente
                        if (patient_doc.length == 0) {

                            new Patient(patient).save(function (error, docs) {

                                if ((index >= array.length - 1) && error) {
                                    res.set(400).send(
                                        {
                                            status: "error",
                                            content: {
                                                description: error
                                            }
                                        }
                                    )
                                }
                                else{
                                    //Guardar todas las imágenes del paciente
                                    imagesObject.forEach(function(image,index,array){
                                        new Image(image).save(function(error,saved){
                                            if(index >= array.length-1){
                                                if(error){
                                                    res.status(400).send(
                                                        {
                                                            status: "error",
                                                            content: {
                                                                description: error
                                                            }
                                                        }
                                                    );
                                                }
                                                else{
                                                    fileManager.deleteFolderRecursive(__dirname + '/../uploads/extracted');
                                                    res.send(
                                                        {
                                                            status: "success",
                                                            content: {
                                                                description: "Patient/s succesfully saved"
                                                            }
                                                        }
                                                    );
                                                }
                                            }
                                        })
                                    });
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

                                        //TODO Guardar todas las imagenes del estudio
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
                                                    //TODO Guardar todas las imagenes de la serie
                                                }
                                                else {
                                                    //TODO que falle en cualquiera serie, ahora solo si es la ultima del zip
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


router.get('/:id',function(req,res){
    Patient.find({patientId: req.params.id})
        .select("patientId studies.studyId studies.series.serieId studies.series.images.imageId studies.series.images._id studies.series.images.imageId ")
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

router.get("/:patientId/study/:studyId/serie/:serieId",function(req,res){

    Patient.findOne({patientId: req.params.patientId},function(error,patient){
        var i = 0;
        while(patient.studies[i].studyId != req.params.studyId && i<patient.studies.length){
            i++;
        };
        var j=0;
        while(patient.studies[i].series[j].serieId != req.params.serieId && i<patient.studies[i].series.length){
            j++;
        }
        res.send(
            {
                status: "success",
                content: patient.studies[i].series[j]
            }

        );
    });
});

router.delete("/:patientId",function(req,res){

    Patient.remove({patientId: req.params.patientId},function(error,patient){
        //TODO remove all images

        res.send(
            {
                status: "success",
                content: {
                    description: "user removed"
                }
            }

        );
    });
});

module.exports = router;
