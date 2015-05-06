/**
 * Created by anger on 30/3/15.
 */

process.env.NODE_ENV = 'test'
app = require('../app.js');
config = require("../config.js");
require("./test_base.js");

superagent = require('superagent');
expect = require('expect.js');


describe('Upload Dicom Catalog', function(){

    this.timeout(5000);

    it('Not given file causes an error', function(done){
        superagent.post(config.test_host+'patient')
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
            .attach("file_upload",__dirname + "/../dicom_examples/estudio_mal.zip")
            .end(function(e, res){
                expect(res.status).to.be.eql(400);
                expect(res.body).to.be.an('object');
                expect(res.body.status).to.be.eql("error");
                expect(res.body.content.error_code).to.be.eql("file_malformed");

                done();
            });
    });

    it('Correct upload', function(done){
        superagent.post(config.test_host+'patient')
            .attach("file_upload",__dirname + "/../dicom_examples/estudio.zip")
            .end(function(e, res){
                expect(res.status).to.be.eql(200);
                expect(res.body).to.be.an('object');
                expect(res.body.status).to.be.eql("success");

                done();
            });
    });

    it('Upload of a serie that already exists', function(done){

        superagent.post(config.test_host+'patient')
            .attach("file_upload",__dirname + "/../dicom_examples/estudio.zip")
            .end(function(e, res){
                expect(res.status).to.be.eql(200);
                expect(res.body).to.be.an('object');
                expect(res.body.status).to.be.eql("success");

                superagent.post(config.test_host+'patient')
                    .attach("file_upload",__dirname + "/../dicom_examples/estudio.zip")
                    .end(function(e, res){
                        expect(res.status).to.be.eql(400);
                        expect(res.body).to.be.an('object');
                        expect(res.body.status).to.be.eql("error");

                        done();
                    });
            });
    });

    it('Upload of a new serie of a existing study', function(done){

        superagent.post(config.test_host+'patient')
            .attach("file_upload",__dirname + "/../dicom_examples/estudio.zip")
            .end(function(e, res){
                expect(res.status).to.be.eql(200);
                expect(res.body).to.be.an('object');
                expect(res.body.status).to.be.eql("success");

                superagent.post(config.test_host+'patient')
                    .attach("file_upload",__dirname + "/../dicom_examples/estudio_nueva_serie.zip")
                    .end(function(e, res){
                        expect(res.status).to.be.eql(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body.status).to.be.eql("success");

                        done();
                    });
            });
    });

});

describe('Patients CRUD operations', function(){
    it('get all patients', function(done){
        superagent.post(config.test_host+'patient')
            .attach("file_upload",__dirname + "/../dicom_examples/estudio.zip")
            .end(function(e, res){
                expect(res.status).to.be.eql(200);
                expect(res.body).to.be.an('object');
                expect(res.body.status).to.be.eql("success");

                superagent.get(config.test_host+'patient')
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