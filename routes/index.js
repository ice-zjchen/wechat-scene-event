var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'X Project' });
});

router.get('/programs/:id', function(req, res, next) {
  res.render('program', {id: req.params.id});
});

module.exports = router;
