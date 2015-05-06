var express = require('express');
var router = express.Router();

router.param('id', function(req,res,next,id){
  req.params.id = id;
  next();
});

/* GET home page. */
router.get('/', function(req, res) {
  //res.render('index', { title: 'Express' });
  res.send("Buenas!");
});

module.exports = router;
