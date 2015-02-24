var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt'); //Uso bcrypt para encriptar la contraseña
var User = require('../models/User.js');

/*
router.get('/', function(req, res) {
  var db = req.db;

  User.find(function(e,users){
      res.send(users);
  });


});
*/

router.post('/', function(req, res,next) {
  var db = req.db;

    req.checkBody('pass', 'Invalid postparam').notEmpty().isAlpha();
    req.checkBody('email', 'Invalid postparam').notEmpty().isEmail();

    var errors = req.validationErrors();
    if (errors) {
        res.status(400).
            send(
            {
                status : "error",
                content : {
                    description: errors
                }
            }
        );
        return;
    }


    // Get our form values. These rely on the "name" attributes
    var pass = req.body.pass;
    var email = req.body.email;

    // Check unused email
    User.find({ 'email': email }, function (err, docs) {


        if(docs.length != 0){
            res.status(400).
                send(
                {
                    message: "email already used",
                    status : "error"
                }
            );
            return next();
        }
        else{
            //Hash password
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(pass, salt, function(err, hash) {
                    // Store hash in your password DB.

                    // Submit to the DB
                    var user = new User(
                        {
                            "pass" : hash,
                            "email" : email
                        }
                    );

                    user.save(function(err,user){
                        if(err){
                            res.send(
                                500,
                                {
                                    status : "error"
                                }
                            );
                        }
                        else{
                            res.send(
                                {
                                    status : "success",
                                    content: user
                                }
                            );
                        }
                    })
                });
            });
        }
    });




});

module.exports = router;
