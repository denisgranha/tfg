process.env.NODE_ENV = 'test'
app = require('../app.js');
config = require("../config.js");
require("./test_base.js");

superagent = require('superagent');
expect = require('expect.js');


describe('User Signup', function(){

  it('signup user correctly', function(done){

    var user_data = {
      email:"prueba@gmail.com",
      pass:"pass"
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
          pass:"pass"
      };

      superagent.post(config.test_host+"user")
          .send(user_data)
          .end(function(e,res){
              expect(res.status).to.be.eql(400);
              expect(res.body).to.be.an('object');
              expect(res.body.status).to.be.eql("error");

              done();
          })
  });


  it('email already used, expects error', function(done){
      var user_data = {
          email:"prueba@gmail.com",
          pass:"pass"
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

                      done();
                  })
          })

  });

  it("required parameters don't given" , function(done){
      var user_data = {
          email:"sincontra@gmail.com"
      };

      superagent.post(config.test_host+"user")
          .send(user_data)
          .end(function(e,res){
              expect(res.status).to.be.eql(400);
              expect(res.body).to.be.an('object');
              expect(res.body.status).to.be.eql("error");

              done();
          })
  });

});


describe('User Login', function(){

    it('incorrect password',function(done){

        var user_data = {
            pass: "incorrecta",
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

    it('unknown user',function(done){
        var user_data = {
            pass: "incorrecta",
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

    it('correct login',function(done){
        var user_data = {
            pass: "prueba",
            email:"prueba@gmail.com"
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

                        done();
                    })
            })


    });


});
