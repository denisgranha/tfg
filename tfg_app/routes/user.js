var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt'); //Uso bcrypt para encriptar la contraseña
var User = require('../models/User.js');
var validator = require('validator');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var config = require("../config");


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
                            "name" : name,
                            "isActive": false
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
                                    content: {
                                        user: user
                                    }
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

router.get('/:id', function(req,res){
   User.find({_id: req.params.id}, function(error,user){
       if(error){
           res.status(400)
               .send(
               {
                   status:"error",
                   content: {
                       error_code: "cant_find_user",
                       description: error
                   }
               }
           )
       }
       else if(user.length == 0){
           res.status(400)
               .send(
               {
                   status:"error",
                   content: {
                       error_code: "unknown_user",
                       description: "The given id doesn't exists"
                   }
               }
           )
       }
       else{
           res.send(
               {
                   status: "success",
                   content: {
                       user: user
                   }
               }
           )
       }
   });
});

router.delete('/:id', function(req,res){
   User.find({_id: req.params.id}, function(error,user){
       if(error){
           res.status(400)
               .send(
               {
                   status:"error",
                   content: {
                       error_code: "cant_find_user",
                       description: error
                   }
               }
           )
       }
       else if(user.length == 0){
            res.status(400)
                .send(
                {
                    status:"error",
                    content: {
                        error_code: "unknown_user",
                        description: "The given id doesn't exists"
                    }
                }
            )
        }
       else{
            User.remove({_id: req.params.id}, function(error,deleted){
                if(error){
                    res.status(400)
                        .send(
                        {
                            status:"error",
                            content: {
                                error_code: "cant_remove_user",
                                description: "Can't remove user from the system"
                            }
                        }
                    )
                }
                res.send(
                    {
                        status: "success",
                        content: {
                            description: "The user with id: "+req.params.id+" was deleted"
                        }
                    }
                )
            })
        }
   });
});

router.post('/recovery', function(req,res){
    if(validator.isEmail(req.body.email) == false){
        res.status(400)
            .send(
            {
                status: "error",
                content: {
                    description: "email "+req.body.email+" must be of type a@b.c",
                    error_code: "email_format"
                }
            }
        )
    }
    else{
        User.find({email: req.body.email},function(error,docs){
            if(docs.length == 0){
                res.status(400)
                    .send(
                    {
                        status: "error",
                        content: {
                            description: "The email "+req.body.email+" doesn't check any user of the system",
                            error_code: "unknown_email"
                        }
                    }
                )
            }
            else{
                //generate refresh_token
                crypto.randomBytes(48, function(ex, buf) {
                    //TODO Podría haber colisión en el token generado, aunque la probabilidad es muy muy baja
                    var token = buf.toString('hex');
                    User.update(
                        {_id:docs[0]._id},
                        {
                            resetPasswordToken: token,
                            resetPasswordExpires: new Date().setHours(new Date().getHours()+1)
                        },
                        function(error,updated){
                            if(error)
                                res.status(400)
                                    .send(
                                    {
                                        status: "error",
                                        content: {
                                            description: "Couldn't update reset token of user: " + docs[0]._id,
                                            error_code: "update_user"
                                        }
                                    }
                                )
                            else{
                                //send email
                                var mail_options = {
                                    from: config.email_data.auth.user, // sender address
                                    to: docs[0].email, // list of receivers
                                    subject: 'Password recovery', // Subject line
                                    text: 'Reset token: '+ token, // plaintext body
                                    html: '<h3>Reset token</h3><a href="'+config.frontend+"/#/reset/"+token+'">Clicke aquí</a>' // html body
                                };

                                config.email.sendMail(mail_options,function(error, info){
                                    res.send(
                                        {
                                            status: "success",
                                            content: {
                                                description: "reset token generated and sended to email"
                                            }
                                        }
                                    );
                                });

                            }
                        }
                    )
                });
            }
        });
    }
});


router.post('/reset', function(req,res){
    if(validator.isAlphanumeric(req.body.token) == false){
        res.status(400)
            .send(
            {
                status: "error",
                content: {
                    description: "Token malformed",
                    error_code: "token_format"
                }
            }
        )
    }
    else if(validator.isAlphanumeric(req.body.pass) == false){
        res.status(400)
            .send(
            {
                status: "error",
                content: {
                    description: "Pass can only contain alphanumeric values",
                    error_code: "pass_format"
                }
            }
        )
    }
    else{
        //Check reset token
        User.find({
            resetPasswordToken: req.body.token
        },
        function(error,users){
            if(users.length == 0){
                res.status(400)
                    .send(
                    {
                        status: "error",
                        content: {
                            description: "Token doesn't exist",
                            error_code: "unknown_token"
                        }
                    }
                )
            }
            else if(users.length == 1){
                //Changue pass and delete token
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(req.body.pass, salt, function (err, hash) {

                        //check date
                        User.update(
                            {
                                _id: users[0]._id
                            },
                            {
                                pass: hash,
                                resetPasswordToken: null,
                                resetPasswordExpires: null
                            },
                            function(error,updated){
                                res.send(
                                    {
                                        status: "success",
                                        content: {
                                            description: "password reset"
                                        }
                                    }
                                )
                            }
                        )
                    });
                });
            }
            else{
                res.status(400)
                    .send(
                    {
                        status: "error",
                        content: {
                            description: "Duplicated Token",
                            error_code: "duplicated_token"
                        }
                    }
                )
            }
        });
    }
});


module.exports = router;
