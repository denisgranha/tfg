/**
 * Created by anger on 13/4/15.
 */

var fileManager = require("./fileManager");
var fs = require('fs');
var dicomParser = require('../node_modules/dicom-parser/dist/dicomParser');

var isDicomDirectory = function(path) {

    try {
        //For MACOSX systems
        fileManager.deleteFolderRecursive(path + "__MACOSX");
        fileManager.deleteFolderRecursive(path + ".DS_Store");

        var patients = fs.readdirSync(path);

        if (patients.length == 0) {
            return false;
        }

        path += patients[0];
        var patient_dir = fs.statSync(path);


        if (patient_dir.isDirectory()) {

            path += "/";

            fileManager.deleteFolderRecursive(path + "__MACOSX");
            fileManager.deleteFolderRecursive(path + ".DS_Store");

            var selected_study = 0;
            var studies = fs.readdirSync(path);

            while (selected_study < studies.length && (studies[selected_study][0] == "_" || studies[selected_study][0] == ".")) {
                fileManager.deleteFolderRecursive(path + studies[selected_study]);
                selected_study++;
            }
            if (selected_study == studies.length)
                return false;

            path += studies[selected_study];
            var study_dir = fs.statSync(path);


            if (studies.length > 0 && study_dir.isDirectory()) {
                path += "/";
                fileManager.deleteFolderRecursive(path + ".DS_Store");

                var series = fs.readdirSync(path);
                var series_dir = fs.statSync(path);

                var have_images = true;

                for(var series_index=0; series_index < series.length;series_index++ ){
                    fileManager.deleteFolderRecursive(path +series[series_index]+"/.DS_Store");
                    var dir = fs.statSync(path +series[series_index]);

                    if(!dir.isDirectory() || dir.length == 0 ){
                        have_images = false;
                    }
                };

                if (series.length > 0 && have_images) {
                    //Podría darse el caso de que no tenga ficheros .dcm la carpeta de series

                    return true;
                }
                else
                    return false;
            }
        }

        return false;
    }
    catch(e){
        return false;
    }
};


function getDicomObject(path){
    var result = [];

    var patients = fs.readdirSync(path);

    try {
        for (var i = 0; i < patients.length; i++) {

            var studies = fs.readdirSync(path + "/" + patients[i]);
            var studies_object = []
            for (var j = 0; j < studies.length; j++) {
                var series = fs.readdirSync(path + "/" + patients[i] + "/" + studies[j])
                var series_object = [];

                for (var k = 0; k < series.length; k++) {
                    var images = fs.readdirSync(path + "/" + patients[i] + "/" + studies[j] + "/" + series[k]);
                    var images_object = [];

                    for (var w = 0; w < images.length; w++) {
                        var filePath = path + "/" + patients[i] + "/" + studies[j] + "/" + series[k] + "/" + images[w];
                        var dicomFileAsBuffer = fs.readFileSync(filePath);
                        var dicomFileAsByteArray = new Uint8Array(dicomFileAsBuffer);

                        var dataSet = dicomParser.parseDicom(dicomFileAsByteArray);

                        var headers = [];

                        for (var element in dataSet.elements) {
                            headers.push(
                                {
                                    tag: dataSet.elements[element].tag,
                                    value: dataSet.string(element)
                                }
                            )
                        }
                        ;


                        images_object.push(
                            {
                                imageId: images[w],
                                headers: headers,
                                image: dicomFileAsBuffer
                            }
                        )
                    }

                    series_object.push(
                        {
                            serieId: series[k],
                            images: images_object
                        });
                }

                studies_object.push(
                    {
                        studyId: studies[j],
                        series: series_object
                    }
                )
            }

            result.push(
                {
                    patientId: patients[i],
                    studies: studies_object
                }
            );
        }

        return result;
    }
    catch(e){
        return null;
    }
}

exports.isDicomDirectory = isDicomDirectory;
exports.getDicomObject = getDicomObject;