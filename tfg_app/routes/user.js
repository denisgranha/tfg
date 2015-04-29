var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt'); //Uso bcrypt para encriptar la contraseña
var User = require('../models/User.js');
var validator = require('validator');


router.post('/', function(req, res,next) {
  var db = req.db;

    if(validator.isEmail(req.body.email) == false){
        res.status(400).
            send(
            {
                status : "error",
                content : {
                    description: "email must be of type a@b.c",
                    error_code: "email_format"
                }
            }
        );
        return;
    }

    if (validator.isAlphanumeric(req.body.pass) == false) {
        res.status(400).
            send(
            {
                status : "error",
                content : {
                    description: "pass must contain alphanumeric values",
                    error_code: "pass_format"
                }
            }
        );
        return;
    }

    if(req.body.name == undefined || req.body.name.length == 0){
        res.status(400).
            send(
            {
                status : "error",
                content : {
                    description: "Name can't be blank",
                    error_code: "name_format"
                }
            }
        );
        return;
    }


    // Get our form values. These rely on the "name" attributes
    var pass = req.body.pass;
    var email = req.body.email;
    var name = req.body.name;

    // Check unused email
    User.find({ 'email': email }, function (err, users) {


        if(users.length != 0){
            res.status(400).
                send(
                {
                    status : "error",
                    content: {
                        description: "email already used",
                        error_code: "email_used"
                    }
                }
            );
            return;
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
                            "email" : email,
                            "isAdmin": false,
                            "name" : name
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

router.get('/', function(req,res){
    User.find({})
        .select("email name isAdmin")
        .exec(function(error,docs){
            res.send({
                status: "success",
                content: {
                    users : docs
                }
            });
    });
});

module.exports = router;
