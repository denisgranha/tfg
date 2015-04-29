var express = require('express');
var router = express.Router();
var Patient = require("../models/Patient");

router.get('/:id',function(req,res,next){
    Patient.find({"studies.series.images._id": req.params.id})
        .select("studies.series.images")
        .exec(function(e,docs){
            res.set('Content-Type','Application/dicom');
            res.send(docs[0].studies[0].series[0].images[0].image);
        });

});

module.exports = router;