var db = require("../models");

var routeHelpers = {
  ensureLoggedIn: function(req, res, next) {
    if (req.session.id !== null && req.session.id !== undefined) {
      return next();
    }
    else {
     res.redirect('/login');
    }
  },

  ensureCorrectRecaller: function(req, res, next) {
    db.MyRecall.findById(req.params.id, function(err,myRecall){
      if (myRecall.user != req.session.id) {
        res.redirect('/myRecalls');
      }
      else {
       return next();
      }
    });
  },

  ensureCorrectCommenter: function(req, res, next) {
    db.Comment.findById(req.params.id, function(err,comment){
      if (comment.user != req.session.id) {
        res.redirect('/comments');
      }
      else {
       return next();
      }
    });
  },

  preventLoginSignup: function(req, res, next) {
    if (req.session.id !== null && req.session.id !== undefined) {
      res.redirect('/myRecalls');
    }
    else {
     return next();
    }
  }
};
module.exports = routeHelpers;