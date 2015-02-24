var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt'); //Uso bcrypt para encriptar la contraseña
var User = require('../models/User.js');
var jwt = require('jsonwebtoken');
var fs = require('fs');

router.post('/', function(req, res, next){
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

    var pass = req.body.pass;
    var email = req.body.email;

    User.find({'email':email}, function(err,docs){
        if(docs.length == 0){
            res.status(400).
                send(
                {
                    message: "wrong email",
                    status : "error"
                }
            );
            return next();
        }
        else{
            user = docs[0];
            bcrypt.compare(pass, user.pass, function(err, same_value) {
                if(same_value){
                    //Generamos JWT

                    var cert = fs.readFileSync(__dirname+'/../server.key');  // get private key

                    var options = {
                        algorithm: 'RS256',
                        expiresInMinutes: 60
                    };

                    var token = jwt.sign({ email: user.email },cert, options);
                    res.send(
                        {
                            status:"success",
                            content: {
                                token : token
                            }
                        }
                    );

                }
                else{
                    res.status(400).
                        send(
                        {
                            message: "wrong pass",
                            status : "error"
                        }
                    );
                }
            });

        }

    });


});

module.exports = router;