'use strict';

var mongoose = require('mongoose');

beforeEach(function(){
    //borramos base de datos de test
    mongoose.connection.db.dropDatabase(function(){
    })
});

after(function(done){
    //borramos base de datos de test
    mongoose.connection.db.dropDatabase(function(){
        done();
    })
});
