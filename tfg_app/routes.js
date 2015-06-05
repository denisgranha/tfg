var jwt = require('jsonwebtoken');
var fs = require('fs');
var User = require('./models/User');

function require_authorization(req,res,next){
    if(req.headers.authorization){
        var cert = fs.readFileSync(__dirname+'/server.key');  // get private key
        jwt.verify(req.headers.authorization,cert,{}, function(error,decoded){
            if(error){
                res.status(400)
                    .send({
                        status : "error",
                        content: {
                            error_code : "wrong_credentials",
                            description: "Malformed or expired credentials"
                        }
                    })
            }
            else{
                next();
            }
        });
    }
    else{

        if(req.method == "OPTIONS"){
            next();
        }
        else{
            res.status(400)
                .send({
                    status : "error",
                    content: {
                        error_code : "required_credentials",
                        description: "Authentication headers needed"
                    }
                });
        }

    }
}

module.exports = function(app) {


        //security decorators
        app.all("/patient*", require_authorization);
        app.all("/admin*", require_authorization);

        app.get("/user*",require_authorization);
        app.delete("/user*",require_authorization);

        app.use('/', require('./routes/index'));
        app.use('/user', require('./routes/user'));
        app.use('/auth', require('./routes/auth'));
        app.use('/patient', require('./routes/patient'));
        app.use('/image', require('./routes/image'));
        app.use('/admin', require('./routes/admin'));
        app.use('/config', require("./routes/config"));


};