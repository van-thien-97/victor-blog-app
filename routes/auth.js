const express = require('express');
const router = express.Router();
const db = require('../db/index');
const User = require('../models/user')

router.get('/', (req, res) => {
  res.render('auth/index', {user: {}});
})

router.post('/', (req, res) => {
  const user = {
    userid: req.body.userid.trim(),
    password: req.body.password
  };
  try {
    if(user.userid == User.userId && user.password == User.password){
      req.session.user = user;
      res.redirect('/');
      return;
    }
    console.log(user)
    res.render('auth/index', {user: user});

  } catch (error) {
    res.render('auth/index', {user: user});
  }
})

router.get("/logout", function (request, response, next) {
  delete request.session.user;
  response.redirect('/');
  // response.render("./user/userLogout.ejs", viewData);
});

module.exports = router;

