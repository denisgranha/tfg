var express = require('express');
var router = express.Router();
var Image = require("../models/Image");

router.get('/:id',function(req,res,next){

    Image.find({imageId:req.params.id},function(err,docs){

        if(err) {
            res.status(400).send(
                {
                    status: "error",
                    content: {
                        description: "can't compose file",
                        error_code: "retrieve_blobs"
                    }
                }
            )
        }
        else{
            if(docs.length > 0){
                file = docs[0];
                file.retrieveBlobs(function (err) {
                    if(err) {
                        res.status(400).send(
                            {
                                status: "error",
                                content: {
                                    description: "can't compose file",
                                    error_code: "retrieve_blobs"
                                }
                            }
                        )
                    }
                    else{
                        /*

                         res.send(file.image);
                         */
                        res.set('Content-Type','Application/dicom');
                        res.setHeader('Content-disposition', 'attachment; filename='+file.imageName);
                        res.send(file.image);

                    }
                });
            }
            else{
                res.status(404).send(
                    {
                        status: "error",
                        content: {
                            description: "Unknown Image id",
                            error_code: "unknown_image"
                        }
                    }
                )
            }
        }
    });

});

module.exports = router;