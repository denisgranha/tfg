var express = require('express');
var router = express.Router();
var User = require('../models/User');

router.get('/unactivated', function(req,res){
    User.find({"isActive": {$ne: true}})
        .select("email name")
        .exec(function(error,docs){
        res.send(
            {
                status: "success",
                content: {
                    users: docs
                }
            }
        )
    });
});

router.post('/activate/:id', function(req,res){
    var id = req.params.id;

    User.update({_id: id},{isActive: true}, function(error,updated){
        if(error){
            res.status(400).
                send(
                {
                    status:"error",
                    content:{
                        error_code: "user_update",
                        description: "Couldn't update user activation status"
                    }
                }
            )
        }
        else{
            res.send({
                status: "success",
                content: {
                    message: "Activated"
                }
            })
        }
    });
});

module.exports = router;