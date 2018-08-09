//this two lines are the same always, not always :p
const express = require('express');
const authRoutes  = express.Router();
//the rest are things that I installed
const passport = require ('passport');
const bcrypt   = require('bcryptjs');
//bringing over the user model/schema
const User     = require('../models/user');

authRoutes.post('/signup', (req, res, next)=> {
  const username = req.body.username;
  const password = req.body.password;
  const email    = req.body.email;


  if (username === "" || password === "") {
    res.status(400).json({message: "Please provide a username and password"})
    return;
  }

  if (password.length < 5) {
    res.status(400).json({message: "For security reasons, please create a password longer than 5 characters"})
    return;
  }


  User.findOne({username}, "_id", (err, foundUser) => {
    if (foundUser) {
      res.status(400).json({message: "The username already exists"})
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);

    let theUser = new User({username: username, password: hashPass, email: email});

    theUser.save((err) => {
    
      if(err){
        res.status(400).json({message: "Something went wrong here"});
        return;
      }

      req.login(theUser, (err) => {
        if(err) {
          res.status(500).json({message: "Something went wrong here"});
          return;
        }
        res.status(200).json(req.user);
      });
    });
  });
});


authRoutes.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, theUser, failureDetails) => {
    if(err) {
      res.status(500).json({ message: "Something went wrong here"});
      return;
    }

    if(!theUser) {
      res.status(401).json(failureDetails);
      return;
    }

    req.login(theUser, (err) => {
      if(err){
        res.status(500).json({ message: "Something went wrong here"});
        return;
      }

      res.status(200).json(req.user);
    });
  })(req, res, next);
});

authRoutes.post('/logout', (req, res, next) => {
  req.logout();
  res.status(200).json({ message: "success"});
});

authRoutes.get('/loggedin', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
    return;
  }
  res.status(403).json({ message: "Unauthorized"});
});

module.exports = authRoutes;
