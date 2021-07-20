var express = require('express');
var router = express.Router();
var User = require('../models/users');

//render a register page
router.get('/register', function(req, res, next) {
  res.render('register');
});

//register a user
router.post('/register', (req, res, next) => {
  let {firstName, lastName} = req.body;
  console.log(firstName, lastName);
  User.create(req.body, (err, user) => {
    if(err) return next(err);
    console.log(user.getFullName(firstName, lastName))
    res.redirect('/users/login');
  })
});

//render login page
router.get('/login', (req, res, next) => {
  let error = req.flash('error')[0];
  res.render('login', {error});
});

//login a user
router.post('/login', (req, res, next) => {
  let {email, passwd} = req.body;
  if(!email || !passwd) {
    req.flash("error", "Password/Email required");
    return res.redirect('/users/login');
  }
  User.findOne({email}, (err, user) => {
    if(err) return next(err);
    if(!user) {
      req.flash("error", ("Email is not Registered"));
      return res.redirect('/users/login');
    }
    
    user.verifyPasswd(passwd, (err, result) => {
      if(err) return next(err);
      if(!result) {
        req.flash("error", ("Password Incorrect"));
        return res.redirect('/users/login');
      }
      req.session.userId = user.id;
      req.flash("info", `Welcome ${user.getFullName(user.firstName, user.lastName)}`);
      res.redirect('/home');
    })
  })
});

//logout
router.get('/logout', (req, res, next) => {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/');
});


module.exports = router;
