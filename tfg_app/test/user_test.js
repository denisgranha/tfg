process.env.NODE_ENV = 'test'
app = require('../app.js');
config = require("../config.js");
require("./test_base.js");
var jwt = require('jsonwebtoken');

superagent = require('superagent');
expect = require('expect.js');


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
  })


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

        var user_data = {
            pass: "incorrecta",
            email:"prueba@gmail.com",
            name: "nombre de prueba"
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

    it('unknown user',function(done){
        var user_data = {
            pass: "incorrecta",
            email:"prueba@gmail.com",
            name: "nombre de prueba"
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

    it('correct login',function(done){

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
                        expect(res.status).to.be.eql(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body.status).to.be.eql("success");

                        //Check token
                        var token = jwt.decode(res.body.content.token);
                        expect(token).to.be.an('object');
                        expect(token.name).to.be.eql(user_data.name);
                        expect(token.email).to.be.eql(user_data.email);
                        done();
                    })
            })


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
                superagent.get(config.test_host+"user")
                    .end(function(e,res){
                        expect(res.status).to.be.eql(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body.status).to.be.eql("success");
                        expect(res.body.content.users).to.be.an('array');
                        expect(res.body.content.users.length).to.be.eql(1);
                        done();
                    });
            })
    });
});
