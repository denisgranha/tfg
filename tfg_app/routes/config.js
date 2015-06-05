var express = require('express');
var router = express.Router();
var validator = require('validator');
var User = require('../models/User');
var bcrypt = require('bcrypt');

router.post("/", function(req,res){

    User.count(function(error,num){
       if(num == 0){
           if(validator.isEmail(req.body.email) == false){
               res.render("error_formulario",{message:"Email non válido"})
           }
           else if (validator.isLength(req.body.pass,6,256) == false) {
               res.render("error_formulario",{message:"A contrasinal debe conter polo menos 6 caractéres"})

           }
           else if(req.body.name == undefined || req.body.name.length == 0){
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
               res.render("error_formulario",{message:"O nome non pode estar en branco"})
           }
           else{
               //Hash password
               bcrypt.genSalt(10, function(err, salt) {
                   bcrypt.hash(req.body.pass, salt, function(err, hash) {
                       // Store hash in your password DB.

                       // Submit to the DB
                       var user = new User(
                           {
                               "pass" : hash,
                               "email" : req.body.email,
                               "isAdmin": true,
                               "name" : req.body.name,
                               "isActive": true
                           }
                       );

                       user.save(function(err,user){
                           if(err){
                               res.render("error_formulario",{message:"Error Interno"})
                           }
                           else{
                               res.render("created_user");
                           }
                       })
                   });
               });
           }
       }
       else{
           res.render("error_formulario",{message: "O sistema xa ten usuario administrador"})
       }
    });

});

module.exports = router;