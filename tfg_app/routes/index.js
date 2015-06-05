var express = require('express');
var router = express.Router();
var User = require('../models/User.js');

router.param('id', function(req,res,next,id){
  req.params.id = id;
  next();
});

router.param('patientId', function(req,res,next,patientId){
  //Todo check id
  req.params.patientId = patientId;
  next();
});

router.param('studyId', function(req,res,next,studyId){
  req.params.studyId = studyId;
  next();
});

router.param('serieId', function(req,res,next,serieId){
  req.params.serieId = serieId;
  next();
});

/* GET home page. */
router.get('/', function(req, res) {
    User.count(function(error,num){
        if(num == 0){
            res.render('create_admin',{ title: 'Crear conta de admnistración' });
        }
        else{
            res.render('index', { title: 'TFG' });
        }
    });
});

module.exports = router;
