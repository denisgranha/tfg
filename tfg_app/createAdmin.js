var mongoose = require('mongoose');
var read = require('read')
var User = require('./models/User');
var validator = require('validator');


//Connect db
mongoose.connect('mongodb://localhost/tfg');

console.log("Introduzca los siguientes datos:\n");

read({ prompt: 'Email: '}, function(er, email) {
    if(validator.isEmail(email) == false){
        console.log("Email con formáto incorrecto");
        mongoose.connection.close();
    }
    else{
        User.find({email: email}, function(error,docs){
            if(docs.length == 0){

                read({ prompt: 'Nombre y apellidos: '}, function(er, name) {
                    read({prompt: 'Contraseña: ', silent: true}, function (er, password) {
                        if (password.length < 6) {
                            console.log("Contraseña debe tener al menos 6 caracteres");
                            mongoose.connection.close();
                        }
                        else {
                            //Check format
                            new User(
                                {
                                    pass: password,
                                    email: email,
                                    name: name,
                                    isAdmin: true,
                                    isActive: true
                                }
                            ).save(function (error, saved) {
                                    console.log("Usuario registrado con éxito");
                                    mongoose.connection.close();
                                });
                        }
                    });

                });


            }
            else{
                console.log("usuario ya registrado, promocionar a admin?");
                read({ prompt: 'y/n: '}, function(er, promote) {
                   if(promote == "y"){
                        User.update({email: email}, {isAdmin: true,isActive: true}, function(error,updated){
                            console.log("Promocionado a admin");
                            mongoose.connection.close();
                        });
                   }
                    else{
                       mongoose.connection.close();
                   }
                });
            }

        })
    }
});


