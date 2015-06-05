process.env.NODE_ENV = 'test';
app = require('../app.js');
config = require("../config.js");
require("./test_base.js");
var jwt = require('jsonwebtoken');

superagent = require('superagent');
expect = require('expect.js');
var User = require('../models/User');
var bcrypt = require('bcrypt');

var token= "";
var token_admin= "";
before(function(done){

    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash("pass", salt, function (err, hash) {
            var user_data = {
                pass: hash,
                email:"activado@gmail.com",
                name: "cuenta activada",
                isAdmin: false,
                isActive: true
            };

            new User(user_data).save(
                function(error,saved){
                    user_data.pass = "pass";
                    superagent.post(config.test_host+"auth")
                        .send(user_data)
                        .end(function(e,res){

                            //Check token
                            token = res.body.content.token;
                            expect(token).to.be.an('string');
                            done();
                        });
                });
        });
    });
});
before(function(done){

    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash("pass", salt, function (err, hash) {
            var user_data = {
                pass: hash,
                email:"admin@gmail.com",
                name: "cuenta admin",
                isAdmin: true,
                isActive: true
            };

            new User(user_data).save(
                function(error,saved){
                    user_data.pass = "pass";
                    superagent.post(config.test_host+"auth")
                        .send(user_data)
                        .end(function(e,res){

                            //Check token
                            token_admin = res.body.content.token;
                            expect(token_admin).to.be.an('string');
                            done();
                        });
                });
        });
    });
});


describe('User Signup', function(){

  it('signup user correctly', function(done){

    var user_data = {
        email:"prueba@gmail.com",
        pass:"pass",
        name: "nombre de prueba"
    };

    superagent.post(config.test_host+"user")
      .send(user_data)
      .end(function(e,res){
            expect(res.status).to.be.eql(200);
            expect(res.body).to.be.an('object');
            expect(res.body.status).to.be.eql("success");

        done();
      })
  });


  it('wrong email format, expects error', function(done){
      var user_data = {
          email:"prueba",
          pass:"pass",
          name: "nombre de prueba"
      };

      superagent.post(config.test_host+"user")
          .send(user_data)
          .end(function(e,res){

              expect(res.status).to.be.eql(400);
              expect(res.body).to.be.an('object');
              expect(res.body.status).to.be.eql("error");
              expect(res.body.content.error_code).to.be.eql("email_format");

              done();
          })
  });


  it('email already used, expects error', function(done){
      var user_data = {
          email:"prueba@gmail.com",
          pass:"pass",
          name: "nombre de prueba"
      };

      superagent.post(config.test_host+"user")
          .send(user_data)
          .end(function(e,res){
              expect(res.status).to.be.eql(200);
              expect(res.body).to.be.an('object');
              expect(res.body.status).to.be.eql("success");

              superagent.post(config.test_host+"user")
                  .send(user_data)
                  .end(function(e,res){
                      expect(res.status).to.be.eql(400);
                      expect(res.body).to.be.an('object');
                      expect(res.body.status).to.be.eql("error");
                      expect(res.body.content.error_code).to.be.eql("email_used");

                      done();
                  })
          })

  });

  it("required parameters doesn't given" , function(done){
      var user_data = {
          email:"sincontra@gmail.com",
          name: "nombre de prueba"
      };

      superagent.post(config.test_host+"user")
          .send(user_data)
          .end(function(e,res){
              expect(res.status).to.be.eql(400);
              expect(res.body).to.be.an('object');
              expect(res.body.status).to.be.eql("error");
              expect(res.body.content.error_code).to.be.eql("pass_format");

              done();
          })
  });

    it("required parameter (name) doesn't gived" , function(done){
        var user_data = {
            email:"sinnombre@gmail.com",
            pass: "prueba"
        };

        superagent.post(config.test_host+"user")
            .send(user_data)
            .end(function(e,res){
                expect(res.status).to.be.eql(400);
                expect(res.body).to.be.an('object');
                expect(res.body.status).to.be.eql("error");
                expect(res.body.content.error_code).to.be.eql("name_format");

                done();
            })
    });

});


describe('User Login', function(){

    it('incorrect password',function(done){


        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash("pass", salt, function (err, hash) {

                var user_data = {
                    pass: hash+"alterada",
                    email:"tes@test.com",
                    email: "test@test.com",
                    name: "test",
                    pass: hash,
                    isAdmin: true,
                    isActive: true
                };
                new User(user_data).save(
                    function(error,saved){

                        superagent.post(config.test_host+"auth")
                            .send(user_data)
                            .end(function(e,res){
                                expect(res.status).to.be.eql(400);
                                expect(res.body).to.be.an('object');
                                expect(res.body.status).to.be.eql("error");

                                done();
                            });
                    }
                );
            });
        });
    });

    it('unknown user',function(done){
        var user_data = {
            pass: "laquesea",
            email:"prueba@gmail.com"
        };

        superagent.post(config.test_host+"auth")
            .send(user_data)
            .end(function(e,res){
                expect(res.status).to.be.eql(400);
                expect(res.body).to.be.an('object');
                expect(res.body.status).to.be.eql("error");

                done();
            })
    });

    it('login without activation',function(done){

        var user_data = {
            pass: "prueba",
            email:"prueba@gmail.com",
            name: "nombre de prueba"
        };

        superagent.post(config.test_host+"user")
            .send(user_data)
            .end(function(e,res){
                expect(res.status).to.be.eql(200);
                expect(res.body).to.be.an('object');
                expect(res.body.status).to.be.eql("success");

                superagent.post(config.test_host+"auth")
                    .send(user_data)
                    .end(function(e,res){
                        expect(res.status).to.be.eql(400);
                        expect(res.body).to.be.an('object');
                        expect(res.body.status).to.be.eql("error");
                        expect(res.body.content.error_code).to.be.eql("user_activation");

                        done();
                    })
            })


    });

    it('correct login',function(done){

        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash("prueba", salt, function (err, hash) {
                var user_data = {
                    pass: hash,
                    email:"prueba@gmail.com",
                    name: "nombre de prueba",
                    isAdmin: true,
                    isActive: true
                };

                new User(user_data).save(
                    function(error,saved){
                        user_data.pass = "prueba";
                        superagent.post(config.test_host+"auth")
                            .send(user_data)
                            .end(function(e,res){
                                expect(res.status).to.be.eql(200);
                                expect(res.body).to.be.an('object');
                                expect(res.body.status).to.be.eql("success");

                                //Check token
                                var token = jwt.decode(res.body.content.token);
                                expect(token).to.be.an('object');
                                expect(token.name).to.be.eql(user_data.name);
                                expect(token.email).to.be.eql(user_data.email);
                                done();
                            });
                    });
            });
        });


    });


});

describe('User CRUD operations', function(){
    var user_data = {
        pass: "prueba",
        email:"prueba@gmail.com",
        name: "nombre de prueba"
    };

    it('get all users', function(done){
        //Register one user and get it
        superagent.post(config.test_host+"user")
            .send(user_data)
            .end(function(e,res){
                expect(res.status).to.be.eql(200);
                expect(res.body).to.be.an('object');
                expect(res.body.status).to.be.eql("success");
                User.update({email:user_data.email},{isActive:true}, function(error,update){
                    //login cause is a secured function

                    superagent.get(config.test_host+"user")
                        .set('Authorization', token)
                        .end(function(e,res){

                            expect(res.status).to.be.eql(200);
                            expect(res.body).to.be.an('object');
                            expect(res.body.status).to.be.eql("success");
                            expect(res.body.content.users).to.be.an('array');
                            expect(res.body.content.users.length).to.be.eql(1);
                            done();
                        });

                });

            });
    });

    it('failed get all users due to authorization', function(done){
        //Register one user and get it
        superagent.post(config.test_host+"user")
            .send(user_data)
            .end(function(e,res){
                expect(res.status).to.be.eql(200);
                expect(res.body).to.be.an('object');
                expect(res.body.status).to.be.eql("success");

                    superagent.get(config.test_host+"user")
                        .set('Authorization', "nada")
                        .end(function(e,res){

                            expect(res.status).to.be.eql(400);
                            expect(res.body).to.be.an('object');
                            expect(res.body.status).to.be.eql("error");
                            expect(res.body.content.error_code).to.be.eql('wrong_credentials');
                            done();
                        });

            });
    });


    it('failed remove user', function(done){
        //Signup
        superagent.post(config.test_host+"user")
            .set('Authorization', token)
            .send(user_data)
            .end(function(e,res){
                expect(res.status).to.be.eql(200);
                expect(res.body).to.be.an('object');
                expect(res.body.status).to.be.eql("success");
                //Remove user
                var id = res.body.content.user._id;
                superagent.del(config.test_host+"user/"+id)
                    .set('Authorization', token)
                    .end(function(e,res){
                        expect(res.status).to.be.eql(400);
                        expect(res.body).to.be.an('object');
                        expect(res.body.status).to.be.eql("error");

                        //Check if was removed
                        superagent.get(config.test_host+"user/"+id)
                            .set('Authorization', token)
                            .end(function(e,res){
                                expect(res.status).to.be.eql(200);
                                expect(res.body).to.be.an('object');
                                expect(res.body.status).to.be.eql("success");
                                done();
                            });
                    });
            })
    });

    //Admin privileges
    it('correct remove user', function(done){
        //Signup
        superagent.post(config.test_host+"user")
            .set('Authorization', token_admin)
            .send(user_data)
            .end(function(e,res){
                expect(res.status).to.be.eql(200);
                expect(res.body).to.be.an('object');
                expect(res.body.status).to.be.eql("success");
                //Remove user
                var id = res.body.content.user._id;
                superagent.del(config.test_host+"user/"+id)
                    .set('Authorization', token_admin)
                    .end(function(e,res){
                        expect(res.status).to.be.eql(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body.status).to.be.eql("success");

                        //Check if was removed
                        superagent.get(config.test_host+"user/"+id)
                            .set('Authorization', token_admin)
                            .end(function(e,res){
                                expect(res.status).to.be.eql(400);
                                expect(res.body).to.be.an('object');
                                expect(res.body.content.error_code).to.be.eql("unknown_user");
                                expect(res.body.status).to.be.eql("error");
                                done();
                            });
                    });
            })
    });
});


describe('Password Recovery', function(){

    this.timeout(5000);

    var user_data = {
        pass: "prueba",
        email:"prueba@gmail.com",
        name: "nombre de prueba"
    };

    it('correct recovery', function(done){
        //signup account
        superagent.post(config.test_host+"user")
            .send(user_data)
            .end(function(e,res){
                expect(res.status).to.be.eql(200);
                expect(res.body).to.be.an('object');
                expect(res.body.status).to.be.eql("success");
                //send recovery
                superagent.post(config.test_host+"user/recovery")
                    .send({email: user_data.email})
                    .end(function(e,res){
                        expect(res.status).to.be.eql(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body.status).to.be.eql("success");

                        //get token from email

                        //renew password

                        //login
                        done();
                    });
            });


    });

    it('unexisting email', function(done){

        //signup account
        superagent.post(config.test_host+"user")
            .send(user_data)
            .end(function(e,res){
                expect(res.status).to.be.eql(200);
                expect(res.body).to.be.an('object');
                expect(res.body.status).to.be.eql("success");
                //send recovery
                superagent.post(config.test_host+"user/recovery")
                    .send({email: "noexiste@gmail.com"})
                    .end(function(e,res){
                        expect(res.status).to.be.eql(400);
                        expect(res.body).to.be.an('object');
                        expect(res.body.status).to.be.eql("error");
                        expect(res.body.content.error_code).to.be.eql("unknown_email");

                        done();
                    });
            });


    });

    it('expired recovery', function(done){
        //Can't test it
        //signup account

        //send recovery

        //get token

        //error at password update
        done();
    });


});
