module.exports = function(app) {

    app.use('/', require('./routes/index'));
    app.use('/user', require('./routes/user'));
    app.use('/auth', require('./routes/auth'));
    app.use('/patient', require('./routes/patient'));
    app.use('/image', require('./routes/image'));
    app.use('/admin', require('./routes/admin'));
};