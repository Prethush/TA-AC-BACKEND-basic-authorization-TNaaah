var express = require('express');
var router = express.Router();
var User = require('../models/users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('index');
});

//render register page
router.get('/register', (req, res, next) => {
  res.render('register');
});

//register a user
router.post('/register', (req, res, next) => {
  User.create(req.body, (err, user) => {
    res.redirect('/users/login');
    console.log(user);
  })
});

//render login page
router.get('/login', (req, res, next) => {
  let error = req.flash('error')[0];
  res.render('login', {error});
});

//process login request
router.post('/login', (req, res, next) => {
  let {email, passwd} = req.body;
  if(!email || !passwd) {
    req.flash('error', 'Password/Email Required');
    return res.redirect('/users/login');
  }
  User.findOne({email}, (err, user) => {
    if(err) return next(err);
    if(!user) {
      req.flash('error', 'Email is not registered');
      return res.redirect('/users/login');
    }
    user.verifyPasswd(passwd, (err, result) => {
      if(err) return next(err);
      if(!user) {
        req.flash('error', 'Password is incorrect');
        return res.redirect('/users/login');
      }
      req.session.userId = user.id;
      res.redirect(`${user.admin ? "/admin" : "/client"}`);
    })
  })
});

//logout user 
router.get('/logout', (req, res, next) => {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/');
});
module.exports = router;
