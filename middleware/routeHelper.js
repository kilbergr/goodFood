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

  ensureCorrectPoster: function(req, res, next) {
    db.Post.findById(req.params.id, function(err,post){
      if (post.user != req.session.id) {
        res.redirect('/posts');
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
      res.redirect('/posts');
    }
    else {
     return next();
    }
  }
};
module.exports = routeHelpers;