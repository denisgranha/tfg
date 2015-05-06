var nodemailer = require('nodemailer');

var config = {};

config.test_port = 3030;
config.test_host = 'http://localhost:'+config.test_port+'/';

config.frontend = "http://tfg.com.local";

config.email_data = {
    service: 'Gmail',
    auth: {
        user: 'denisgranhatfg@gmail.com',
        pass: 'passprueba'
    }
};
config.email = nodemailer.createTransport(config.email_data);

module.exports = config;