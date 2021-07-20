var express = require('express');
var router = express.Router();
var auth = require('../middlewares/auth');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.user);
  res.render('index', { title: 'Express' });
});

router.get('/protected', auth.loggedInUser, (req, res, next) => {
    res.send("Protected Resource");  
});

module.exports = router;
