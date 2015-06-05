/**
 * Created by anger on 30/3/15.
 */

process.env.NODE_ENV = 'test'
app = require('../app.js');
config = require("../config.js");
require("./test_base.js");

superagent = require('superagent');
expect = require('expect.js');
var User = require('../models/User');
var bcrypt = require('bcrypt');

var token = "";


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


describe('Upload Dicom Catalog', function(){

    this.timeout(5000);

    it('Not given file causes an error', function(done){
        superagent.post(config.test_host+'patient')
            .set('Authorization', token)
            .send({})
            .end(function(e, res){
                expect(res.status).to.be.eql(400);
                expect(res.body).to.be.an('object');
                expect(res.body.status).to.be.eql("error");
                expect(res.body.content.error_code).to.be.eql("file_needed");

                done();
            });
    });

    it('Malformed zip file causes an error', function(done){
        superagent.post(config.test_host+'patient')
            .set('Authorization', token)
            .attach("file_upload",__dirname + "/../dicom_examples/estudio_mal.zip")
            .end(function(e, res){
                expect(res.status).to.be.eql(400);
                expect(res.body).to.be.an('object');
                expect(res.body.status).to.be.eql("error");
                expect(res.body.content.error_code).to.be.eql("file_malformed");

                superagent.get(config.test_host+"patient")
                    .set("Authorization", token)
                    .end(function(e,res){
                        expect(res.status).to.be.eql(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body.status).to.be.eql("success");
                        expect(res.body.content.patients).to.be.an('array');
                        expect(res.body.content.patients.length).to.be.eql(0);
                        done();
                    });
            });
    });

    it('Correct upload', function(done){
        superagent.post(config.test_host+'patient')
            .set('Authorization', token)
            .attach("file_upload",__dirname + "/../dicom_examples/estudio.zip")
            .end(function(e, res){
                expect(res.status).to.be.eql(200);
                expect(res.body).to.be.an('object');
                expect(res.body.status).to.be.eql("success");

                superagent.get(config.test_host+"patient")
                    .set("Authorization", token)
                    .end(function(e,res){
                        expect(res.status).to.be.eql(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body.status).to.be.eql("success");
                        expect(res.body.content.patients).to.be.an('array');
                        expect(res.body.content.patients.length).to.be.eql(1);

                        superagent.get(config.test_host+"patient")
                            .set("Authorization", token)
                            .end(function(e,res){
                                expect(res.status).to.be.eql(200);
                                expect(res.body).to.be.an('object');
                                expect(res.body.status).to.be.eql("success");
                                expect(res.body.content.patients).to.be.an('array');
                                expect(res.body.content.patients.length).to.be.eql(1);
                                expect(res.body.content.patients[0].studies[0].series.length).to.be.eql(1);
                                done();
                            });
                    });
            });
    });


    it('Upload of a serie that already exists', function(done){

        superagent.post(config.test_host+'patient')
            .set('Authorization', token)
            .attach("file_upload",__dirname + "/../dicom_examples/estudio.zip")
            .end(function(e, res){
                expect(res.status).to.be.eql(200);
                expect(res.body).to.be.an('object');
                expect(res.body.status).to.be.eql("success");

                superagent.post(config.test_host+'patient')
                    .set('Authorization', token)
                    .attach("file_upload",__dirname + "/../dicom_examples/estudio.zip")
                    .end(function(e, res){
                        expect(res.status).to.be.eql(400);
                        expect(res.body).to.be.an('object');
                        expect(res.body.status).to.be.eql("error");

                        superagent.get(config.test_host+"patient")
                            .set("Authorization", token)
                            .end(function(e,res){
                                expect(res.status).to.be.eql(200);
                                expect(res.body).to.be.an('object');
                                expect(res.body.status).to.be.eql("success");
                                expect(res.body.content.patients).to.be.an('array');
                                expect(res.body.content.patients.length).to.be.eql(1);
                                expect(res.body.content.patients[0].studies[0].series.length).to.be.eql(1);
                                done();
                            });
                    });
            });
    });

    it('Upload of a new serie of a existing study', function(done){

        superagent.post(config.test_host+'patient')
            .set('Authorization', token)
            .attach("file_upload",__dirname + "/../dicom_examples/estudio.zip")
            .end(function(e, res){
                expect(res.status).to.be.eql(200);
                expect(res.body).to.be.an('object');
                expect(res.body.status).to.be.eql("success");

                superagent.post(config.test_host+'patient')
                    .set('Authorization', token)
                    .attach("file_upload",__dirname + "/../dicom_examples/estudio_nueva_serie.zip")
                    .end(function(e, res){
                        expect(res.status).to.be.eql(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body.status).to.be.eql("success");

                        superagent.get(config.test_host+"patient")
                            .set("Authorization", token)
                            .end(function(e,res){
                                expect(res.status).to.be.eql(200);
                                expect(res.body).to.be.an('object');
                                expect(res.body.status).to.be.eql("success");
                                expect(res.body.content.patients).to.be.an('array');
                                expect(res.body.content.patients.length).to.be.eql(1);
                                expect(res.body.content.patients[0].studies).to.be.an('array');
                                expect(res.body.content.patients[0].studies[0].series.length).to.be.eql(2);
                                done();
                            });
                    });
            });
    });

    it('upload of a new study of a existing user', function(done){
        superagent.post(config.test_host+'patient')
            .set('Authorization', token)
            .attach("file_upload",__dirname + "/../dicom_examples/estudio.zip")
            .end(function(e, res){
                expect(res.status).to.be.eql(200);
                expect(res.body).to.be.an('object');
                expect(res.body.status).to.be.eql("success");

                superagent.post(config.test_host+'patient')
                    .set('Authorization', token)
                    .attach("file_upload",__dirname + "/../dicom_examples/otro_estudio.zip")
                    .end(function(e, res){
                        expect(res.status).to.be.eql(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body.status).to.be.eql("success");

                        superagent.get(config.test_host+"patient")
                            .set("Authorization", token)
                            .end(function(e,res){
                                expect(res.status).to.be.eql(200);
                                expect(res.body).to.be.an('object');
                                expect(res.body.status).to.be.eql("success");
                                expect(res.body.content.patients).to.be.an('array');
                                expect(res.body.content.patients.length).to.be.eql(1);
                                expect(res.body.content.patients.studies).to.be.an("array");
                                expect(res.body.content.patients.studies.length).to.be.eql(2);
                                done();
                            });
                    });
            });
    });

});

describe('Patients CRUD operations', function(){
    it('get all patients', function(done){
        superagent.post(config.test_host+'patient')
            .set('Authorization', token)
            .attach("file_upload",__dirname + "/../dicom_examples/estudio.zip")
            .end(function(e, res){
                expect(res.status).to.be.eql(200);
                expect(res.body).to.be.an('object');
                expect(res.body.status).to.be.eql("success");

                superagent.get(config.test_host+'patient')
                    .set('Authorization', token)
                    .end(function(e, res){
                        expect(res.status).to.be.eql(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body.status).to.be.eql("success");
                        expect(res.body.content.patients).to.be.an("array");
                        expect(res.body.content.patients.length).to.be.eql(1);

                        done();
                    });
            });
    });

});