'use strict';

var mongoose = require('mongoose');

beforeEach(function(){
    //borramos base de datos de test
    mongoose.connection.db.dropDatabase(function(){

    })
});

after(function(){
    //borramos base de datos de test
    mongoose.connection.db.dropDatabase(function(){

    })
});
